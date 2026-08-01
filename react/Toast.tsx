import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { cn } from './cn.js'
import styles from './Toast.module.css'

type ToastVariant = 'success' | 'error' | 'info'

type ToastItem = {
  id: string
  message: string
  variant: ToastVariant
  leaving?: boolean
}

type ToastApi = {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

const AUTO_DISMISS_MS = 3600
const EXIT_MS = 180

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timers = useRef(new Map<string, number>())

  const remove = useCallback((id: string) => {
    const existing = timers.current.get(id)
    if (existing) {
      window.clearTimeout(existing)
      timers.current.delete(id)
    }
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const dismiss = useCallback(
    (id: string) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
      )
      window.setTimeout(() => remove(id), EXIT_MS)
    },
    [remove],
  )

  const push = useCallback(
    (variant: ToastVariant, message: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      setToasts((prev) => [...prev.slice(-4), { id, message, variant }])
      const timer = window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
      timers.current.set(id, timer)
    },
    [dismiss],
  )

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('error', message),
      info: (message) => push('info', message),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={styles.viewport} aria-live="polite" aria-relevant="additions">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(styles.toast, styles[toast.variant])}
            data-leaving={toast.leaving ? 'true' : undefined}
            role={toast.variant === 'error' ? 'alert' : 'status'}
          >
            <span className={styles.icon} aria-hidden>
              {toast.variant === 'success' ? (
                <CheckCircle2 size={15} strokeWidth={2.25} />
              ) : toast.variant === 'error' ? (
                <CircleAlert size={15} strokeWidth={2.25} />
              ) : (
                <Info size={15} strokeWidth={2.25} />
              )}
            </span>
            <p className={styles.message}>{toast.message}</p>
            <button
              type="button"
              className={styles.dismiss}
              aria-label="Dismiss"
              onClick={() => dismiss(toast.id)}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}
