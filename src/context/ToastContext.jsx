import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { cn } from '../utils/cn'
import { AlertCircle, CheckCircle, Info, X } from '../components/ui/icons'

const ToastContext = createContext(null)

const TONES = {
  success: {
    wrap: 'border-emerald-200 bg-white',
    icon: 'bg-emerald-50 text-emerald-600',
    Icon: CheckCircle,
  },
  error: {
    wrap: 'border-rose-200 bg-white',
    icon: 'bg-rose-50 text-rose-600',
    Icon: AlertCircle,
  },
  info: {
    wrap: 'border-brand-200 bg-white',
    icon: 'bg-brand-50 text-brand-600',
    Icon: Info,
  },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((items) => items.filter((item) => item.id !== id))
  }, [])

  const push = useCallback(
    (message, tone = 'success', duration = 3600) => {
      counter.current += 1
      const id = counter.current
      setToasts((items) => [...items, { id, message, tone }])
      window.setTimeout(() => dismiss(id), duration)
    },
    [dismiss],
  )

  const value = useMemo(
    () => ({
      success: (message) => push(message, 'success'),
      error: (message) => push(message, 'error', 4600),
      info: (message) => push(message, 'info'),
      dismiss,
    }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:right-4 sm:left-auto sm:items-end"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const tone = TONES[toast.tone] ?? TONES.info
          const Icon = tone.Icon
          return (
            <div
              key={toast.id}
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border p-3.5 shadow-pop animate-slide-in-right',
                tone.wrap,
              )}
            >
              <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg', tone.icon)}>
                <Icon className="h-4 w-4" />
              </span>
              <p className="flex-1 pt-1 text-sm leading-snug text-slate-700">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Tutup notifikasi"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast harus dipakai di dalam <ToastProvider>.')
  return context
}
