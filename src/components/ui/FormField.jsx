import { forwardRef } from 'react'

const baseFieldClasses =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500'

export function FormField({ label, hint, required, error, className = '', children }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      {label && (
        <span className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="block text-xs text-slate-500">{hint}</span>}
      {error && <span className="block text-xs font-medium text-red-600">{error}</span>}
    </label>
  )
}

export const Input = forwardRef(function Input({ className = '', error, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={`${baseFieldClasses} ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''} ${className}`}
      {...props}
    />
  )
})

export const Textarea = forwardRef(function Textarea({ className = '', error, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={`${baseFieldClasses} resize-y ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''} ${className}`}
      {...props}
    />
  )
})

export const Select = forwardRef(function Select({ className = '', error, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={`${baseFieldClasses} cursor-pointer ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''} ${className}`}
      {...props}
    >
      {children}
    </select>
  )
})

export function Checkbox({ label, className = '', ...props }) {
  return (
    <label className={`inline-flex cursor-pointer items-center gap-2.5 ${className}`}>
      <input
        type="checkbox"
        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-brand-600 focus:ring-2 focus:ring-brand-200"
        {...props}
      />
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  )
}
