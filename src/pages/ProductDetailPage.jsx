import { ArrowLeft, CircleAlert, Star } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCatalogProductById, getCatalogProducts } from '../services/authApi'

const formatAmount = (value) => {
  if (value === null || value === undefined || value === '') return '-'
  const asNumber = Number(value)
  if (Number.isNaN(asNumber)) return value
  return Math.round(asNumber).toLocaleString('en-IN')
}

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [similarProducts, setSimilarProducts] = useState([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem('authToken') ?? ''

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      if (!id) {
        setError('Invalid product ID')
        setLoading(false)
        return
      }

      try {
        const [detailsData, productsData] = await Promise.all([
          getCatalogProductById(token, id),
          getCatalogProducts(token),
        ])

        setProduct(detailsData)

        const filtered = productsData
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
  }, [id, navigate])

  const images = useMemo(() => product?.images ?? [], [product])
  const variants = useMemo(() => product?.variants ?? [], [product])

  const selectedImage = useMemo(() => {
    if (images.length === 0) return null
    return images[selectedImageIndex] ?? images[0]
  }, [images, selectedImageIndex])

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
        <Link
          to='/dashboard'
          className='mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <p className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>{error}</p>
      </section>
    )
  }

  return (
    <section className='space-y-4'>
      

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
                          className={`overflow-hidden rounded-md border mx-1 ${
                            selectedImageIndex === index ? 'border-fuchsia-500' : 'border-slate-200'
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

                <div className='overflow-hidden rounded-xl border border-slate-200 bg-slate-50'>
                  {selectedImage?.image_url || selectedImage?.image ? (
                    <img
                      src={selectedImage?.image_url || selectedImage?.image}
                      alt={selectedImage?.alt_text || product.name || 'Product image'}
                      className='h-85 w-full object-contain md:h-130'
                    />
                  ) : (
                    <div className='flex h-85 items-center justify-center text-sm text-slate-500 md:h-130'>
                      No image available
                    </div>
                  )}
                </div>
              </div>
            </article>

            <article className=''>
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
                <p className='mt-2 text-sm text-slate-500'>Status: {product?.status || '-'} • Condition: {product?.condition || '-'}</p>
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
                <div className='flex items-start justify-between gap-3'>
                  <h3 className='text-xl font-semibold text-slate-900'>Product Highlights</h3>
                
                </div>

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

            <div className='rounded-2xl bg-white p-6 shadow-lg xl:col-span-2'>
              <h3 className='text-xl font-semibold text-slate-900'>Sold By</h3>
              <div className='mt-3 flex items-center justify-between gap-3'>
                <div>
                  <p className='text-base font-semibold text-slate-900'>{product?.seller_email || 'Seller'}</p>
                  <p className='text-sm text-slate-500'>Seller ID: {product?.seller_id ?? '-'}</p>
                </div>
                <button type='button' className='rounded-lg border border-fuchsia-500 px-4 py-2 text-sm font-semibold text-fuchsia-700'>
                  View Shop
                </button>
                </div>
              </div>
          </div>

          <article className='rounded-2xl bg-white p-6 shadow-lg'>
            <h3 className='text-2xl font-semibold text-slate-900'>Similar Products</h3>
            {similarProducts.length === 0 ? (
              <p className='mt-3 text-sm text-slate-500'>No similar products found.</p>
            ) : (
              <div className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
                {similarProducts.map((item) => {
                  const imageUrl = item?.images?.[0]?.image_url || item?.images?.[0]?.image
                  return (
                    <button
                      key={item.id}
                      type='button'
                      onClick={() => navigate(`/products/${item.id}`)}
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
    </section>
  )
}

export default ProductDetailPage
