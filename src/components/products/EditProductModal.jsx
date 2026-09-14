import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { getProductById, updateProductById } from '../../api'
import { Modal, Button, FormField, Input, Select, Textarea, Checkbox, Alert, LoadingBlock } from '../ui'
import { PRODUCT_STATUS_OPTIONS, PRODUCT_TYPE_OPTIONS } from '../../constants/productOptions'

const initialEditForm = {
  category: '',
  name: '',
  description: '',
  productType: 'new',
  condition: 'new',
  originalPrice: '',
  sellingPrice: '',
  stockQuantity: '0',
  status: 'published',
  isActive: true,
}

export default function EditProductModal({ productId, token, categories, onClose, onSaved, onError }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [productSnapshot, setProductSnapshot] = useState(null)
  const [form, setForm] = useState(initialEditForm)
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const product = await getProductById(productId)
        if (cancelled) return
        setProductSnapshot(product)
        setForm({
          category: product?.category ? String(product.category) : '',
          name: product?.name ?? '',
          description: product?.description ?? '',
          productType: product?.product_type ?? 'new',
          condition: product?.condition ?? 'new',
          originalPrice: product?.original_price ?? '',
          sellingPrice: product?.selling_price ?? '',
          stockQuantity: String(product?.stock_quantity ?? '0'),
          status: product?.status ?? 'published',
          isActive: Boolean(product?.is_active),
        })
        setExistingImages(
          (product?.images ?? []).map((image) => ({
            id: image.id,
            image_url: image?.image_url || image?.image,
            alt_text: image?.alt_text || `Product image ${image?.sort_order ?? 0}`,
            sort_order: image?.sort_order ?? 0,
          })),
        )
      } catch (requestError) {
        if (!cancelled) setError(requestError?.message ?? 'Failed to load product details')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [productId])

  useEffect(() => {
    return () => {
      newImages.forEach((imageItem) => imageItem?.previewUrl && URL.revokeObjectURL(imageItem.previewUrl))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onFieldChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }))
  }

  const onImageChange = (event) => {
    const selected = Array.from(event.target.files ?? []).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      alt_text: file.name,
    }))
    setNewImages((previous) => [...previous, ...selected])
    event.target.value = ''
  }

  const removeNewImage = (index) => {
    setNewImages((previous) => {
      const item = previous[index]
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl)
      return previous.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!productSnapshot) return

    setSaving(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('category', form.category ? String(Number(form.category)) : String(productSnapshot.category))
      formData.append('name', form.name.trim())
      formData.append('description', form.description.trim())
      formData.append('product_type', form.productType)
      formData.append('currency', productSnapshot?.currency || 'INR')
      if (form.productType !== 'new') formData.append('condition', form.condition)
      formData.append('shipping_option', productSnapshot?.shipping_option || 'pickup')
      formData.append('base_sku', productSnapshot?.base_sku || `SKU-${Date.now()}`)
      formData.append('stock_quantity', String(Number(form.stockQuantity || 0)))
      formData.append('status', form.status)
      formData.append('is_active', form.isActive ? 'true' : 'false')

      if (productSnapshot?.pickup_address) {
        formData.append(
          'pickup_address',
          typeof productSnapshot.pickup_address === 'string'
            ? productSnapshot.pickup_address
            : JSON.stringify(productSnapshot.pickup_address),
        )
      }

      if (form.originalPrice !== '') {
        formData.append('original_price', String(Number(form.originalPrice)))
      } else if (productSnapshot?.original_price) {
        formData.append('original_price', String(Number(productSnapshot.original_price)))
      }

      if (form.sellingPrice !== '') {
        formData.append('selling_price', String(Number(form.sellingPrice)))
      } else if (productSnapshot?.selling_price) {
        formData.append('selling_price', String(Number(productSnapshot.selling_price)))
      }

      if (form.productType === 'rental') {
        if (productSnapshot?.rental_price_per_day) formData.append('rental_price_per_day', String(productSnapshot.rental_price_per_day))
        if (productSnapshot?.late_return_penalty) formData.append('late_return_penalty', String(productSnapshot.late_return_penalty))
        if (productSnapshot?.damage_protection_fee) formData.append('damage_protection_fee', String(productSnapshot.damage_protection_fee))
      }

      const variants = Array.isArray(productSnapshot?.variants) ? productSnapshot.variants : []
      variants.forEach((variant, index) => {
        formData.append(`variants[${index}]color_id`, String(variant?.color?.id ?? 0))
        formData.append(`variants[${index}]size_id`, String(variant?.size?.id ?? 0))
        formData.append(`variants[${index}]quantity`, String(variant?.quantity ?? 1))
        formData.append(`variants[${index}]is_active`, variant?.is_active ? 'true' : 'false')
      })

      if (newImages.length > 0) {
        const startingIndex = existingImages.length
        newImages.forEach((imageItem, index) => {
          const finalIndex = startingIndex + index
          formData.append(`images[${finalIndex}]image`, imageItem.file)
          formData.append(`images[${finalIndex}]alt_text`, imageItem.alt_text || `Product image ${finalIndex}`)
          formData.append(`images[${finalIndex}]sort_order`, String(finalIndex))
        })
      }

      await updateProductById(token, productId, formData)
      onSaved?.()
    } catch (requestError) {
      const message = requestError?.message ?? 'Failed to update product'
      setError(message)
      onError?.(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open onClose={onClose} title="Edit product" description="Update details and save your changes" size="lg" dismissible={!saving}>
      {loading ? (
        <LoadingBlock label="Loading product details…" />
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {error && (
            <div className="md:col-span-2">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          <FormField label="Category">
            <Select name="category" value={form.category} onChange={onFieldChange}>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Product name" required>
            <Input name="name" value={form.name} onChange={onFieldChange} required />
          </FormField>

          <FormField label="Description" required className="md:col-span-2">
            <Textarea name="description" value={form.description} onChange={onFieldChange} rows={4} required />
          </FormField>

          <FormField label="Product type">
            <Select name="productType" value={form.productType} onChange={onFieldChange}>
              {PRODUCT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Condition">
            <Input name="condition" value={form.condition} onChange={onFieldChange} />
          </FormField>

          <FormField label="Original price">
            <Input name="originalPrice" type="number" value={form.originalPrice} onChange={onFieldChange} />
          </FormField>

          <FormField label="Selling price">
            <Input name="sellingPrice" type="number" value={form.sellingPrice} onChange={onFieldChange} />
          </FormField>

          <FormField label="Stock quantity">
            <Input name="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={onFieldChange} />
          </FormField>

          <FormField label="Status">
            <Select name="status" value={form.status} onChange={onFieldChange}>
              {PRODUCT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="md:col-span-2">
            <Checkbox name="isActive" checked={form.isActive} onChange={onFieldChange} label="Product is active" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <p className="text-sm font-medium text-slate-700">Current images</p>
            {existingImages.length === 0 ? (
              <p className="text-sm text-slate-500">No existing images.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {existingImages.map((image) => (
                  <div key={image.id} className="overflow-hidden rounded-lg border border-slate-200">
                    {image?.image_url ? (
                      <img src={image.image_url} alt={image.alt_text} className="h-24 w-full object-cover" />
                    ) : (
                      <div className="h-24 w-full bg-slate-100" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <FormField label="Add new images" className="md:col-span-2">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onImageChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand-700"
            />
          </FormField>

          {newImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:col-span-2">
              {newImages.map((imageItem, index) => (
                <div key={`${imageItem.previewUrl}-${index}`} className="relative overflow-hidden rounded-lg border border-slate-200">
                  <img src={imageItem.previewUrl} alt="New upload" className="h-24 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-red-600 shadow-soft hover:bg-white"
                    aria-label="Remove image"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-2 flex justify-end gap-2 md:col-span-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save changes
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
