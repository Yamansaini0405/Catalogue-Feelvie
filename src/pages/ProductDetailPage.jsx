import { ArrowLeft, CircleAlert, Star } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getCatalogProductById, getCatalogPublicProducts } from '../services/authApi'

const FORMSPREE_QUOTE_ENDPOINT = import.meta.env.VITE_FORMSPREE_QUOTE_ENDPOINT ?? ''

const formatAmount = (value) => {
  if (value === null || value === undefined || value === '') return '-'
  const asNumber = Number(value)
  if (Number.isNaN(asNumber)) return value
  return Math.round(asNumber).toLocaleString('en-IN')
}

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [product, setProduct] = useState(null)
  const [similarProducts, setSimilarProducts] = useState([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imageZoom, setImageZoom] = useState(1)
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [isQuoteSubmitting, setIsQuoteSubmitting] = useState(false)
  const [quoteError, setQuoteError] = useState('')
  const [quoteSuccess, setQuoteSuccess] = useState('')
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    customizationDescription: '',
    priceRange: '',
    clothSize: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)

  const isStandaloneProductPage = location.pathname.startsWith('/product/')

  const handleProductNavigation = (navigationPath) => {
    if (isStandaloneProductPage) {
      sessionStorage.setItem('productDetailScrollY', window.scrollY.toString())
    }
    navigate(navigationPath)
  }

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Invalid product ID')
        setLoading(false)
        return
      }

      try {
        const detailsData = await getCatalogProductById(id)
        setProduct(detailsData)

        const productsData = await getCatalogPublicProducts()
        const filtered = productsData
          .filter((item) => item?.is_active)
          .filter((item) => String(item.id) !== String(id) && item.category === detailsData.category)
          .slice(0, 5)
        setSimilarProducts(filtered)
      } catch (requestError) {
        setError(requestError?.message ?? 'Failed to load product details')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  useEffect(() => {
    if (isStandaloneProductPage) {
      const savedScrollY = sessionStorage.getItem('productDetailScrollY')
      if (savedScrollY) {
        window.scrollTo(0, parseInt(savedScrollY, 10))
        sessionStorage.removeItem('productDetailScrollY')
      } else {
        window.scrollTo(0, 0)
      }
    }
  }, [id, isStandaloneProductPage])

  const images = useMemo(() => product?.images ?? [], [product])
  const variants = useMemo(() => product?.variants ?? [], [product])

  const selectedImage = useMemo(() => {
    if (images.length === 0) return null
    return images[selectedImageIndex] ?? images[0]
  }, [images, selectedImageIndex])

  useEffect(() => {
    setImageZoom(1)
  }, [selectedImageIndex, id])

  const handleImageMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 150
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setCursorPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
    setImageZoom(2)
  }

  const handleImageTouchMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const touch = event.touches[0]
    const x = ((touch.clientX - rect.left) / rect.width) * 100
    const y = ((touch.clientY - rect.top) / rect.height) * 100
    setCursorPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
    setImageZoom(2)
  }

  const handleImageMouseEnter = () => {
    setIsHovering(true)
  }

  const handleImageMouseLeave = () => {
    setIsHovering(false)
    setImageZoom(1)
    setCursorPosition({ x: 50, y: 50 })
  }

  const onQuoteFieldChange = (event) => {
    const { name, value } = event.target
    setQuoteForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const openQuoteModal = () => {
    setQuoteError('')
    setQuoteSuccess('')
    setIsQuoteModalOpen(true)
  }

  const closeQuoteModal = () => {
    if (isQuoteSubmitting) return
    setIsQuoteModalOpen(false)
  }

  const submitQuoteRequest = async (event) => {
    event.preventDefault()
    setQuoteError('')
    setQuoteSuccess('')

    if (!FORMSPREE_QUOTE_ENDPOINT) {
      setQuoteError('Formspree endpoint is missing. Set VITE_FORMSPREE_QUOTE_ENDPOINT in your environment.')
      return
    }

    if (
      !quoteForm.name.trim() ||
      !quoteForm.email.trim() ||
      !quoteForm.phone.trim() ||
      !quoteForm.customizationDescription.trim() ||
      !quoteForm.priceRange.trim() ||
      !quoteForm.clothSize.trim()
    ) {
      setQuoteError('Please fill all quote fields.')
      return
    }

    setIsQuoteSubmitting(true)

    try {
      const response = await fetch(FORMSPREE_QUOTE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: quoteForm.name.trim(),
          email: quoteForm.email.trim(),
          phone: quoteForm.phone.trim(),
          customization_description: quoteForm.customizationDescription.trim(),
          price_range: quoteForm.priceRange.trim(),
          cloth_size: quoteForm.clothSize.trim(),
          product_id: product?.id ?? '-',
          product_name: product?.name ?? '-',
          seller_email: product?.seller_email ?? '-',
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result?.errors?.[0]?.message || result?.error || 'Unable to submit quote request')
      }

      setQuoteSuccess('Quote request submitted successfully. We will contact you soon.')
      setQuoteForm({
        name: '',
        email: '',
        phone: '',
        customizationDescription: '',
        priceRange: '',
        clothSize: '',
      })
      setIsQuoteModalOpen(false)
    } catch (requestError) {
      setQuoteError(requestError?.message || 'Unable to submit quote request')
    } finally {
      setIsQuoteSubmitting(false)
    }
  }

  const sizeOptions = useMemo(() => {
    const unique = new Map()
    variants.forEach((variant) => {
      const key = variant?.size?.id
      if (key && !unique.has(key)) {
        unique.set(key, variant?.size?.size_display || variant?.size?.size || '-')
      }
    })
    return Array.from(unique.values())
  }, [variants])

  const colorOptions = useMemo(() => {
    const unique = new Map()
    variants.forEach((variant) => {
      const colorId = variant?.color?.id
      if (colorId && !unique.has(colorId)) {
        unique.set(colorId, {
          name: variant?.color?.name || '-',
          hex: variant?.color?.hex_code || '#94a3b8',
        })
      }
    })
    return Array.from(unique.values())
  }, [variants])

  const sellingPrice = Number(product?.selling_price)
  const originalPrice = Number(product?.original_price)
  const hasValidDiscount = !Number.isNaN(sellingPrice) && !Number.isNaN(originalPrice) && originalPrice > sellingPrice
  const discountPercent = hasValidDiscount ? Math.round(((originalPrice - sellingPrice) / originalPrice) * 100) : 0
  const isRentalProduct = product?.product_type === 'rental'

  if (loading) {
    return (
      <section className='rounded-2xl bg-white p-6 shadow-lg'>
        <p className='text-sm text-slate-600'>Loading product details...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className='rounded-2xl bg-white p-6 shadow-lg'>
        {!isStandaloneProductPage && (
          <Link
            to='/view-products'
            className='mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>
        )}
        <p className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>{error}</p>
      </section>
    )
  }

  return (
    <section className='space-y-4'>
      {!isStandaloneProductPage && (
        <Link
          to='/view-products'
          className='inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      )}
      <button
        type='button'
        onClick={() => navigate(-1)}
        className='inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50'
      >
        <ArrowLeft size={16} />
        Back
      </button>


      {product && (
        <>
          <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
            <article className='rounded-2xl bg-white p-4 shadow-lg md:p-6'>
              <div className='grid grid-cols-[56px,1fr] gap-3 md:grid-cols-[72px,1fr]'>
                <div className='space-y-2'>
                  {images.length > 0 ? (
                    images.map((image, index) => {
                      const thumbUrl = image?.image_url || image?.image
                      return (
                        <button
                          key={image.id ?? index}
                          type='button'
                          onClick={() => setSelectedImageIndex(index)}
                          className={`overflow-hidden rounded-md border ${selectedImageIndex === index ? 'border-fuchsia-500' : 'border-slate-200'
                            }`}
                        >
                          {thumbUrl ? (
                            <img src={thumbUrl} alt={image?.alt_text || 'Thumbnail'} className='h-14 w-14 object-cover md:h-16 md:w-16' />
                          ) : (
                            <div className='h-14 w-14 bg-slate-100 md:h-16 md:w-16' />
                          )}
                        </button>
                      )
                    })
                  ) : (
                    <div className='h-14 w-14 rounded-md border border-slate-200 bg-slate-100 md:h-16 md:w-16' />
                  )}
                </div>

                <div className='relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 cursor-zoom-in' onMouseMove={handleImageMouseMove} onTouchMove={handleImageTouchMove} onMouseEnter={handleImageMouseEnter} onMouseLeave={handleImageMouseLeave}>
                  {selectedImage?.image_url || selectedImage?.image ? (
                    <img
                      src={selectedImage?.image_url || selectedImage?.image}
                      alt={selectedImage?.alt_text || product.name || 'Product image'}
                      className='h-85 w-full object-contain transition-transform duration-200 md:h-130'
                      style={{ transform: `scale(${imageZoom})`, transformOrigin: `${cursorPosition.x}% ${cursorPosition.y}%` }}
                    />
                  ) : (
                    <div className='flex h-85 items-center justify-center text-sm text-slate-500 md:h-130'>
                      No image available
                    </div>
                  )}
                </div>
              </div>
            </article>

            <article>
              <div className='rounded-2xl bg-white p-6 shadow-lg'>
                <p className='text-sm font-semibold uppercase tracking-wide text-slate-500'>{product?.product_type || 'product'}</p>
                <h2 className='mt-2 text-2xl font-bold text-slate-900'>{product?.name || 'Untitled Product'}</h2>

                <div className='mt-3 flex flex-wrap items-center gap-2'>
                  <p className='text-4xl font-semibold text-slate-900'>₹{formatAmount(product?.selling_price)}</p>
                  {hasValidDiscount && (
                    <>
                      <p className='text-lg text-slate-400 line-through'>₹{formatAmount(product?.original_price)}</p>
                      <p className='text-lg font-semibold text-emerald-600'>{discountPercent}% off</p>
                      <CircleAlert size={16} className='text-slate-400' />
                    </>
                  )}
                </div>

                <div className='mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700'>
                  <Star size={12} fill='currentColor' />
                  4.2
                </div>
                <p className='mt-2 text-sm text-slate-500'> • Condition: {product?.condition || '-'}</p>

                
              </div>

              <div className='mt-4 rounded-2xl bg-white p-6 shadow-lg'>
                <h3 className='text-xl font-semibold text-slate-900'>Select Size</h3>
                <div className='mt-4 flex flex-wrap gap-2'>
                  {sizeOptions.length === 0 ? (
                    <p className='text-sm text-slate-500'>No size variants available</p>
                  ) : (
                    sizeOptions.map((sizeLabel) => (
                      <span
                        key={sizeLabel}
                        className='rounded-full border border-slate-400 px-4 py-1 text-sm font-semibold text-slate-700'
                      >
                        {sizeLabel}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className='mt-4 rounded-2xl bg-white p-6 shadow-lg'>
                <h3 className='text-xl font-semibold text-slate-900'>Product Highlights</h3>

                <div className='mt-4 space-y-4'>
                  <div>
                    <p className='text-xs text-slate-500'>Color</p>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {colorOptions.length === 0 ? (
                        <span className='rounded-full border border-slate-300 px-4 py-1 text-sm font-medium text-slate-700'>-</span>
                      ) : (
                        colorOptions.map((color) => (
                          <span
                            key={color.name}
                            className='inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-1 text-sm font-medium text-slate-700'
                          >
                            <span className='h-3 w-3 rounded-full border border-slate-200' style={{ background: color.hex }} />
                            {color.name}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <p className='text-xs text-slate-500'>Type</p>
                    <div className='mt-2'>
                      <span className='inline-flex rounded-full border border-slate-300 px-4 py-1 text-sm font-medium text-slate-700'>
                        {product?.product_type || '-'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className='text-xs text-slate-500'>Stock</p>
                    <div className='mt-2'>
                      <span className='inline-flex rounded-full border border-slate-300 px-4 py-1 text-sm font-medium text-slate-700'>
                        {product?.stock_quantity ?? '-'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className='text-xs text-slate-500'>SKU</p>
                    <div className='mt-2'>
                      <span className='inline-flex rounded-full border border-slate-300 px-4 py-1 text-sm font-medium text-slate-700'>
                        {product?.base_sku || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <div className='rounded-2xl bg-white p-6 shadow-lg xl:col-span-2'>
              <h3 className='text-xl font-semibold text-slate-900'>Additional Details</h3>
              <p className='mt-3 whitespace-pre-wrap text-sm text-slate-700'>{product?.description || '-'}</p>
            </div>

            {isRentalProduct && (
              <div className='rounded-2xl bg-white p-6 shadow-lg xl:col-span-2'>
                <h3 className='text-xl font-semibold text-slate-900'>Rental Details</h3>
                <div className='mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2'>
                  <p className='text-sm text-slate-700'>Rental / Day: ₹{formatAmount(product?.rental_price_per_day)}</p>
                  <p className='text-sm text-slate-700'>Late Penalty: ₹{formatAmount(product?.late_return_penalty)}</p>
                  <p className='text-sm text-slate-700'>Damage Fee: ₹{formatAmount(product?.damage_protection_fee)}</p>
                  <p className='text-sm text-slate-700'>
                    Availability: {product?.rental_availability?.is_available_from || '-'} to{' '}
                    {product?.rental_availability?.is_available_to || '-'}
                  </p>
                  <p className='text-sm text-slate-700'>Min Days: {product?.rental_availability?.min_rental_days ?? '-'}</p>
                  <p className='text-sm text-slate-700'>Max Days: {product?.rental_availability?.max_rental_days ?? '-'}</p>
                </div>
              </div>
            )}

            
          </div>

          <article className='rounded-2xl bg-white p-6 shadow-lg'>
            <h3 className='text-2xl font-semibold text-slate-900'>Similar Products</h3>
            {similarProducts.length === 0 ? (
              <p className='mt-3 text-sm text-slate-500'>No similar products found.</p>
            ) : (
              <div className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
                {similarProducts.map((item) => {
                  const imageUrl = item?.images?.[0]?.image_url || item?.images?.[0]?.image
                  const navigationPath = isStandaloneProductPage ? `/product/${item.id}` : `/products/${item.id}`
                  return (
                    <button
                      key={item.id}
                      type='button'
                      onClick={() => handleProductNavigation(navigationPath)}
                      className='rounded-xl border border-slate-200 p-2 text-left hover:border-fuchsia-400'
                    >
                      <div className='overflow-hidden rounded-lg bg-slate-100'>
                        {imageUrl ? (
                          <img src={imageUrl} alt={item?.name || 'Product'} className='h-28 w-full object-cover' />
                        ) : (
                          <div className='h-28 w-full' />
                        )}
                      </div>
                      <p className='mt-2 line-clamp-1 text-sm font-medium text-slate-800'>{item?.name || 'Untitled'}</p>
                      <p className='text-sm font-semibold text-slate-900'>₹{formatAmount(item?.selling_price)}</p>
                    </button>
                  )
                })}
              </div>
            )}
          </article>
        </>
      )}

      {isQuoteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 '>
          <div className='max-h-[90vh] w-full max-w-xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl no-scrollbar'>
            <div className='mb-4 flex items-start justify-between gap-4'>
              <div>
                <h3 className='text-xl font-bold text-slate-900'>Customization Quote</h3>
                <p className='mt-1 text-sm text-slate-600'>Share your requirements and we will send your quote by email.</p>
              </div>
              <button
                type='button'
                onClick={closeQuoteModal}
                disabled={isQuoteSubmitting}
                className='rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50'
              >
                Close
              </button>
            </div>

            <form onSubmit={submitQuoteRequest} className='grid grid-cols-1 gap-4'>
              <label className='space-y-1'>
                <span className='text-sm text-slate-700'>Name</span>
                <input
                  name='name'
                  value={quoteForm.name}
                  onChange={onQuoteFieldChange}
                  className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
                  required
                />
              </label>

              <label className='space-y-1'>
                <span className='text-sm text-slate-700'>Email</span>
                <input
                  type='email'
                  name='email'
                  value={quoteForm.email}
                  onChange={onQuoteFieldChange}
                  className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
                  required
                />
              </label>

              <label className='space-y-1'>
                <span className='text-sm text-slate-700'>Phone</span>
                <input
                  name='phone'
                  value={quoteForm.phone}
                  onChange={onQuoteFieldChange}
                  className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
                  required
                />
              </label>

              <label className='space-y-1'>
                <span className='text-sm text-slate-700'>Customization Description</span>
                <textarea
                  name='customizationDescription'
                  rows={4}
                  value={quoteForm.customizationDescription}
                  onChange={onQuoteFieldChange}
                  className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
                  required
                />
              </label>

              <label className='space-y-1'>
                <span className='text-sm text-slate-700'>Price Range</span>
                <input
                  name='priceRange'
                  placeholder='e.g. ₹2,000 - ₹4,000'
                  value={quoteForm.priceRange}
                  onChange={onQuoteFieldChange}
                  className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
                  required
                />
              </label>

              <label className='space-y-1'>
                <span className='text-sm text-slate-700'>Cloth Size</span>
                <input
                  name='clothSize'
                  value={quoteForm.clothSize}
                  onChange={onQuoteFieldChange}
                  placeholder='e.g. M, L, XL, 40'
                  className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500'
                  required
                />
              </label>

              {quoteError && <p className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>{quoteError}</p>}
              {quoteSuccess && <p className='rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700'>{quoteSuccess}</p>}

              <div className='mt-2 flex justify-end gap-2'>
                <button
                  type='button'
                  onClick={closeQuoteModal}
                  disabled={isQuoteSubmitting}
                  className='rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isQuoteSubmitting}
                  className='rounded-lg bg-fuchsia-700 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-800 disabled:opacity-50'
                >
                  {isQuoteSubmitting ? 'Submitting...' : 'Submit Quote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductDetailPage
