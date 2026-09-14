import { Loader2 } from 'lucide-react'
import { forwardRef } from 'react'

const VARIANT_CLASSES = {
  primary:
    'bg-brand-700 text-white shadow-soft hover:bg-brand-800 focus-visible:ring-brand-300 disabled:bg-brand-300',
  secondary:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-300 disabled:text-slate-400',
  ghost:
    'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-300 disabled:text-slate-300',
  danger:
    'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-300 disabled:text-red-300',
  dark:
    'bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-400 disabled:bg-slate-400',
}

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-sm gap-2',
}

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, icon: Icon, className = '', disabled, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  )
})

export default Button
