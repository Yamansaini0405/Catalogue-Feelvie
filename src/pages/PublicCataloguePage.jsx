import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ImageOff,
  PackageSearch,
  Search,
  ShieldAlert,
  Store,
  UserCircle2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getPublicCatalogueBySlug } from '../api/auth.api'
import { Badge, LoadingBlock, SearchInput } from '../components/ui'
import { formatDate, formatMoney } from '../utils/format'

const CATALOG_BASE_URL = 'https://catalogue.feelvie.com'

/**
 * Loads the two typefaces the storefront is built around: a warm display
 * serif for the store's voice (name, section titles) and a quiet sans for
 * UI chrome. Safe to render more than once — duplicate <link> tags are a
 * no-op in the browser.
 */
function StorefrontFonts() {
  return (
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap"
    />
  )
}

function PublicProductCard({ product, onClick }) {
  const firstImage =
    product?.images?.[0]?.image_url || product?.images?.[0]?.image

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left"
    >
      {/* Product image */}
      <div className="relative aspect-[4/5] overflow-hidden border border-[#E5E0D4] bg-[#F1EEE6]">
        {firstImage ? (
          <img
            src={firstImage}
            alt={product?.name ?? 'Product'}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff size={22} className="text-[#B7AF9E]" />
          </div>
        )}
      </div>

      {/* Product information */}
      <div className="mt-3.5 space-y-1">
        <p
          className="text-[13px] italic text-[#948C7E]"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {product?.product_type ?? 'Product'}
        </p>

        <h3 className="line-clamp-1 text-[15px] font-medium text-[#1C1B19]">
          {product?.name ?? 'Untitled product'}
        </h3>

        <div className="flex items-baseline justify-between border-t border-[#E5E0D4] pt-2.5">
          <span className="text-[15px] font-semibold text-[#7A2E2E]">
            {formatMoney(product?.selling_price, product?.currency)}
          </span>

         <Link to={`/catalogue/${product?.id}`} className="group flex items-center gap-1">
          <span className="flex items-center gap-1 text-xs font-medium text-[#948C7E] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            View piece
            <ArrowRight size={12} />
          </span>
          </Link>
        </div>
      </div>
    </button>
  )
}

function StoreUnavailable({ error }) {
  const isSubscriptionIssue =
    error?.toLowerCase().includes('subscription') ||
    error?.toLowerCase().includes('unavailable')

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F1] px-4 py-12 text-[#1C1B19]">
      <StorefrontFonts />

      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="mb-10 flex justify-center">
          <Link
            to="/"
            className="flex items-center gap-2"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1C1B19]">
              <Store size={15} />
            </span>
            <span className="text-lg italic">FeelVie</span>
          </Link>
        </div>

        {/* Main panel */}
        <div className="border border-[#E5E0D4] bg-white px-7 py-10 sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1E3E0]">
              {isSubscriptionIssue ? (
                <ShieldAlert size={24} className="text-[#7A2E2E]" />
              ) : (
                <Store size={24} className="text-[#7A2E2E]" />
              )}
            </div>

            <p className="mt-6 text-[13px] italic text-[#948C7E]">
              Store currently unavailable
            </p>

            <h1
              className="mt-3 text-3xl text-[#1C1B19] sm:text-4xl"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              This store is taking a break
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#6B655A]">
              {isSubscriptionIssue
                ? 'This storefront is temporarily unavailable because the store subscription is inactive.'
                : error || 'We could not load this storefront right now.'}
            </p>
          </div>

          {/* Info line */}
          <div className="mt-8 border-t border-[#E5E0D4] pt-6">
            <p className="text-sm font-medium text-[#1C1B19]">
              What does this mean?
            </p>
            <p className="mt-1.5 text-sm leading-6 text-[#6B655A]">
              The store owner may have temporarily disabled their public
              catalogue, or their subscription may need attention.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/"
              className="flex flex-1 items-center justify-center gap-2 bg-[#1C1B19] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#332F2A]"
            >
              Explore other stores
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/"
              className="flex flex-1 items-center justify-center gap-2 border border-[#E5E0D4] px-5 py-3 text-sm font-medium text-[#1C1B19] transition hover:bg-[#FAF7F1]"
            >
              <ArrowLeft size={15} />
              Back to FeelVie
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#948C7E]">
          Powered by FeelVie — virtual shopping made simpler
        </p>
      </div>
    </main>
  )
}

