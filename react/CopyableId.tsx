import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { cn } from './cn.js'
import styles from './CopyableId.module.css'

export function shortenId(id?: string | null, max = 18) {
  if (!id) return '—'
  return id.length > max ? `${id.slice(0, 8)}…${id.slice(-4)}` : id
}

type CopyableIdProps = {
  value?: string | null
  label?: string
  className?: string
  /** Show full value instead of shortened */
  full?: boolean
  /** Compact mono text only (no label prefix) */
  size?: 'sm' | 'md'
}

export function CopyableId({
  value,
  label,
  className,
  full = false,
  size = 'sm',
}: CopyableIdProps) {
  const [copied, setCopied] = useState(false)

  if (!value) {
    return <span className={cn(styles.root, styles[size], className)}>—</span>
  }

  const id = value

  async function copy() {
    try {
      await navigator.clipboard.writeText(id)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <span className={cn(styles.root, styles[size], className)}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <code className={styles.code} title={id}>
        {full ? id : shortenId(id)}
      </code>
      <button
        type="button"
        className={styles.button}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void copy()
        }}
        aria-label={copied ? `Copied ${label || 'id'}` : `Copy ${label || 'id'}`}
        title={copied ? 'Copied' : 'Copy'}
      >
        {copied ? <Check size={12} aria-hidden /> : <Copy size={12} aria-hidden />}
      </button>
    </span>
  )
}
