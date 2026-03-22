import { useEffect, useMemo, useState } from 'react'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import feelVieLogo from '../assets/feelVie.png'
import Loader from '../components/Loader'
import {
  getCatalogCategories,
  getCatalogPublicProducts,
  getCommonCarousels,
} from '../services/authApi'
import { useNavigate } from 'react-router-dom'

function formatPrice(value) {
  const amount = Number(value)
  if (Number.isNaN(amount)) return '₹0'
  return `₹${Math.round(amount)}`
}

function ProductsPage() {
  const navigate = useNavigate()
  const [carouselBanners, setCarouselBanners] = useState([])
  const [activeBannerIndex, setActiveBannerIndex] = useState(0)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 12

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getCatalogPublicProducts()
        const activeProducts = data.filter((item) => item?.is_active)
        setProducts(activeProducts)
      } catch {
        setProducts([])
      }
    }

    const fetchCarousels = async () => {
      try {
        const carousels = await getCommonCarousels()
        const activeSorted = carousels
          .filter((item) => item?.is_active)
          .sort((a, b) => Number(a?.order ?? 0) - Number(b?.order ?? 0))

        setCarouselBanners(activeSorted)
        setActiveBannerIndex(0)
      } catch {
        setCarouselBanners([])
        setActiveBannerIndex(0)
      }
    }

    const fetchCategories = async () => {
      try {
        const data = await getCatalogCategories()
        setCategories(Array.isArray(data) ? data : [])
      } catch {
        setCategories([])
      }
    }

    const loadAllData = async () => {
      setLoading(true)
      await Promise.all([fetchProducts(), fetchCarousels(), fetchCategories()])
      setLoading(false)
    }

    loadAllData()
  }, [])

  useEffect(() => {
    if (carouselBanners.length <= 1) return undefined

    const slideInterval = window.setInterval(() => {
      setActiveBannerIndex((prevIndex) => (prevIndex + 1) % carouselBanners.length)
    }, 3200)

    return () => window.clearInterval(slideInterval)
  }, [carouselBanners])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(products.length / itemsPerPage)), [products.length])

  const productCards = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return products.slice(start, start + itemsPerPage)
  }, [currentPage, products])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const sizes = useMemo(() => {
    const allSizes = products.flatMap((product) =>
      (product?.variants ?? []).map((variant) => variant?.size?.size_display).filter(Boolean),
    )
    return [...new Set(allSizes)].slice(0, 8)
  }, [products])

  const priceRange = useMemo(() => {
    const values = products
      .map((product) => Number(product?.selling_price))
      .filter((value) => !Number.isNaN(value) && value >= 0)

    if (values.length === 0) {
      return { min: 0, max: 0 }
    }

    return {
      min: Math.min(...values),
      max: Math.max(...values),
    }
  }, [products])

  const categoryFilters = useMemo(() => {
    const counts = products.reduce((accumulator, product) => {
      const categoryKey = String(product?.category ?? 'unknown')
      accumulator[categoryKey] = (accumulator[categoryKey] ?? 0) + 1
      return accumulator
    }, {})

    const categoryNameMap = new Map(categories.map((category) => [String(category.id), category.name]))

    return Object.entries(counts)
      .map(([id, count]) => ({
        id,
        name: categoryNameMap.get(id) || `Category ${id}`,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [categories, products])

  const brandFilters = useMemo(() => {
    const counts = products.reduce((accumulator, product) => {
      const brand = product?.seller_email || 'Unknown Brand'
      accumulator[brand] = (accumulator[brand] ?? 0) + 1
      return accumulator
    }, {})

    return Object.entries(counts)
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  }, [products])

  const colorDots = useMemo(() => {
    const palette = products.flatMap((product) =>
      (product?.variants ?? [])
        .map((variant) => ({ name: variant?.color?.name, hex: variant?.color?.hex_code }))
        .filter((color) => color.name && color.hex),
    )

    const unique = []
    const seen = new Set()
    for (const color of palette) {
      if (!seen.has(color.name)) {
        seen.add(color.name)
        unique.push(color)
      }
      if (unique.length >= 8) break
    }
    return unique
  }, [products])

  const fallbackHeroImage = productCards[0]?.images?.[0]?.image_url || productCards[0]?.images?.[0]?.image || ''
  const heroImages = carouselBanners.length > 0 ? carouselBanners.map((item) => item?.image).filter(Boolean) : [fallbackHeroImage]
  const fallbackCategoryImages = [
    productCards[1]?.images?.[0]?.image_url ||
      productCards[1]?.images?.[0]?.image ||
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    productCards[2]?.images?.[0]?.image_url ||
      productCards[2]?.images?.[0]?.image ||
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80',
  ]

  const otherFashionCategories =
    categories.filter((category) => category?.name).slice(0, 2).map((category, index) => ({
      ...category,
      image: category?.image || fallbackCategoryImages[index] || fallbackCategoryImages[0],
    }))

  const categoryCardsToShow =
    otherFashionCategories.length > 0
      ? otherFashionCategories
      : [
          { id: 'fallback-1', name: 'Women Fashion', image: fallbackCategoryImages[0] },
          { id: 'fallback-2', name: 'Shoes Fashion', image: fallbackCategoryImages[1] },
        ]

  const primaryCategory = categoryFilters[0]?.name || 'All Products'

  const appliedFilters = [
    primaryCategory,
    `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`,
    ...(sizes[0] ? [`SIZE ${sizes[0]}`] : []),
  ]

  const paginationItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    const middleStart = Math.max(2, currentPage - 1)
    const middleEnd = Math.min(totalPages - 1, currentPage + 1)
    const items = [1]

    if (middleStart > 2) items.push('...-left')
    for (let page = middleStart; page <= middleEnd; page += 1) {
      items.push(page)
    }
    if (middleEnd < totalPages - 1) items.push('...-right')
    items.push(totalPages)

    return items
  }, [currentPage, totalPages])

  return (
    <div className='min-h-screen bg-zinc-100'>
      {loading && <Loader />}
      <div className='mx-auto max-w-full rounded-md bg-white px-4 py-2 md:px-8 md:py-4'>
        <header className='flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-5'>
          <img src={feelVieLogo} alt='FeelVie' className='h-9 w-auto object-contain md:h-11' />

          <div className='flex w-full max-w-lg items-center gap-3 md:w-auto'>
            <label className='relative flex-1'>
              <Search size={16} className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400' />
              <input
                type='search'
                placeholder='Search products'
                className='h-11 w-full rounded-full border border-zinc-300 bg-white pl-10 pr-4 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:border-zinc-400'
              />
            </label>
            <button
              type='button'
              className='h-11 shrink-0 rounded-full bg-[#803385] px-5 text-xs font-semibold uppercase tracking-wide text-white'
            >
              Download Our App
            </button>
          </div>
        </header>

        <section className='mt-6'>
          <div className='relative mt-4 overflow-hidden rounded-3xl bg-zinc-200'>
            <div
              className='flex h-55 w-full transition-transform duration-700 ease-in-out md:h-100'
              style={{ transform: `translateX(-${activeBannerIndex * 100}%)` }}
            >
              {heroImages.map((image, index) => (
                <div key={`${image}-${index}`} className='h-full min-w-full'>
                  <img src={image} alt='Carousel banner' className='h-full w-full object-cover' />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className='mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:items-start'>
          <aside className='self-start rounded-2xl border border-zinc-200 p-5'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-zinc-900'>Filter Products</h2>
              <SlidersHorizontal size={16} className='text-zinc-500' />
            </div>

            <div className='mt-6 border-t border-zinc-200 pt-4'>
              <button type='button' className='flex w-full items-center justify-between text-sm font-semibold text-zinc-900'>
                Category
                <ChevronDown size={16} />
              </button>
              <div className='mt-4 space-y-3 text-sm text-zinc-700'>
                {categoryFilters.map((category) => (
                  <label key={category.id} className='flex items-center justify-between gap-2'>
                    <span className='flex items-center gap-2'>
                      <input type='checkbox' className='h-4 w-4 rounded border-zinc-300' />
                      <span className='line-clamp-1'>{category.name}</span>
                    </span>
                    <span className='text-xs text-zinc-400'>{category.count}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className='mt-6 border-t border-zinc-200 pt-4'>
              <button type='button' className='flex w-full items-center justify-between text-sm font-semibold text-zinc-900'>
                Price
                <ChevronDown size={16} />
              </button>
              <div className='mt-4'>
                <div className='h-1 w-full rounded bg-zinc-200'>
                  <div className='h-1 w-full rounded bg-zinc-700' />
                </div>
                <div className='mt-3 flex items-center justify-between rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-600'>
                  <span>{formatPrice(priceRange.min)}</span>
                  <span>{formatPrice(priceRange.max)}</span>
                </div>
              </div>
            </div>

            <div className='mt-6 border-t border-zinc-200 pt-4'>
              <button type='button' className='flex w-full items-center justify-between text-sm font-semibold text-zinc-900'>
                Color
                <ChevronDown size={16} />
              </button>
              <div className='mt-4 flex flex-wrap gap-3'>
                {colorDots.map((color) => (
                  <button
                    key={color.name}
                    type='button'
                    title={color.name}
                    className='h-6 w-6 rounded-full border border-zinc-300'
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            <div className='mt-6 border-t border-zinc-200 pt-4'>
              <button type='button' className='flex w-full items-center justify-between text-sm font-semibold text-zinc-900'>
                Size
                <ChevronDown size={16} />
              </button>
              <div className='mt-4 grid grid-cols-2 gap-2 text-sm text-zinc-700'>
                {sizes.map((size) => (
                  <label key={size} className='flex items-center gap-2'>
                    <input type='checkbox' className='h-4 w-4 rounded border-zinc-300' />
                    {size}
                  </label>
                ))}
              </div>
            </div>

            {/* <div className='mt-6 border-t border-zinc-200 pt-4'>
              <button type='button' className='flex w-full items-center justify-between text-sm font-semibold text-zinc-900'>
                Brands
                <ChevronDown size={16} />
              </button>
              <div className='mt-4 space-y-3 text-sm text-zinc-700'>
                {brandFilters.map((brand) => (
                  <label key={brand.brand} className='flex items-center justify-between gap-2'>
                    <span className='flex items-center gap-2'>
                      <input type='checkbox' className='h-4 w-4 rounded border-zinc-300' />
                      <span className='line-clamp-1'>{brand.brand}</span>
                    </span>
                    <span className='text-xs text-zinc-400'>{brand.count}</span>
                  </label>
                ))}
              </div>
            </div> */}
          </aside>

          <div>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <p className='text-sm text-zinc-600'>
                Showing <span className='font-semibold text-zinc-900'>{productCards.length}</span> results from total{' '}
                <span className='font-semibold text-zinc-900'>{products.length}</span> 
        
              </p>
              <button type='button' className='flex items-center gap-1 text-sm text-zinc-700'>
                Sort by <span className='font-medium text-zinc-900'>Popularity</span> <ChevronDown size={14} />
              </button>
            </div>

            <div className='mt-4 flex flex-wrap gap-2'>
              {appliedFilters.map((filterLabel) => (
                <span key={filterLabel} className='rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-700'>
                  {filterLabel}
                </span>
              ))}
            </div>

            <div className='mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
              {productCards.map((product) => {
                const image = product?.images?.[0]?.image_url || product?.images?.[0]?.image
                const colorSwatches = [...new Set((product?.variants ?? []).map((variant) => variant?.color?.hex_code).filter(Boolean))]

                return (
                  <article
                    key={product.id}
                    className='group cursor-pointer'
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className='relative aspect-3/4 overflow-hidden rounded-2xl bg-zinc-100'>
                      {image ? (
                        <img src={image} alt={product?.name ?? 'Product'} className='h-full w-full object-cover transition duration-300 group-hover:scale-105' />
                      ) : null}
                      <button
                        type='button'
                        onClick={(event) => event.stopPropagation()}
                        className='absolute right-3 top-3 rounded-full bg-white/90 p-1.5 text-zinc-600 shadow-sm'
                        aria-label='wishlist'
                      >
                        <Heart size={14} />
                      </button>
                    </div>
                    <div className='mt-3 flex items-start justify-between gap-3'>
                      <h3 className='line-clamp-1 text-sm font-semibold uppercase tracking-wide text-zinc-900'>{product?.name ?? 'Untitled Product'}</h3>
                      <p className='text-sm text-zinc-600'>{formatPrice(product?.selling_price)}</p>
                    </div>
                    <div className='mt-2 flex items-center gap-2'>
                      {colorSwatches.slice(0, 4).map((hex) => (
                        <span key={`${product.id}-${hex}`} className='h-3 w-3 rounded-full border border-zinc-300' style={{ backgroundColor: hex }} />
                      ))}
                    </div>
                  </article>
                )
              })}
            </div>

            <div className='mt-8 flex items-center justify-center gap-2 text-sm text-zinc-500'>
              <button
                type='button'
                onClick={() => setCurrentPage((prevPage) => Math.max(1, prevPage - 1))}
                disabled={currentPage === 1}
                className='flex items-center gap-1 rounded-full border border-zinc-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40'
              >
                <ChevronLeft size={14} /> PREVIOUS
              </button>

              {paginationItems.map((item) => {
                if (typeof item !== 'number') {
                  return (
                    <span key={item} className='px-1 text-zinc-400'>
                      ...
                    </span>
                  )
                }

                return (
                  <button
                    key={item}
                    type='button'
                    onClick={() => setCurrentPage(item)}
                    className={`h-8 w-8 rounded-full ${item === currentPage ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500'}`}
                  >
                    {item}
                  </button>
                )
              })}

              <button
                type='button'
                onClick={() => setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1))}
                disabled={currentPage === totalPages}
                className='flex items-center gap-1 rounded-full border border-zinc-300 px-3 py-1.5 text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40'
              >
                NEXT <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>

        <section className='mt-16'>
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-4xl font-bold uppercase text-zinc-900'>Other Fashion Category</h2>
            <div className='flex items-center gap-2'>
              <button type='button' className='rounded-full bg-zinc-100 p-2 text-zinc-500'>
                <ChevronLeft size={16} />
              </button>
              <button type='button' className='rounded-full bg-zinc-900 p-2 text-white'>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
            {categoryCardsToShow.map((category) => (
              <article key={category.id} className='grid overflow-hidden rounded-2xl border border-zinc-200 sm:grid-cols-2'>
                <div className='p-6'>
                  <h3 className='text-3xl font-semibold text-zinc-900'>{category.name}</h3>
                  <p className='mt-2 text-sm text-zinc-600'>Explore our {category.name.toLowerCase()} collection.</p>
                  <button type='button' className='mt-6 rounded-full border border-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-900'>
                    EXPLORE PRODUCT
                  </button>
                </div>
                <img src={category.image} alt={category.name} className='h-full w-full object-cover' />
              </article>
            ))}
          </div>
        </section>

        <section
          className='relative mt-14 overflow-hidden rounded-2xl'
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(30,30,30,0.55) 0%, rgba(30,30,30,0.72) 100%), url(https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className='p-8 text-center text-white md:p-12'>
            <h2 className='text-3xl font-bold uppercase md:text-5xl'>Explore Our Fashion Catalog</h2>
            <p className='mx-auto mt-4 max-w-2xl text-sm text-zinc-100 md:text-base'>
              Browse through our fashion catalog to find a wide range of stylish clothing options. From classic looks to the
              latest trends, there’s something for everyone.
            </p>
            <button type='button' className='mt-7 rounded-full border border-white px-6 py-3 text-xs font-semibold tracking-wide'>
              SEE OUR INSTAGRAM
            </button>
          </div>

          <div className='mx-6 mb-6 rounded-3xl bg-white/95 p-8 md:mx-10 md:p-10'>
            <div className='grid grid-cols-2 gap-8 text-sm text-zinc-700 md:grid-cols-4'>
              <div>
                <h4 className='mb-4 text-base font-semibold text-zinc-900'>GENERAL</h4>
                <ul className='space-y-2'>
                  <li>About Us</li>
                  <li>Blog</li>
                  <li>How it Works</li>
                  <li>Contact Us</li>
                </ul>
              </div>
              <div>
                <h4 className='mb-4 text-base font-semibold text-zinc-900'>PRODUCTS</h4>
                <ul className='space-y-2'>
                  <li>Man Fashion</li>
                  <li>Woman Fashion</li>
                  <li>Shoes & Bag</li>
                  <li>Accessories</li>
                </ul>
              </div>
              <div>
                <h4 className='mb-4 text-base font-semibold text-zinc-900'>CUSTOMER SERVICE</h4>
                <ul className='space-y-2'>
                  <li>FAQ</li>
                  <li>Help & Support</li>
                  <li>Billing Cycle</li>
                  <li>Privacy Policy</li>
                </ul>
              </div>
              <div>
                <h4 className='mb-4 text-base font-semibold text-zinc-900'>SOCIAL MEDIA</h4>
                <ul className='space-y-2'>
                  <li>Instagram</li>
                  <li>Tiktok</li>
                  <li>Facebook</li>
                  <li>Youtube</li>
                </ul>
              </div>
            </div>
            <p className='mt-8 text-5xl font-black tracking-wider text-zinc-200 md:text-8xl'>FEELVIE</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProductsPage