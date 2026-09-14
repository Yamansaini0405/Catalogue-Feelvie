import { AlertCircle, CheckCircle2, Inbox, Loader2 } from 'lucide-react'

export function Card({ className = '', children, ...props }) {
  return (
    <section className={`card-surface p-5 sm:p-6 ${className}`} {...props}>
      {children}
    </section>
  )
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

const BADGE_TONES = {
  neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger: 'bg-red-50 text-red-700 ring-red-200',
  gold: 'bg-gold-50 text-gold-600 ring-gold-200',
}

export function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${BADGE_TONES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export function Spinner({ size = 18, className = '' }) {
  return <Loader2 size={size} className={`animate-spin text-brand-600 ${className}`} />
}

export function LoadingBlock({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <Spinner size={26} />
      <p className="text-sm font-medium">{label}</p>
    </div>
  )
}

export function EmptyState({ icon, title, description, action }) {
  const StateIcon = icon ?? Inbox
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-14 text-center">
      <div className="rounded-full bg-white p-3 shadow-soft">
        <StateIcon size={22} className="text-brand-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function Alert({ variant = 'info', children, className = '' }) {
  const styles = {
    info: { classes: 'bg-brand-50 text-brand-800 border-brand-200', Icon: AlertCircle },
    error: { classes: 'bg-red-50 text-red-700 border-red-200', Icon: AlertCircle },
    success: { classes: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle2 },
  }[variant]

  const { classes, Icon } = styles

  return (
    <div className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-medium ${classes} ${className}`}>
      <Icon size={16} className="mt-0.5 shrink-0" />
      <div className="flex-1">{children}</div>
    </div>
  )
}

export function StatCard({ label, value, icon: Icon, tone = 'brand', trend }) {
  const toneClasses = {
    brand: 'bg-brand-50 text-brand-600',
    gold: 'bg-gold-50 text-gold-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    slate: 'bg-slate-100 text-slate-600',
  }[tone]

  return (
    <div className="card-surface flex items-center justify-between gap-4 p-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1.5 text-2xl font-semibold text-slate-900">{value}</p>
        {trend && <p className="mt-1 text-xs text-slate-500">{trend}</p>}
      </div>
      {Icon && (
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneClasses}`}>
          <Icon size={20} />
        </div>
      )}
    </div>
  )
}
