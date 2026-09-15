import {
  ArrowLeft,
  CheckCircle2,
  ImageOff,
  Mail,
  PackageX,
  ShieldCheck,
  Store,
  Truck,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../api'
import { LoadingBlock } from '../components/ui'
import { formatDate, formatMoney } from '../utils/format'

/**
 * Loads the two typefaces the storefront is built around: a warm display
 * serif for editorial moments (product name, section titles) and a quiet
 * sans for UI chrome. Safe to render more than once.
 */
function StorefrontFonts() {
  return (
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap"
    />
  )
}

function SiteHeader() {
  return (
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

        <Link
          to="/products"
          className="hidden text-sm font-medium text-[#55504A] transition hover:text-[#1C1B19] sm:block"
        >
          Explore stores
        </Link>
      </div>
    </header>
  )
}

function ProductUnavailable({ error }) {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F1] px-4 py-12 text-[#1C1B19]">
      <StorefrontFonts />

      <div className="w-full max-w-lg">
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

        <div className="border border-[#E5E0D4] bg-white px-7 py-10 text-center sm:px-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1E3E0]">
            <PackageX size={24} className="text-[#7A2E2E]" />
          </div>

          <p className="mt-6 text-[13px] italic text-[#948C7E]">
            Product unavailable
          </p>

          <h1
            className="mt-3 text-3xl text-[#1C1B19] sm:text-4xl"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            We couldn't find this piece
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#6B655A]">
            {error ||
              'This product may have been removed or is no longer available.'}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex flex-1 items-center justify-center gap-2 bg-[#1C1B19] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#332F2A]"
            >
              <ArrowLeft size={15} />
              Go back
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

const SHIPPING_LABELS = {
  both: 'Delivery & pickup available',
  delivery: 'Delivery available',
  pickup: 'Pickup only',
}

export default function CatalogueProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const [activeVariant, setActiveVariant] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadProduct = async () => {
      if (!id) {
        setError('Invalid product link')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const data = await getProductById(id)

        if (isMounted) {
          setProduct(data)
          setActiveImage(0)
          setActiveVariant(data?.variants?.[0] ?? null)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError?.message ?? 'Product unavailable')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      isMounted = false
    }
  }, [id])

  const images = useMemo(() => product?.images ?? [], [product])

  const discountPercent = useMemo(() => {
    const original = Number(product?.original_price)
    const selling = Number(product?.selling_price)

    if (!original || !selling || original <= selling) return null

    return Math.round(((original - selling) / original) * 100)
  }, [product])

  const isRental = product?.product_type === 'rental'
  const isOutOfStock =
    product?.has_variants === false &&
    Number(product?.stock_quantity ?? 0) <= 0 &&
    product?.status !== 'draft'

  if (loading) {
    return <LoadingBlock label="Loading product…" />
  }

  if (error || !product) {
    return <ProductUnavailable error={error} />
  }

  const currentImage = images[activeImage]

  return (
    <main className="min-h-screen bg-[#FAF7F1] text-[#1C1B19]">
      <StorefrontFonts />
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#55504A] transition hover:text-[#1C1B19] sm:mb-8"
        >
          <ArrowLeft size={15} />
          Back to store
        </button>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* =====================================================
              GALLERY
          ====================================================== */}
          <div className="min-w-0">
            <div className="relative aspect-4/5 w-full overflow-hidden border border-[#E5E0D4] bg-[#F1EEE6]">
              {currentImage ? (
                <img
                  src={currentImage.image_url || currentImage.image}
                  alt={currentImage.alt_text || product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageOff size={28} className="text-[#B7AF9E]" />
                </div>
              )}

              {discountPercent && (
                <span className="absolute left-4 top-4 bg-[#7A2E2E] px-3 py-1 text-xs font-medium text-white">
                  {discountPercent}% off
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
                {images.map((image, index) => (
                  <button
                    key={image.id ?? index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`h-20 w-16 shrink-0 overflow-hidden border transition sm:h-24 sm:w-20 ${
                      activeImage === index
                        ? 'border-[#1C1B19]'
                        : 'border-[#E5E0D4] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image.image_url || image.image}
                      alt={image.alt_text || `${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* =====================================================
              DETAILS
          ====================================================== */}
          <div className="min-w-0">
            <p
              className="text-sm italic text-[#948C7E]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {product.product_type
                ? `${product.product_type.charAt(0).toUpperCase()}${product.product_type.slice(1)}`
                : 'Product'}
              {product.condition ? ` · ${product.condition}` : ''}
            </p>

            <h1
              className="mt-2 text-3xl leading-[1.1] text-[#1C1B19] sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-5 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-3">
              <span
                className="text-3xl font-semibold text-[#7A2E2E]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {formatMoney(product.selling_price, product.currency)}
              </span>

              {discountPercent && (
                <span className="text-base text-[#948C7E] line-through">
                  {formatMoney(product.original_price, product.currency)}
                </span>
              )}

              {isRental && (
                <span className="text-sm text-[#948C7E]">
                  {product.rental_price_per_day
                    ? `${formatMoney(product.rental_price_per_day, product.currency)} / day`
                    : ''}
                </span>
              )}
            </div>

            <div className="mt-5 h-px w-16 bg-[#7A2E2E] sm:mt-6" />

            {/* Description */}
            {product.description ? (
              <p className="mt-5 max-w-md text-[15px] leading-7 text-[#55504A] sm:mt-6">
                {product.description}
              </p>
            ) : (
              <p className="mt-5 max-w-md text-[15px] italic leading-7 text-[#948C7E] sm:mt-6">
                No description provided for this piece.
              </p>
            )}

            {/* Variants */}
            {product.has_variants && product.variants?.length > 0 && (
              <div className="mt-7 sm:mt-8">
                <p className="text-xs font-medium uppercase tracking-wide text-[#948C7E]">
                  Options
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setActiveVariant(variant)}
                      className={`border px-4 py-2 text-sm font-medium transition ${
                        activeVariant?.id === variant.id
                          ? 'border-[#1C1B19] bg-[#1C1B19] text-white'
                          : 'border-[#E5E0D4] text-[#1C1B19] hover:border-[#1C1B19]'
                      }`}
                    >
                      {variant.name ?? variant.sku ?? `Option ${variant.id}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Meta list */}
            <dl className="mt-7 space-y-3 border-t border-[#E5E0D4] pt-5 text-sm sm:mt-8 sm:pt-6">
              <div className="flex items-center gap-2.5 text-[#55504A]">
                <Truck size={15} className="shrink-0 text-[#948C7E]" />
                <dt className="sr-only">Shipping</dt>
                <dd>
                  {SHIPPING_LABELS[product.shipping_option] ??
                    'Shipping details available on request'}
                </dd>
              </div>

              <div className="flex items-center gap-2.5 text-[#55504A]">
                <ShieldCheck size={15} className="shrink-0 text-[#948C7E]" />
                <dt className="sr-only">Condition</dt>
                <dd className="capitalize">
                  {product.condition || 'Condition not specified'}
                </dd>
              </div>

              {!isOutOfStock ? (
                <div className="flex items-center gap-2.5 text-[#3F5B44]">
                  <CheckCircle2 size={15} className="shrink-0" />
                  <dd>In stock and ready to ship</dd>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 text-[#7A2E2E]">
                  <PackageX size={15} className="shrink-0" />
                  <dd>Currently out of stock</dd>
                </div>
              )}
            </dl>

            {/* Rental extras */}
            {isRental && (
              <div className="mt-6 space-y-1.5 border-t border-[#E5E0D4] pt-5 text-sm text-[#55504A] sm:pt-6">
                {product.late_return_penalty > 0 && (
                  <p>
                    Late return penalty:{' '}
                    <span className="font-medium text-[#1C1B19]">
                      {formatMoney(product.late_return_penalty, product.currency)}
                    </span>
                  </p>
                )}
                {product.damage_protection_fee > 0 && (
                  <p>
                    Damage protection fee:{' '}
                    <span className="font-medium text-[#1C1B19]">
                      {formatMoney(product.damage_protection_fee, product.currency)}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Seller */}
            <div className="mt-8 flex flex-col gap-4 border-t border-[#E5E0D4] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E0D4] text-sm font-medium text-[#1C1B19]">
                  {(product.seller_email || 'S').charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="text-xs text-[#948C7E]">Sold by</p>
                  <p className="text-sm font-medium text-[#1C1B19]">
                    {product.seller_email}
                  </p>
                </div>
              </div>

              {product.seller_email && (
                <a
                  href={`mailto:${product.seller_email}`}
                  className="inline-flex w-full items-center justify-center gap-2 border border-[#1C1B19] px-4 py-2.5 text-sm font-medium text-[#1C1B19] transition hover:bg-[#1C1B19] hover:text-white sm:w-auto"
                >
                  <Mail size={14} />
                  Contact
                </a>
              )}
            </div>

            {product.updated_at && (
              <p className="mt-5 text-xs text-[#948C7E] sm:mt-6">
                Listed {formatDate(product.created_at)}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}