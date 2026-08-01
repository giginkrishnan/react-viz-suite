import type { ReactNode } from 'react'
import { InsightCard, type InsightCardProps } from './InsightCard'
import styles from './InsightStrip.module.css'

type InsightStripProps = {
  cards: InsightCardProps[]
  chart?: ReactNode
  chartTitle?: string
  chartSubtitle?: string
  /** horizontal = 3-up grid; vertical = stacked column */
  layout?: 'horizontal' | 'vertical'
}

export function InsightStrip({
  cards,
  chart,
  chartTitle = 'Trend',
  chartSubtitle,
  layout = 'horizontal',
}: InsightStripProps) {
  return (
    <section className={styles.strip} aria-label="Insights">
      <div
        className={`${styles.cards} ${
          layout === 'vertical' ? styles.cardsVertical : ''
        }`}
      >
        {cards.map((card, index) => (
          <InsightCard
            key={card.title}
            {...card}
            revealDelayMs={index * 70}
          />
        ))}
      </div>
      {chart ? (
        <article className={styles.chartCard}>
          <div className={styles.chartHead}>
            <h3>{chartTitle}</h3>
            {chartSubtitle ? <p>{chartSubtitle}</p> : null}
          </div>
          <div className={styles.chartBody}>{chart}</div>
        </article>
      ) : null}
    </section>
  )
}
