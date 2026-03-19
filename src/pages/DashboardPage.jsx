import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getCatalogCategories,
  getCatalogProductById,
  getCatalogProducts,
  updateCatalogProductById,
} from '../services/authApi'

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

function DashboardPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [shareMessage, setShareMessage] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState('')
  const [editProductId, setEditProductId] = useState(null)
  const [editProductDetails, setEditProductDetails] = useState(null)
  const [editForm, setEditForm] = useState(initialEditForm)
  const [existingEditImages, setExistingEditImages] = useState([])
  const [newEditImages, setNewEditImages] = useState([])

  const fetchProducts = async () => {
    const token = localStorage.getItem('authToken') ?? ''

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    try {
      const data = await getCatalogProducts(token)
      setProducts(data)
    } catch (requestError) {
      setError(requestError?.message ?? 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [navigate])

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('authToken') ?? ''
      if (!token) return

      try {
        const categoriesData = await getCatalogCategories(token)
        setCategories(categoriesData)
      } catch {
        setCategories([])
      }
    }

    fetchCategories()
  }, [])

  const copyProductLink = async (productId) => {
    const shareUrl = `${window.location.origin}/product/${productId}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareMessage('Share link copied')
      window.setTimeout(() => setShareMessage(''), 1800)
    } catch {
      setShareMessage('Unable to copy link')
      window.setTimeout(() => setShareMessage(''), 1800)
    }
  }

  const onEditFieldChange = (event) => {
    const { name, value, type, checked } = event.target
    setEditForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const onEditImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      alt_text: file.name,
    }))

    setNewEditImages((previous) => [...previous, ...selectedFiles])
    event.target.value = ''
  }

  const removeNewEditImage = (index) => {
    setNewEditImages((previous) => {
      const selected = previous[index]
      if (selected?.previewUrl) {
        URL.revokeObjectURL(selected.previewUrl)
      }
      return previous.filter((_, itemIndex) => itemIndex !== index)
    })
  }

  const openEditModal = async (productId) => {
    setEditError('')
    setEditLoading(true)
    setIsEditModalOpen(true)
    setEditProductId(productId)

    try {
      const product = await getCatalogProductById(productId)
      setEditProductDetails(product)
      setEditForm({
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
      setExistingEditImages(
        (product?.images ?? []).map((image) => ({
          id: image.id,
          image_url: image?.image_url || image?.image,
          alt_text: image?.alt_text || `Product image ${image?.sort_order ?? 0}`,
          sort_order: image?.sort_order ?? 0,
        })),
      )
      setNewEditImages([])
    } catch (requestError) {
      setEditError(requestError?.message ?? 'Failed to load product details')
    } finally {
      setEditLoading(false)
    }
  }

  const closeEditModal = (forceClose = false) => {
    if (editSaving && !forceClose) return

    newEditImages.forEach((imageItem) => {
      if (imageItem?.previewUrl) {
        URL.revokeObjectURL(imageItem.previewUrl)
      }
    })

    setIsEditModalOpen(false)
    setEditProductId(null)
    setEditProductDetails(null)
    setEditError('')
    setEditForm(initialEditForm)
    setExistingEditImages([])
    setNewEditImages([])
  }

  const saveProductEdits = async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('authToken') ?? ''

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    if (!editProductId) return

    setEditSaving(true)
    setEditError('')

    try {
      const productSnapshot = editProductDetails
      if (!productSnapshot) {
        throw new Error('Product data unavailable. Please reopen edit modal.')
      }

      const formData = new FormData()

      formData.append('category', editForm.category ? String(Number(editForm.category)) : String(productSnapshot.category))
      formData.append('name', editForm.name.trim())
      formData.append('description', editForm.description.trim())
      formData.append('product_type', editForm.productType)
      formData.append('currency', productSnapshot?.currency || 'INR')
      if (editForm.productType !== 'new') {
        formData.append('condition', editForm.condition)
      }
      formData.append('shipping_option', productSnapshot?.shipping_option || 'pickup')
      formData.append('base_sku', productSnapshot?.base_sku || `SKU-${Date.now()}`)
      formData.append('stock_quantity', String(Number(editForm.stockQuantity || 0)))
      formData.append('status', editForm.status)
      formData.append('is_active', editForm.isActive ? 'true' : 'false')

      if (productSnapshot?.pickup_address) {
        formData.append(
          'pickup_address',
          typeof productSnapshot.pickup_address === 'string'
            ? productSnapshot.pickup_address
            : JSON.stringify(productSnapshot.pickup_address),
        )
      }

      if (editForm.originalPrice !== '') {
        formData.append('original_price', String(Number(editForm.originalPrice)))
      } else if (productSnapshot?.original_price) {
        formData.append('original_price', String(Number(productSnapshot.original_price)))
      }

      if (editForm.sellingPrice !== '') {
        formData.append('selling_price', String(Number(editForm.sellingPrice)))
      } else if (productSnapshot?.selling_price) {
        formData.append('selling_price', String(Number(productSnapshot.selling_price)))
      }

      if (editForm.productType === 'rental') {
        if (productSnapshot?.rental_price_per_day) {
          formData.append('rental_price_per_day', String(productSnapshot.rental_price_per_day))
        }
        if (productSnapshot?.late_return_penalty) {
          formData.append('late_return_penalty', String(productSnapshot.late_return_penalty))
        }
        if (productSnapshot?.damage_protection_fee) {
          formData.append('damage_protection_fee', String(productSnapshot.damage_protection_fee))
        }
      }

      const variants = Array.isArray(productSnapshot?.variants) ? productSnapshot.variants : []
      variants.forEach((variant, index) => {
        formData.append(`variants[${index}]color_id`, String(variant?.color?.id ?? 0))
        formData.append(`variants[${index}]size_id`, String(variant?.size?.id ?? 0))
        formData.append(`variants[${index}]quantity`, String(variant?.quantity ?? 1))
        formData.append(`variants[${index}]is_active`, variant?.is_active ? 'true' : 'false')
      })

      if (newEditImages.length > 0) {
        const startingIndex = existingEditImages.length

        newEditImages.forEach((imageItem, index) => {
          const finalIndex = startingIndex + index
          formData.append(`images[${finalIndex}]image`, imageItem.file)
          formData.append(`images[${finalIndex}]alt_text`, imageItem.alt_text || `Product image ${finalIndex}`)
          formData.append(`images[${finalIndex}]sort_order`, String(finalIndex))
        })
      }

      await updateCatalogProductById(token, editProductId, formData)
      setShareMessage('Product updated successfully')
      window.setTimeout(() => setShareMessage(''), 1800)
      closeEditModal(true)
      setLoading(true)
      await fetchProducts()
    } catch (requestError) {
      setEditError(requestError?.message ?? 'Failed to update product')
    } finally {
      setEditSaving(false)
    }
  }

  return (
    <section className='rounded-2xl bg-white p-6 shadow-lg'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-slate-900'>Your Products</h1>
        <p className='mt-1 text-sm text-slate-600'>Products listed by your boutique account</p>
      </div>

      {loading && <p className='text-sm text-slate-600'>Loading products...</p>}
      {error && <p className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>{error}</p>}
      {shareMessage && <p className='mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700'>{shareMessage}</p>}

      {!loading && !error && products.length === 0 && (
        <p className='rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700'>No products found for this user.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
          {products.map((product) => {
            const firstImage = product?.images?.[0]?.image_url || product?.images?.[0]?.image
            return (
              <article key={product.id} className='overflow-hidden rounded-xl border border-slate-200'>
                <div className='h-52 w-full bg-slate-200'>
                  {firstImage ? (
                    <img src={firstImage} alt={product?.name ?? 'Product'} className='h-full w-full object-cover' />
                  ) : null}
                </div>
                <div className='space-y-1 p-4'>
                  <p className='line-clamp-1 text-base font-semibold text-slate-900'>{product?.name ?? 'Untitled'}</p>
                  <p className='text-sm text-slate-600'>Seller: {product?.seller_email ?? '-'}</p>
                  <p className='text-sm text-slate-600'>Type: {product?.product_type ?? '-'}</p>
                  <p className='text-sm font-semibold text-slate-900'>
                    {product?.currency ?? 'INR'} {product?.selling_price ?? '-'}
                  </p>
                  <div className='mt-2 grid grid-cols-2 gap-2'>
                    <button
                      type='button'
                      onClick={() => navigate(`/products/${product.id}`)}
                      className='rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'
                    >
                      View Details
                    </button>
                    <button
                      type='button'
                      onClick={() => copyProductLink(product.id)}
                      className='rounded-lg border border-fuchsia-500 px-3 py-2 text-sm font-medium text-fuchsia-700 hover:bg-fuchsia-50'
                    >
                      Share
                    </button>
                  </div>
                  <button
                    type='button'
                    onClick={() => openEditModal(product.id)}
                    className='mt-2 w-full rounded-lg border border-amber-500 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50'
                  >
                    Edit Product
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {isEditModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4'>
          <div className='max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl'>
            <div className='mb-4 flex items-start justify-between gap-4'>
              <div>
                <h2 className='text-xl font-bold text-slate-900'>Edit Product</h2>
                <p className='mt-1 text-sm text-slate-600'>Update product details and save changes</p>
              </div>
              <button
                type='button'
                onClick={closeEditModal}
                disabled={editSaving}
                className='rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50'
              >
                Close
              </button>
            </div>

            {editLoading ? (
              <p className='text-sm text-slate-600'>Loading product details...</p>
            ) : (
              <form onSubmit={saveProductEdits} className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {editError && <p className='md:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>{editError}</p>}

                <label className='space-y-1'>
                  <span className='text-sm text-slate-700'>Category</span>
                  <select
                    name='category'
                    value={editForm.category}
                    onChange={onEditFieldChange}
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
                  <span className='text-sm text-slate-700'>Product Name</span>
                  <input
                    name='name'
                    value={editForm.name}
                    onChange={onEditFieldChange}
                    className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
                    required
                  />
                </label>

                <label className='space-y-1 md:col-span-2'>
                  <span className='text-sm text-slate-700'>Description</span>
                  <textarea
                    name='description'
                    value={editForm.description}
                    onChange={onEditFieldChange}
                    rows={4}
                    className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
                    required
                  />
                </label>

                <label className='space-y-1'>
                  <span className='text-sm text-slate-700'>Product Type</span>
                  <select
                    name='productType'
                    value={editForm.productType}
                    onChange={onEditFieldChange}
                    className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
                  >
                    <option value='new'>New</option>
                    <option value='used'>Used</option>
                    <option value='rental'>Rental</option>
                  </select>
                </label>

                <label className='space-y-1'>
                  <span className='text-sm text-slate-700'>Condition</span>
                  <input
                    name='condition'
                    value={editForm.condition}
                    onChange={onEditFieldChange}
                    className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
                  />
                </label>

                <label className='space-y-1'>
                  <span className='text-sm text-slate-700'>Original Price</span>
                  <input
                    name='originalPrice'
                    type='number'
                    value={editForm.originalPrice}
                    onChange={onEditFieldChange}
                    className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
                  />
                </label>

                <label className='space-y-1'>
                  <span className='text-sm text-slate-700'>Selling Price</span>
                  <input
                    name='sellingPrice'
                    type='number'
                    value={editForm.sellingPrice}
                    onChange={onEditFieldChange}
                    className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
                  />
                </label>

                <label className='space-y-1'>
                  <span className='text-sm text-slate-700'>Stock Quantity</span>
                  <input
                    name='stockQuantity'
                    type='number'
                    min='0'
                    value={editForm.stockQuantity}
                    onChange={onEditFieldChange}
                    className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
                  />
                </label>

                <label className='space-y-1'>
                  <span className='text-sm text-slate-700'>Status</span>
                  <select
                    name='status'
                    value={editForm.status}
                    onChange={onEditFieldChange}
                    className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
                  >
                    <option value='draft'>Draft</option>
                    <option value='published'>Published</option>
                    <option value='archived'>Archived</option>
                  </select>
                </label>

                <label className='inline-flex items-center gap-2 md:col-span-2'>
                  <input
                    name='isActive'
                    type='checkbox'
                    checked={editForm.isActive}
                    onChange={onEditFieldChange}
                    className='h-4 w-4 rounded border-slate-300'
                  />
                  <span className='text-sm text-slate-700'>Product is active</span>
                </label>

                <div className='space-y-2 md:col-span-2'>
                  <p className='text-sm font-medium text-slate-700'>Currently Added Images</p>
                  {existingEditImages.length === 0 ? (
                    <p className='text-sm text-slate-500'>No existing images.</p>
                  ) : (
                    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
                      {existingEditImages.map((image) => (
                        <div key={image.id} className='space-y-2'>
                          <div className='overflow-hidden rounded-lg border border-slate-200'>
                            {image?.image_url ? (
                              <img src={image.image_url} alt={image.alt_text || 'Product image'} className='h-24 w-full object-cover' />
                            ) : (
                              <div className='h-24 w-full bg-slate-100' />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <label className='space-y-1 md:col-span-2'>
                  <span className='text-sm text-slate-700'>Add New Images</span>
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={onEditImageChange}
                    className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'
                  />
                </label>

                {newEditImages.length > 0 && (
                  <div className='grid grid-cols-2 gap-3 md:col-span-2 sm:grid-cols-4'>
                    {newEditImages.map((imageItem, index) => (
                      <div key={`${imageItem.previewUrl}-${index}`} className='space-y-2'>
                        <div className='overflow-hidden rounded-lg border border-slate-200'>
                          <img src={imageItem.previewUrl} alt='New upload' className='h-24 w-full object-cover' />
                        </div>
                        <button
                          type='button'
                          onClick={() => removeNewEditImage(index)}
                          className='w-full rounded-lg border border-red-500 px-2 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50'
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className='mt-2 flex justify-end gap-2 md:col-span-2'>
                  <button
                    type='button'
                    onClick={closeEditModal}
                    disabled={editSaving}
                    className='rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={editSaving}
                    className='rounded-lg bg-fuchsia-700 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-800 disabled:opacity-50'
                  >
                    {editSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default DashboardPage
