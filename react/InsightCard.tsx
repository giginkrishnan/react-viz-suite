import { useEffect, useState, type CSSProperties } from 'react'
import { useScrollReveal } from './useScrollReveal.js'
import styles from './InsightCard.module.css'

export type InsightTone = 'green' | 'amber' | 'muted'

export type InsightCardProps = {
  title: string
  description?: string
  value: string
  count?: string | number
  progress?: number
  trend?: 'up' | 'down' | 'flat'
  tone?: InsightTone
  /** Stagger delay when revealing in a strip */
  revealDelayMs?: number
}

function parseDisplayNumber(raw: string): {
  prefix: string
  number: number | null
  suffix: string
  decimals: number
} {
  const match = raw.trim().match(/^([^0-9+-]*)([+-]?\d[\d,]*(?:\.\d+)?)(.*)$/)
  if (!match) {
    return { prefix: '', number: null, suffix: raw, decimals: 0 }
  }
  const [, prefix, numeric, suffix] = match
  const cleaned = numeric.replace(/,/g, '')
  const number = Number(cleaned)
  if (!Number.isFinite(number)) {
    return { prefix: '', number: null, suffix: raw, decimals: 0 }
  }
  const decimals = cleaned.includes('.')
    ? (cleaned.split('.')[1]?.length ?? 0)
    : 0
  return { prefix, number, suffix, decimals }
}

function formatAnimatedNumber(
  value: number,
  decimals: number,
  useGrouping: boolean,
) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
    useGrouping,
  }).format(value)
}

export function InsightCard({
  title,
  description,
  value,
  count,
  progress = 0,
  trend = 'up',
  tone = 'green',
  revealDelayMs = 0,
}: InsightCardProps) {
  const pct = Math.max(0, Math.min(100, progress))
  const parsed = parseDisplayNumber(value)
  const { ref, revealed } = useScrollReveal<HTMLElement>({
    resetKey: `${title}:${value}:${pct}`,
    threshold: 0.22,
  })
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    if (!revealed || parsed.number == null) {
      setDisplayValue(value)
      return
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduceMotion) {
      setDisplayValue(value)
      return
    }

    const target = parsed.number
    const duration = 700
    const start = performance.now()
    const useGrouping = value.includes(',')
    let frame = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = target * eased
      setDisplayValue(
        `${parsed.prefix}${formatAnimatedNumber(current, parsed.decimals, useGrouping)}${parsed.suffix}`,
      )
      if (t < 1) frame = requestAnimationFrame(tick)
      else setDisplayValue(value)
    }

    setDisplayValue(
      `${parsed.prefix}${formatAnimatedNumber(0, parsed.decimals, useGrouping)}${parsed.suffix}`,
    )
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [revealed, value, parsed.number, parsed.prefix, parsed.suffix, parsed.decimals])

  return (
    <article
      ref={ref}
      className={`${styles.card} ${styles[`tone_${tone}`]} ${styles.reveal} ${
        revealed ? styles.revealed : ''
      }`}
      style={{ '--reveal-delay': `${revealDelayMs}ms` } as CSSProperties}
    >
      <div className={styles.top}>
        <div className={styles.copy}>
          <h3>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>
        <div className={styles.meta}>
          {count != null ? <span className={styles.count}>{count}</span> : null}
          <span className={styles.trend} aria-hidden>
            {trend === 'down' ? '▾' : trend === 'flat' ? '–' : '▴'}
          </span>
        </div>
      </div>
      <p className={styles.value}>{displayValue}</p>
      <div className={styles.barTrack} aria-hidden>
        <i
          className={styles.barFill}
          style={{ width: revealed ? `${pct}%` : '0%' }}
        />
      </div>
    </article>
  )
}
