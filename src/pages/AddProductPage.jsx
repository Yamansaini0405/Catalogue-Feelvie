import { useEffect, useMemo, useState } from 'react'
import {
  createCatalogProduct,
  getCatalogCategories,
  getCatalogColors,
  getCatalogSizes,
} from '../services/authApi'

const conditionOptions = [
  { value: 'new', label: 'New' },
  { value: 'gently_used', label: 'Gently Used' },
  { value: 'worn_3_4', label: '3-4 Times Worn' },
  { value: 'fair', label: 'Fair' },
]

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

function AddProductPage() {
  const [form, setForm] = useState(initialForm)
  const [images, setImages] = useState([])
  const [categories, setCategories] = useState([])
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState([])
  const [loadingMaster, setLoadingMaster] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadMasterData = async () => {
      const token = localStorage.getItem('authToken') ?? ''
      if (!token) {
        setLoadingMaster(false)
        setError('Please login first')
        return
      }

      try {
        const [categoriesData, colorsData, sizesData] = await Promise.all([
          getCatalogCategories(token),
          getCatalogColors(token),
          getCatalogSizes(token),
        ])

        setCategories(categoriesData)
        setColors(colorsData)
        setSizes(sizesData)
      } catch (requestError) {
        setError(requestError?.message ?? 'Failed to load master data')
      } finally {
        setLoadingMaster(false)
      }
    }

    loadMasterData()
  }, [])

  const colorMap = useMemo(() => Object.fromEntries(colors.map((item) => [item.id, item])), [colors])
  const sizeMap = useMemo(() => Object.fromEntries(sizes.map((item) => [item.id, item])), [sizes])

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const toggleColor = (colorId) => {
    setForm((previous) => {
      const exists = previous.selectedColorIds.includes(colorId)
      return {
        ...previous,
        selectedColorIds: exists
          ? previous.selectedColorIds.filter((id) => id !== colorId)
          : [...previous.selectedColorIds, colorId],
      }
    })
  }

  const toggleSize = (sizeId) => {
    setForm((previous) => {
      const exists = previous.selectedSizeIds.includes(sizeId)
      return {
        ...previous,
        selectedSizeIds: exists
          ? previous.selectedSizeIds.filter((id) => id !== sizeId)
          : [...previous.selectedSizeIds, sizeId],
      }
    })
  }

  const onImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    setImages((previous) => [...previous, ...selectedFiles])
    event.target.value = ''
  }

  const removeImage = (index) => {
    setImages((previous) => {
      const selected = previous[index]
      if (selected?.previewUrl) {
        URL.revokeObjectURL(selected.previewUrl)
      }
      return previous.filter((_, itemIndex) => itemIndex !== index)
    })
  }

  useEffect(() => {
    return () => {
      images.forEach((imageItem) => {
        if (imageItem.previewUrl) {
          URL.revokeObjectURL(imageItem.previewUrl)
        }
      })
    }
  }, [images])

  const submitProduct = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const token = localStorage.getItem('authToken') ?? ''
      if (!token) throw new Error('Please login first')

      if (!form.category || form.selectedSizeIds.length === 0 || form.selectedColorIds.length === 0) {
        throw new Error('Category, sizes and colors are required')
      }

      if (form.productType !== 'new' && !form.condition.trim()) {
        throw new Error('Condition is required for used/rental items')
      }

      if (!form.description.trim()) {
        throw new Error('Product description is required')
      }

      const formData = new FormData()

      formData.append('category', String(Number(form.category)))
      formData.append('name', form.title.trim() || 'Untitled')
      formData.append('description', form.description.trim())
      formData.append('product_type', form.productType)

      if (form.sellingPrice.trim() && !Number.isNaN(Number(form.sellingPrice))) {
        formData.append('selling_price', String(Number(form.sellingPrice.trim())))
      }

      formData.append('currency', 'INR')

      if (form.productType !== 'new') {
        formData.append('condition', form.condition)
      }

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

      const pickupAddress = {
        line1: form.street.trim(),
        city: form.city.trim(),
        state: form.stateName.trim(),
        postal_code: form.pincode.trim(),
        country: 'India',
        name: '',
        phone: '',
        line2: '',
        is_default: true,
      }
      formData.append('pickup_address', JSON.stringify(pickupAddress))

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
              is_active: true,
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

      const data = await createCatalogProduct(token, formData)
      setSuccess(`Product published successfully (ID: ${data?.id ?? '-'})`)
      images.forEach((imageItem) => {
        if (imageItem.previewUrl) {
          URL.revokeObjectURL(imageItem.previewUrl)
        }
      })
      setImages([])
      setForm(initialForm)
    } catch (requestError) {
      setError(requestError?.message ?? 'Could not publish product. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className='rounded-2xl bg-white p-6 shadow-lg'>
      <h2 className='text-2xl font-bold text-slate-900'>Add Product</h2>
      <p className='mt-1 text-sm text-slate-600'>Create and publish a new catalogue product</p>

      {error && <p className='mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>{error}</p>}
      {success && <p className='mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700'>{success}</p>}

      <form onSubmit={submitProduct} className='mt-6 grid gap-4 md:grid-cols-2'>
        <label className='space-y-1'>
          <span className='text-sm text-slate-700'>Category</span>
          <select
            name='category'
            value={form.category}
            onChange={onChange}
            required
            disabled={loadingMaster}
            className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
          >
            <option value=''>Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className='space-y-1'>
          <span className='text-sm text-slate-700'>Title</span>
          <input
            name='title'
            value={form.title}
            onChange={onChange}
            placeholder='Product title'
            className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
          />
        </label>

        <label className='space-y-1 md:col-span-2'>
          <span className='text-sm text-slate-700'>Description *</span>
          <textarea
            name='description'
            value={form.description}
            onChange={onChange}
            rows={4}
            required
            className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
          />
        </label>

        <label className='space-y-1'>
          <span className='text-sm text-slate-700'>Product Type</span>
          <select
            name='productType'
            value={form.productType}
            onChange={onChange}
            className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
          >
            <option value='new'>New</option>
            <option value='used'>Used</option>
            <option value='rental'>Rental</option>
          </select>
        </label>

        <label className='space-y-1'>
          <span className='text-sm text-slate-700'>Condition</span>
          <select
            name='condition'
            value={form.condition}
            onChange={onChange}
            disabled={form.productType === 'new'}
            className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 disabled:bg-slate-100'
          >
            {conditionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className='space-y-1'>
          <span className='text-sm text-slate-700'>Original Price</span>
          <input
            name='originalPrice'
            type='number'
            value={form.originalPrice}
            onChange={onChange}
            placeholder='0'
            className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
          />
        </label>

        <label className='space-y-1'>
          <span className='text-sm text-slate-700'>Selling Price</span>
          <input
            name='sellingPrice'
            type='number'
            value={form.sellingPrice}
            onChange={onChange}
            placeholder='0'
            className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
          />
        </label>

        <label className='space-y-1 col-span-2'>
          <span className='text-sm text-slate-700'>Stock Quantity</span>
          <input
            name='stock'
            type='number'
            value={form.stock}
            onChange={onChange}
            required
            min='0'
            className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
          />
        </label>

        <div className='space-y-2'>
          <p className='text-sm text-slate-700'>Colors </p>
          <div className='max-h-40 space-y-2 overflow-auto rounded-lg border border-slate-300 p-2'>
            {colors.map((color) => (
              <label key={color.id} className='flex items-center gap-2 text-sm text-slate-700'>
                <input
                  type='checkbox'
                  checked={form.selectedColorIds.includes(color.id)}
                  onChange={() => toggleColor(color.id)}
                />
                <span>{color.name}</span>
                <span className='text-xs text-slate-500'>{color.hex_code}</span>
              </label>
            ))}
          </div>
        </div>

        <div className='space-y-2'>
          <p className='text-sm text-slate-700'>Sizes </p>
          <div className='max-h-40 space-y-2 overflow-auto rounded-lg border border-slate-300 p-2'>
            {sizes.map((size) => (
              <label key={size.id} className='flex items-center gap-2 text-sm text-slate-700'>
                <input
                  type='checkbox'
                  checked={form.selectedSizeIds.includes(size.id)}
                  onChange={() => toggleSize(size.id)}
                />
                <span>{size.size_display ?? size.size}</span>
              </label>
            ))}
          </div>
        </div>

        <label className='space-y-1 md:col-span-2'>
          <span className='text-sm text-slate-700'>Product Images</span>
          <input
            type='file'
            accept='image/*'
            multiple
            onChange={onImageChange}
            className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'
          />
        </label>

        {images.length > 0 && (
          <div className='grid gap-3 md:col-span-2 sm:grid-cols-2 lg:grid-cols-4'>
            {images.map((imageItem, index) => (
              <article key={`${imageItem.file.name}-${index}`} className='rounded-lg border border-slate-200 p-2'>
                <img
                  src={imageItem.previewUrl}
                  alt={imageItem.file.name}
                  className='h-28 w-full rounded object-cover'
                />
                <p className='mt-1 truncate text-xs text-slate-600'>{imageItem.file.name}</p>
                <button
                  type='button'
                  onClick={() => removeImage(index)}
                  className='mt-2 w-full rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-700'
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
        )}

        

        {form.productType === 'rental' && (
          <>
            <label className='space-y-1'>
              <span className='text-sm text-slate-700'>Rental Price / Day</span>
              <input
                name='rentalPricePerDay'
                value={form.rentalPricePerDay}
                onChange={onChange}
                className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
              />
            </label>

            <label className='space-y-1'>
              <span className='text-sm text-slate-700'>Late Return Penalty</span>
              <input
                name='lateReturnPenalty'
                value={form.lateReturnPenalty}
                onChange={onChange}
                className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
              />
            </label>

            <label className='space-y-1'>
              <span className='text-sm text-slate-700'>Damage Protection Fee</span>
              <input
                name='damageProtectionFee'
                value={form.damageProtectionFee}
                onChange={onChange}
                className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
              />
            </label>

            <label className='space-y-1'>
              <span className='text-sm text-slate-700'>Rental From</span>
              <input
                type='date'
                name='rentalFrom'
                value={form.rentalFrom}
                onChange={onChange}
                className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
              />
            </label>

            <label className='space-y-1'>
              <span className='text-sm text-slate-700'>Rental To</span>
              <input
                type='date'
                name='rentalTo'
                value={form.rentalTo}
                onChange={onChange}
                className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
              />
            </label>

            <label className='space-y-1'>
              <span className='text-sm text-slate-700'>Min Rental Days</span>
              <input
                name='minRentalDays'
                value={form.minRentalDays}
                onChange={onChange}
                className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
              />
            </label>

            <label className='space-y-1'>
              <span className='text-sm text-slate-700'>Max Rental Days</span>
              <input
                name='maxRentalDays'
                value={form.maxRentalDays}
                onChange={onChange}
                className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
              />
            </label>
          </>
        )}

        <div className='md:col-span-2'>
          <button
            type='submit'
            disabled={submitting}
            className='w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60'
          >
            {submitting ? 'Publishing...' : 'Publish Product'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AddProductPage
