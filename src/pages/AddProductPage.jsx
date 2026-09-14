import { ImagePlus, PackagePlus, Palette, Ruler, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { createProduct } from '../api'
import ColorPicker from '../components/products/ColorPicker'
import { Alert, Button, Card, Checkbox, FileDropzone, FormField, Input, PageHeader, Select, Textarea } from '../components/ui'
import { CONDITION_OPTIONS, PRODUCT_TYPE_OPTIONS } from '../constants/productOptions'
import { useAuth } from '../hooks/useAuth'
import { useCatalogMasterData } from '../hooks/useCatalogMasterData'
import { useToast } from '../hooks/useToast'

const initialForm = {
  category: '',
  title: '',
  description: '',
  productType: 'new',
  condition: 'new',
  originalPrice: '',
  sellingPrice: '',
  stock: '1',
  selectedColorIds: [],
  selectedSizeIds: [],
  street: '',
  city: '',
  stateName: '',
  pincode: '',
  rentalPricePerDay: '',
  lateReturnPenalty: '',
  damageProtectionFee: '',
  rentalFrom: '',
  rentalTo: '',
  minRentalDays: '',
  maxRentalDays: '',
}

export default function AddProductPage() {
  const { token } = useAuth()
  const toast = useToast()
  const { categories, colors, sizes, loading: loadingMaster, error: masterError } = useCatalogMasterData(token)

  const [form, setForm] = useState(initialForm)
  const [images, setImages] = useState([])
  const [customColors, setCustomColors] = useState([])
  const [newColorHex, setNewColorHex] = useState('#FF0000')
  const [newColorName, setNewColorName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (masterError) setError(masterError)
  }, [masterError])

  const colorMap = useMemo(() => {
    const serverMap = Object.fromEntries(colors.map((item) => [item.id, item]))
    const customMap = Object.fromEntries(customColors.map((item) => [item.id, item]))
    return { ...serverMap, ...customMap }
  }, [colors, customColors])
  const sizeMap = useMemo(() => Object.fromEntries(sizes.map((item) => [item.id, item])), [sizes])

  const variantCount = form.selectedColorIds.length * form.selectedSizeIds.length

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const toggleColor = (colorId) => {
    setForm((previous) => ({
      ...previous,
      selectedColorIds: previous.selectedColorIds.includes(colorId)
        ? previous.selectedColorIds.filter((id) => id !== colorId)
        : [...previous.selectedColorIds, colorId],
    }))
  }

  const toggleSize = (sizeId) => {
    setForm((previous) => ({
      ...previous,
      selectedSizeIds: previous.selectedSizeIds.includes(sizeId)
        ? previous.selectedSizeIds.filter((id) => id !== sizeId)
        : [...previous.selectedSizeIds, sizeId],
    }))
  }

  const addCustomColor = () => {
    if (!newColorHex.trim() || !newColorName.trim()) {
      setError('Please enter both color name and hex code')
      return
    }
    const colorId = `custom-${Date.now()}`
    setCustomColors((previous) => [...previous, { id: colorId, name: newColorName.trim(), hex_code: newColorHex, isCustom: true }])
    setForm((previous) => ({ ...previous, selectedColorIds: [...previous.selectedColorIds, colorId] }))
    setNewColorName('')
    setNewColorHex('#FF0000')
    setError('')
  }

  const removeCustomColor = (colorId) => {
    setCustomColors((previous) => previous.filter((color) => color.id !== colorId))
    setForm((previous) => ({ ...previous, selectedColorIds: previous.selectedColorIds.filter((id) => id !== colorId) }))
  }

  const onImageFiles = (files) => {
    const selected = files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))
    setImages((previous) => [...previous, ...selected])
  }

  const removeImage = (index) => {
    setImages((previous) => {
      const selected = previous[index]
      if (selected?.previewUrl) URL.revokeObjectURL(selected.previewUrl)
      return previous.filter((_, itemIndex) => itemIndex !== index)
    })
  }

  useEffect(() => {
    return () => {
      images.forEach((imageItem) => imageItem.previewUrl && URL.revokeObjectURL(imageItem.previewUrl))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetForm = () => {
    images.forEach((imageItem) => imageItem.previewUrl && URL.revokeObjectURL(imageItem.previewUrl))
    setImages([])
    setForm(initialForm)
    setCustomColors([])
  }

  const submitProduct = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!token) {
      setError('Please login first')
      return
    }
    if (!form.category || form.selectedSizeIds.length === 0 || form.selectedColorIds.length === 0) {
      setError('Category, sizes and colors are required')
      return
    }
    if (form.productType !== 'new' && !form.condition.trim()) {
      setError('Condition is required for used/rental items')
      return
    }
    if (!form.description.trim()) {
      setError('Product description is required')
      return
    }

    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('category', String(Number(form.category)))
      formData.append('name', form.title.trim() || 'Untitled')
      formData.append('description', form.description.trim())
      formData.append('product_type', form.productType)

      if (form.sellingPrice.trim() && !Number.isNaN(Number(form.sellingPrice))) {
        formData.append('selling_price', String(Number(form.sellingPrice.trim())))
      }
      formData.append('currency', 'INR')
      if (form.productType !== 'new') formData.append('condition', form.condition)
      formData.append('status', 'published')
      formData.append('shipping_option', 'pickup')
      formData.append('base_sku', `SKU-${Date.now()}`)
      formData.append('stock_quantity', String(Number(form.stock.trim() || '0')))
      formData.append('is_active', 'true')

      if (form.originalPrice.trim() && !Number.isNaN(Number(form.originalPrice))) {
        formData.append('original_price', String(Number(form.originalPrice.trim())))
      }

      if (form.productType === 'rental') {
        if (form.rentalPricePerDay.trim()) formData.append('rental_price_per_day', form.rentalPricePerDay.trim())
        if (form.lateReturnPenalty.trim()) formData.append('late_return_penalty', form.lateReturnPenalty.trim())
        if (form.damageProtectionFee.trim()) formData.append('damage_protection_fee', form.damageProtectionFee.trim())
        if (form.rentalFrom) formData.append('rental_from', form.rentalFrom)
        if (form.rentalTo) formData.append('rental_to', form.rentalTo)
        if (form.minRentalDays.trim()) formData.append('min_rental_days', form.minRentalDays.trim())
        if (form.maxRentalDays.trim()) formData.append('max_rental_days', form.maxRentalDays.trim())
      }

      formData.append(
        'pickup_address',
        JSON.stringify({
          line1: form.street.trim(),
          city: form.city.trim(),
          state: form.stateName.trim(),
          postal_code: form.pincode.trim(),
          country: 'India',
          name: '',
          phone: '',
          line2: '',
          is_default: true,
        }),
      )

      const variants = form.selectedColorIds
        .map((colorId) =>
          form.selectedSizeIds.map((sizeId) => {
            const colorName = colorMap[colorId]?.name ?? `color-${colorId}`
            const sizeName = sizeMap[sizeId]?.size_display ?? sizeMap[sizeId]?.size ?? `size-${sizeId}`
            return {
              colorId,
              sizeId,
              sku: `VAR-${colorName}-${sizeName}-${Date.now().toString().slice(-6)}`,
              quantity: 1,
            }
          }),
        )
        .flat()

      variants.forEach((variant, index) => {
        formData.append(`variants[${index}]color_id`, String(variant.colorId))
        formData.append(`variants[${index}]size_id`, String(variant.sizeId))
        formData.append(`variants[${index}]sku`, variant.sku)
        formData.append(`variants[${index}]quantity`, String(variant.quantity))
        formData.append(`variants[${index}]is_active`, 'true')
      })

      images.forEach((imageItem, index) => {
        formData.append(`images[${index}]image`, imageItem.file)
        formData.append(`images[${index}]alt_text`, `Product image ${index + 1}`)
        formData.append(`images[${index}]sort_order`, String(index))
      })

      const data = await createProduct(token, formData)
      setSuccess(`Product published successfully (ID: ${data?.id ?? '-'})`)
      toast.success('Product published successfully')
      resetForm()
    } catch (requestError) {
      setError(requestError?.message ?? 'Could not publish product. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <PageHeader title="Add product" description="Create and publish a new catalogue product" />

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <form onSubmit={submitProduct} className="space-y-6">
        <Card>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Basic details</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Category" required>
              <Select name="category" value={form.category} onChange={onChange} required disabled={loadingMaster}>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Title">
              <Input name="title" value={form.title} onChange={onChange} placeholder="Product title" />
            </FormField>

            <FormField label="Description" required className="md:col-span-2">
              <Textarea name="description" value={form.description} onChange={onChange} rows={4} required />
            </FormField>

            <FormField label="Product type">
              <Select name="productType" value={form.productType} onChange={onChange}>
                {PRODUCT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Condition">
              <Select name="condition" value={form.condition} onChange={onChange} disabled={form.productType === 'new'}>
                {CONDITION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Original price">
              <Input name="originalPrice" type="number" value={form.originalPrice} onChange={onChange} placeholder="0" />
            </FormField>

            <FormField label="Selling price">
              <Input name="sellingPrice" type="number" value={form.sellingPrice} onChange={onChange} placeholder="0" />
            </FormField>

            <FormField label="Stock quantity" required className="md:col-span-2">
              <Input name="stock" type="number" min="0" value={form.stock} onChange={onChange} required />
            </FormField>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <Palette size={14} /> Colors
            </h3>
            <div className="max-h-64 space-y-2 overflow-auto rounded-xl border border-slate-200 p-3">
              {colors.length === 0 && customColors.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">No colors available yet</p>
              ) : (
                <>
                  {colors.map((color) => (
                    <label
                      key={color.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-2 transition-colors hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={form.selectedColorIds.includes(color.id)}
                        onChange={() => toggleColor(color.id)}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-brand-600"
                      />
                      <span className="h-6 w-6 rounded-md border border-slate-300" style={{ backgroundColor: color.hex_code }} title={color.hex_code} />
                      <span className="flex-1 text-sm text-slate-700">{color.name}</span>
                      <span className="font-mono text-xs text-slate-400">{color.hex_code}</span>
                    </label>
                  ))}

                  {customColors.map((color) => (
                    <div key={color.id} className="flex items-center gap-3 rounded-lg border border-gold-200 bg-gold-50 p-2">
                      <input
                        type="checkbox"
                        checked={form.selectedColorIds.includes(color.id)}
                        onChange={() => toggleColor(color.id)}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-brand-600"
                      />
                      <span className="h-6 w-6 rounded-md border border-slate-300" style={{ backgroundColor: color.hex_code }} title={color.hex_code} />
                      <span className="flex-1 text-sm text-slate-700">{color.name}</span>
                      <button type="button" onClick={() => removeCustomColor(color.id)} className="text-xs font-medium text-gold-600 hover:text-gold-700">
                        Remove
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Add custom color</p>
              <Input value={newColorName} onChange={(event) => setNewColorName(event.target.value)} placeholder="Color name (e.g. Sky Blue)" />
              <ColorPicker hexCode={newColorHex} onColorSelect={setNewColorHex} />
              <Button type="button" variant="dark" onClick={addCustomColor} className="w-full">
                Add color
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <Ruler size={14} /> Sizes
            </h3>
            <div className="max-h-64 space-y-2 overflow-auto rounded-xl border border-slate-200 p-3">
              {sizes.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">No sizes available yet</p>
              ) : (
                sizes.map((size) => (
                  <label
                    key={size.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-2 transition-colors hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={form.selectedSizeIds.includes(size.id)}
                      onChange={() => toggleSize(size.id)}
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 text-brand-600"
                    />
                    <span className="flex-1 text-sm font-medium text-slate-700">{size.size_display ?? size.size}</span>
                  </label>
                ))
              )}
            </div>

            {variantCount > 0 && (
              <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs font-medium text-brand-700">
                This will create {variantCount} variant{variantCount === 1 ? '' : 's'} from your color × size selection.
              </p>
            )}
          </Card>
        </div>

        <Card>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <ImagePlus size={14} /> Product images
          </h3>
          <FileDropzone onFiles={onImageFiles} label="Click to upload or drag product photos" hint="You can add multiple images" />

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {images.map((imageItem, index) => (
                <div key={`${imageItem.file.name}-${index}`} className="group relative overflow-hidden rounded-lg border border-slate-200">
                  <img src={imageItem.previewUrl} alt={imageItem.file.name} className="h-24 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-red-600 opacity-0 shadow-soft transition group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Pickup address</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Street" className="md:col-span-2">
              <Input name="street" value={form.street} onChange={onChange} />
            </FormField>
            <FormField label="City">
              <Input name="city" value={form.city} onChange={onChange} />
            </FormField>
            <FormField label="State">
              <Input name="stateName" value={form.stateName} onChange={onChange} />
            </FormField>
            <FormField label="Pincode">
              <Input name="pincode" value={form.pincode} onChange={onChange} />
            </FormField>
          </div>
        </Card>

        {form.productType === 'rental' && (
          <Card>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Rental settings</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Rental price / day">
                <Input name="rentalPricePerDay" value={form.rentalPricePerDay} onChange={onChange} />
              </FormField>
              <FormField label="Late return penalty">
                <Input name="lateReturnPenalty" value={form.lateReturnPenalty} onChange={onChange} />
              </FormField>
              <FormField label="Damage protection fee">
                <Input name="damageProtectionFee" value={form.damageProtectionFee} onChange={onChange} />
              </FormField>
              <FormField label="Min rental days">
                <Input name="minRentalDays" value={form.minRentalDays} onChange={onChange} />
              </FormField>
              <FormField label="Max rental days">
                <Input name="maxRentalDays" value={form.maxRentalDays} onChange={onChange} />
              </FormField>
              <FormField label="Rental from">
                <Input type="date" name="rentalFrom" value={form.rentalFrom} onChange={onChange} />
              </FormField>
              <FormField label="Rental to">
                <Input type="date" name="rentalTo" value={form.rentalTo} onChange={onChange} />
              </FormField>
            </div>
          </Card>
        )}

        <Button type="submit" size="lg" icon={PackagePlus} loading={submitting} className="w-full">
          {submitting ? 'Publishing…' : 'Publish product'}
        </Button>
      </form>
    </section>
  )
}
