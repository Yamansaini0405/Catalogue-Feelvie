import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { ToastContext } from '../hooks/useToast'

const VARIANT_STYLES = {
  success: {
    icon: CheckCircle2,
    classes: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    iconClasses: 'text-emerald-600',
  },
  error: {
    icon: AlertTriangle,
    classes: 'border-red-200 bg-red-50 text-red-800',
    iconClasses: 'text-red-600',
  },
  info: {
    icon: Info,
    classes: 'border-brand-200 bg-brand-50 text-brand-800',
    iconClasses: 'text-brand-600',
  },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (message, variant = 'info', duration = 3200) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      setToasts((previous) => [...previous, { id, message, variant }])
      if (duration) {
        window.setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss],
  )

  const api = useMemo(
    () => ({
      push,
      dismiss,
      success: (message, duration) => push(message, 'success', duration),
      error: (message, duration) => push(message, 'error', duration),
      info: (message, duration) => push(message, 'info', duration),
    }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => {
          const variant = VARIANT_STYLES[toast.variant] ?? VARIANT_STYLES.info
          const Icon = variant.icon
          return (
            <div
              key={toast.id}
              role="status"
              className={`animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl border px-4 py-3 shadow-elevated ${variant.classes}`}
            >
              <Icon size={18} className={`mt-0.5 shrink-0 ${variant.iconClasses}`} />
              <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="shrink-0 rounded-md p-0.5 opacity-60 transition hover:opacity-100"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