export default function PublicCataloguePage() {
  const { publicSlug } = useParams()
  const navigate = useNavigate()

  const [catalogue, setCatalogue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadCatalogue = async () => {
      if (!publicSlug) {
        setError('Invalid store link')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const data = await getPublicCatalogueBySlug(publicSlug)

        if (isMounted) {
          setCatalogue(data)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError?.message ?? 'Store unavailable')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadCatalogue()

    return () => {
      isMounted = false
    }
  }, [publicSlug])

  const user = catalogue?.user ?? null

  const products = useMemo(
    () => catalogue?.products ?? [],
    [catalogue]
  )

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return products

    return products.filter((product) => {
      const name = String(product?.name ?? '').toLowerCase()
      const description = String(product?.description ?? '').toLowerCase()

      return name.includes(query) || description.includes(query)
    })
  }, [products, search])

  const shareUrl = publicSlug
    ? `${CATALOG_BASE_URL}/${publicSlug}`
    : ''

  if (loading) {
    return <LoadingBlock label="Loading store…" />
  }

  if (error) {
    return <StoreUnavailable error={error} />
  }

  const storeName =
    user?.first_name || user?.last_name
      ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
      : 'Catalogue Store'

  return (
    <main className="min-h-screen bg-[#FAF7F1] text-[#1C1B19]">
      <StorefrontFonts />

      {/* =========================================================
          HEADER
      ========================================================== */}
      <header className="sticky top-0 z-30 border-b border-[#E5E0D4] bg-[#FAF7F1]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1C1B19]">
              <Store size={14} />
            </span>
            <span
              className="text-base italic text-[#1C1B19]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              FeelVie
            </span>
          </Link>

          <div className="flex items-center gap-5">
            {user?.is_verified && (
              <span className="hidden items-center gap-1.5 text-xs font-medium text-[#3F5B44] sm:flex">
                <CheckCircle2 size={14} />
                Verified store
              </span>
            )}

            <Link
              to=""
              className="hidden text-sm font-medium text-[#55504A] transition hover:text-[#1C1B19] sm:block"
            >
              Feel Your Vibe
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="pt-5 sm:pt-7">
        {/* Full-width banner */}
        <div className="relative aspect-[16/7] w-full overflow-hidden bg-[#1C1B19] sm:aspect-[21/8]">
          {user?.banner_url ? (
            <img
              src={user.banner_url}
              alt={`${storeName} banner`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span
                className="text-[10rem] leading-none text-white/[0.07] sm:text-[14rem]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {storeName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Legibility gradient for the overlaid title */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E0D] via-[#0F0E0D]/25 to-transparent" />

          {/* Store name, overlaid bottom-left */}
          <div className="absolute inset-x-0 bottom-0 px-5 pb-7 sm:px-8 sm:pb-10 lg:px-12">
            <div className="mx-auto max-w-6xl">
              <p
                className="text-sm italic text-white/70"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {user?.is_verified ? 'A verified independent store' : 'An independent store on FeelVie'}
              </p>

              <h1
                className="mt-2 text-4xl leading-[1.05] text-white sm:text-6xl lg:text-7xl"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {storeName}
              </h1>
            </div>
          </div>
        </div>

        {/* Detail strip below the banner */}
        <div className="mx-auto max-w-6xl px-5 pt-6 sm:px-8">
          <div className="h-px w-16 bg-[#7A2E2E]" />

          <p className="mt-6 max-w-md text-[15px] leading-7 text-[#55504A]">
            Discover products from this curated collection and explore
            everything this store has to offer.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-[#55504A]">
            <div>
              <span className="font-semibold text-[#1C1B19]">
                {products.length}
              </span>{' '}
              {products.length === 1 ? 'product' : 'products'}
            </div>

            {user?.date_joined && (
              <div>
                On FeelVie since{' '}
                <span className="font-semibold text-[#1C1B19]">
                  {formatDate(user.date_joined)}
                </span>
              </div>
            )}

            {user?.is_verified && (
              <div className="flex items-center gap-1.5 font-medium text-[#3F5B44]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3F5B44]" />
                Verified
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          STORE CONTENT
      ========================================================== */}
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:px-8 sm:pt-16">
        {/* Section heading + search */}
        <div className="flex flex-col gap-5 border-b border-[#E5E0D4] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              className="text-2xl text-[#1C1B19] sm:text-3xl"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              The collection
            </h2>

            <p className="mt-1.5 text-sm text-[#948C7E]">
              {search
                ? `${filteredProducts.length} result${
                    filteredProducts.length === 1 ? '' : 's'
                  } for "${search}"`
                : `${products.length} product${
                    products.length === 1 ? '' : 's'
                  } available`}
            </p>
          </div>

          <div className="flex items-center gap-4 sm:w-72">
            <div className="relative w-full">
              <Search
                size={15}
                className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[#948C7E]"
              />

              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search this store"
                className="border-0 border-b border-[#E5E0D4] bg-transparent text-sm focus:border-[#1C1B19]"
              />
            </div>

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="shrink-0 text-xs font-medium text-[#948C7E] transition hover:text-[#1C1B19]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Empty / Search state */}
        {filteredProducts.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1EEE6]">
              {products.length === 0 ? (
                <PackageSearch size={22} className="text-[#948C7E]" />
              ) : (
                <Search size={22} className="text-[#948C7E]" />
              )}
            </div>

            <h3
              className="mt-6 text-xl text-[#1C1B19]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {products.length === 0
                ? 'The collection is empty'
                : 'Nothing matches that search'}
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#6B655A]">
              {products.length === 0
                ? 'This store has not published any products yet. Please check back later.'
                : `We couldn't find anything matching "${search}". Try another search term.`}
            </p>

            {products.length > 0 && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="mt-6 border border-[#1C1B19] px-5 py-2.5 text-sm font-medium text-[#1C1B19] transition hover:bg-[#1C1B19] hover:text-white"
              >
                Show all products
              </button>
            )}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <PublicProductCard
                key={product.id}
                product={product}
                // onClick={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          FOOTER
      ========================================================== */}
      <footer className="border-t border-[#E5E0D4]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:text-left">
          <div>
            <p
              className="text-base italic text-[#1C1B19]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {storeName}
            </p>
            <p className="mt-1 text-xs text-[#948C7E]">
              Public catalogue powered by FeelVie
            </p>
          </div>

          
        </div>
      </footer>
    </main>
  )
}