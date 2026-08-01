import type { ReactNode } from 'react'
import styles from './InsightBoard.module.css'

type InsightBoardProps = {
  children: ReactNode
  className?: string
  'aria-label'?: string
}

/** Flush stacked rows: left metric copy + right chart (dashboard screenshots). */
export function InsightBoard({
  children,
  className,
  'aria-label': ariaLabel = 'Performance insights',
}: InsightBoardProps) {
  return (
    <section
      className={[styles.board, className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
    >
      {children}
    </section>
  )
}

type InsightMetricRowProps = {
  /** Large metric (e.g. "$8,674") — omit when using `title` as the heading */
  value?: ReactNode
  /** Small label under value, or use `title` for an h2-style heading */
  label?: ReactNode
  /** h2-style title when there is no large metric value */
  title?: ReactNode
  description?: ReactNode
  hint?: ReactNode
  /** Usually a Link / button (“Go to report”) */
  action?: ReactNode
  chartEyebrow?: ReactNode
  chartCallout?: ReactNode
  children: ReactNode
  className?: string
}

export function InsightMetricRow({
  value,
  label,
  title,
  description,
  hint,
  action,
  chartEyebrow,
  chartCallout,
  children,
  className,
}: InsightMetricRowProps) {
  return (
    <article className={[styles.row, className].filter(Boolean).join(' ')}>
      <div className={styles.copy}>
        {value != null ? <p className={styles.metricValue}>{value}</p> : null}
        {label != null ? <p className={styles.metricLabel}>{label}</p> : null}
        {title != null ? <h2 className={styles.title}>{title}</h2> : null}
        {description != null ? <p className={styles.description}>{description}</p> : null}
        {hint != null ? <p className={styles.metricHint}>{hint}</p> : null}
        {action != null ? <div className={styles.action}>{action}</div> : null}
      </div>
      <div className={styles.chart}>
        {chartEyebrow != null ? <p className={styles.chartEyebrow}>{chartEyebrow}</p> : null}
        {chartCallout != null ? <p className={styles.chartCallout}>{chartCallout}</p> : null}
        {children}
      </div>
    </article>
  )
}
