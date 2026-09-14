import { ImageOff, Pencil, Share2 } from 'lucide-react'
import { Badge } from '../ui'
import { STATUS_BADGE_STYLES } from '../../constants/productOptions'
import { formatMoney } from '../../utils/format'

export default function ProductCard({ product, onView, onEdit, onShare }) {
  const firstImage = product?.images?.[0]?.image_url || product?.images?.[0]?.image
  const statusTone = STATUS_BADGE_STYLES[product?.status] ?? STATUS_BADGE_STYLES.draft

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition hover:shadow-elevated">
      <button type="button" onClick={onView} className="block w-full text-left">
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          {firstImage ? (
            <img
              src={firstImage}
              alt={product?.name ?? 'Product'}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              <ImageOff size={28} />
            </div>
          )}
          <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ring-inset ${statusTone}`}>
            {product?.status ?? 'draft'}
          </span>
        </div>
      </button>

      <div className="space-y-2 p-4">
        <div>
          <p className="line-clamp-1 text-sm font-semibold text-slate-900">{product?.name ?? 'Untitled'}</p>
          <p className="mt-0.5 text-xs text-slate-500">Stock: {product?.stock_quantity ?? 0}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-slate-900">{formatMoney(product?.selling_price, product?.currency)}</p>
          <Badge tone="brand" className="capitalize">
            {product?.product_type ?? '—'}
          </Badge>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            type="button"
            onClick={onShare}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            <Share2 size={13} /> Share
          </button>
        </div>
      </div>
    </article>
  )
}
