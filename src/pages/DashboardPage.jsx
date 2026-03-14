import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCatalogProducts } from '../services/authApi'

function DashboardPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [shareMessage, setShareMessage] = useState('')

  useEffect(() => {
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

    fetchProducts()
  }, [navigate])

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
                  <p className='text-sm text-slate-600'>Status: {product?.status ?? '-'}</p>
                  <p className='text-sm font-semibold text-slate-900'>
                    {product?.currency ?? 'INR'} {product?.selling_price ?? '-'}
                  </p>
                  <div className='mt-2 grid grid-cols-2 gap-2'>
                    <button
                      type='button'
                      onClick={() => navigate(`/product/${product.id}`)}
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
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default DashboardPage
