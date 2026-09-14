import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ open, onClose, title, description, children, footer, size = 'md', dismissible = true }) {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && dismissible) onClose?.()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose, dismissible])

  if (!open) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size]

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Close dialog backdrop"
        className="absolute inset-0 cursor-default"
        onClick={() => dismissible && onClose?.()}
        tabIndex={-1}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`animate-scale-in relative max-h-[90vh] w-full ${sizeClasses} overflow-hidden rounded-2xl bg-white shadow-elevated`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            {title && <h2 className="text-lg font-semibold text-slate-900">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
          </div>
          {dismissible && (
            <button
              type="button"
              onClick={() => onClose?.()}
              className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-5">{children}</div>

        {footer && <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}
