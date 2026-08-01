import styles from './charts.module.css'
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { useScrollReveal } from '../useScrollReveal.js'

function ChartTooltip({
  xPct,
  yPct,
  title,
  lines,
}: {
  xPct: number
  yPct: number
  title: string
  lines: string[]
}) {
  return (
    <div
      className={styles.tooltip}
      style={{
        left: `${Math.min(92, Math.max(8, xPct))}%`,
        top: `${Math.min(78, Math.max(8, yPct))}%`,
      }}
      role="tooltip"
    >
      <strong>{title}</strong>
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </div>
  )
}

function ChartFrame({
  children,
  onLeave,
  tooltip,
}: {
  children: ReactNode
  onLeave: () => void
  tooltip: ReactNode
}) {
  return (
    <div className={styles.chartFrame} onMouseLeave={onLeave}>
      {children}
      {tooltip}
    </div>
  )
}

type CapsuleBarChartProps = {
  values: number[]
  labels?: string[]
  accentIndex?: number
  /** Indexes that show a checkmark at the top of the capsule */
  checkedIndexes?: number[]
  height?: number
  /** 'amber' matches the soft orange goal capsules; 'cyan' is the earlier style */
  tone?: 'amber' | 'cyan'
  showValues?: boolean
  /** Singular unit shown in hover tooltip, e.g. "booking" */
  valueUnit?: string
}

export function CapsuleBarChart({
  values,
  labels,
  accentIndex,
  checkedIndexes = [],
  height = 150,
  tone = 'amber',
  showValues = true,
  valueUnit = 'booking',
}: CapsuleBarChartProps) {
  const shadowId = useId().replace(/:/g, '')
  const dataKey = values.join(',')
  const { ref, revealed } = useScrollReveal<SVGSVGElement>({ resetKey: dataKey })
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const max = Math.max(...values, 1)
  const width = Math.max(360, values.length * 52)
  const padX = 14
  const padTop = 22
  const padBottom = labels?.length ? 24 : 14
  const plotH = height - padTop - padBottom
  const slot = (width - padX * 2) / Math.max(values.length, 1)
  const barW = Math.min(28, Math.max(18, slot * 0.42))
  const checked = new Set(
    checkedIndexes.length
      ? checkedIndexes
      : accentIndex != null
        ? [accentIndex]
        : values
            .map((v, i) => ({ v, i }))
            .sort((a, b) => b.v - a.v)
            .slice(0, 2)
            .map((x) => x.i),
  )

  const hover = hoverIndex != null ? values[hoverIndex] : null
  const hoverX =
    hoverIndex != null
      ? padX + hoverIndex * slot + slot / 2
      : 0
  const hoverY =
    hoverIndex != null && hover != null
      ? padTop + plotH - (hover > 0 ? Math.max((hover / max) * (plotH * 0.82), 16) : 0)
      : 0

  function unitLabel(count: number) {
    return `${count.toLocaleString()} ${count === 1 ? valueUnit : `${valueUnit}s`}`
  }

  return (
    <ChartFrame
      onLeave={() => setHoverIndex(null)}
      tooltip={
        hoverIndex != null && hover != null ? (
          <ChartTooltip
            xPct={(hoverX / width) * 100}
            yPct={(hoverY / height) * 100}
            title={labels?.[hoverIndex] || `Week ${hoverIndex + 1}`}
            lines={[unitLabel(hover)]}
          />
        ) : null
      }
    >
    <svg
      ref={ref}
      className={`${styles.svg} ${styles.svgSoft} ${styles.chartReveal} ${
        revealed ? styles.chartRevealed : ''
      }`}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-hidden
    >
      <defs>
        <filter id={shadowId} x="-50%" y="-20%" width="200%" height="140%">
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="3.5"
            floodColor="#94a3b8"
            floodOpacity="0.18"
          />
        </filter>
      </defs>
      {values.map((value, index) => {
        const x = padX + index * slot + (slot - barW) / 2
        const isChecked = checked.has(index)
        const hasValue = value > 0
        const h = hasValue
          ? Math.max((value / max) * (plotH * 0.82), 16)
          : 0
        const y = padTop + plotH - h
        const fillClass =
          tone === 'amber'
            ? isChecked || accentIndex === index
              ? styles.barFillAmber
              : styles.barFillAmberSoft
            : accentIndex === index
              ? styles.barFillActive
              : styles.barFillSoft
        const showCheck = isChecked && h >= barW + 10
        const isHover = hoverIndex === index

        return (
          <g
            key={index}
            className={styles.capsuleGroup}
            style={
              {
                '--bar-delay': `${0.08 + index * 0.06}s`,
                opacity: hoverIndex != null && !isHover ? 0.45 : 1,
              } as CSSProperties
            }
            onMouseEnter={() => setHoverIndex(index)}
          >
            <rect
              x={x - 6}
              y={padTop}
              width={barW + 12}
              height={plotH}
              className={styles.hitArea}
            />
            <rect
              x={x}
              y={padTop}
              width={barW}
              height={plotH}
              rx={barW / 2}
              className={styles.barShell}
            />
            {hasValue ? (
              <g className={styles.capsuleFill}>
                <rect
                  x={x + 2.5}
                  y={y}
                  width={barW - 5}
                  height={h}
                  rx={(barW - 5) / 2}
                  className={fillClass}
                  filter={`url(#${shadowId})`}
                />
              </g>
            ) : null}
            {showCheck ? (
              <g className={styles.capsuleCheck}>
                <circle
                  cx={x + barW / 2}
                  cy={y + 8}
                  r={5.5}
                  className={
                    tone === 'amber' ? styles.barCapAmber : styles.barCapActive
                  }
                />
                <text
                  x={x + barW / 2}
                  y={y + 11.5}
                  textAnchor="middle"
                  className={styles.checkMark}
                >
                  ✓
                </text>
              </g>
            ) : null}
            {showValues ? (
              <text
                x={x + barW + 4}
                y={
                  hasValue
                    ? Math.min(padTop + plotH - 2, y + h - 2)
                    : padTop + plotH - 2
                }
                className={styles.barValue}
              >
                {Math.round(value)}
              </text>
            ) : null}
            {labels?.[index] ? (
              <text
                x={x + barW / 2}
                y={height - 6}
                textAnchor="middle"
                className={styles.tick}
              >
                {labels[index]}
              </text>
            ) : null}
          </g>
        )
      })}
    </svg>
    </ChartFrame>
  )
}

type TimelineSegment = {
  label: string
  value?: number
  tone?: 'cyan' | 'amber' | 'empty'
}

type TimelineDetail = {
  label: string
  value: string
}

type PerformanceTimelineProps = {
  title?: string
  subtitle?: string
  totalLabel?: string
  totalValue: string
  footnote?: string
  segments: TimelineSegment[]
  activeIndex?: number
  onActiveIndexChange?: (index: number) => void
  salesLabel?: string
  salesValue?: string
  profitLabel?: string
  profitValue?: string
  periodLabel?: string
  details?: TimelineDetail[]
}

export function PerformanceTimeline({
  title = 'Performance Timeline',
  subtitle = 'Performance timeline over 6 months',
  totalLabel = 'Total',
  totalValue,
  footnote = 'Value vs Effort',
  segments,
  activeIndex = 2,
  onActiveIndexChange,
  salesLabel = 'Sales',
  salesValue,
  profitLabel = 'Profit',
  profitValue,
  periodLabel,
  details = [],
}: PerformanceTimelineProps) {
  const active = segments[activeIndex] ?? segments[0]
  const { ref, revealed } = useScrollReveal<HTMLDivElement>({
    resetKey: segments.map((segment) => segment.label).join('|'),
  })

  const chipClass = (tone: TimelineSegment['tone']) => {
    if (tone === 'amber') return styles.chip_amber
    if (tone === 'cyan') return styles.chip_cyan
    return styles.chip_empty
  }

  const go = (direction: -1 | 1) => {
    if (!segments.length) return
    const next = Math.min(
      segments.length - 1,
      Math.max(0, activeIndex + direction),
    )
    onActiveIndexChange?.(next)
  }

  return (
    <div
      ref={ref}
      className={`${styles.timeline} ${styles.chartReveal} ${
        revealed ? styles.chartRevealed : ''
      }`}
    >
      <div className={styles.timelineHead}>
        <div className={styles.timelineCopy}>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className={styles.timelineStage}>
        <div className={styles.timelineRail}>
          <button
            type="button"
            className={styles.timelineNav}
            aria-label="Previous week"
            onClick={() => go(-1)}
          >
            ‹
          </button>
          <div className={styles.timelineTrack}>
            {segments.map((segment, index) => (
              <button
                key={`${segment.label}-${index}`}
                type="button"
                className={styles.timelineSlot}
                style={
                  {
                    '--slot-delay': `${0.1 + index * 0.05}s`,
                  } as CSSProperties
                }
                onClick={() => onActiveIndexChange?.(index)}
                aria-pressed={index === activeIndex}
              >
                {segment.value != null ? (
                  <span className={styles.timelineValue}>{segment.value}</span>
                ) : (
                  <span className={styles.timelineValueSpacer} />
                )}
                <i
                  className={`${styles.timelineChip} ${chipClass(
                    segment.tone ??
                      (index % 3 === 1
                        ? 'amber'
                        : index % 3 === 0
                          ? 'cyan'
                          : 'empty'),
                  )} ${index === activeIndex ? styles.chipActive : ''}`}
                />
                <span className={styles.timelineMonth}>{segment.label}</span>
                {index === activeIndex ? (
                  <span className={styles.timelinePillar} />
                ) : null}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={styles.timelineNav}
            aria-label="Next week"
            onClick={() => go(1)}
          >
            ›
          </button>
        </div>

        {active ? (
          <div
            className={styles.timelineFloat}
            style={{
              left: `${Math.min(
                72,
                Math.max(18, ((activeIndex + 0.5) / Math.max(segments.length, 1)) * 100),
              )}%`,
            }}
          >
            <div className={styles.timelineCard}>
              {periodLabel ? (
                <p className={styles.timelinePeriod}>{periodLabel}</p>
              ) : null}
              <div>
                <p>{salesLabel}</p>
                <strong>{salesValue ?? active.value ?? '—'}</strong>
              </div>
              <div>
                <p>{profitLabel}</p>
                <strong>{profitValue ?? '—'}</strong>
              </div>
            </div>
            {details.length > 0 ? (
              <div className={styles.timelineDetails}>
                {details.map((detail) => (
                  <div key={detail.label} className={styles.timelineDetailRow}>
                    <span>{detail.label}</span>
                    <strong>{detail.value}</strong>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className={styles.timelineFoot}>
        <div>
          <p className={styles.timelineTotal}>{totalValue}</p>
          <p className={styles.timelineTotalLabel}>{totalLabel}</p>
          <p className={styles.timelineNote}>{footnote}</p>
        </div>
      </div>
    </div>
  )
}

function smoothLinePath(
  points: Array<{ x: number; y: number }>,
  tension = 0.3,
) {
  if (points.length === 0) return ''
  if (points.length === 1) return `M${points[0].x} ${points[0].y}`
  if (points.length === 2) {
    return `M${points[0].x} ${points[0].y} L${points[1].x} ${points[1].y}`
  }

  let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const cp1x = p1.x + ((p2.x - p0.x) * tension) / 2
    const cp1y = p1.y + ((p2.y - p0.y) * tension) / 2
    const cp2x = p2.x - ((p3.x - p1.x) * tension) / 2
    const cp2y = p2.y - ((p3.y - p1.y) * tension) / 2
    d += ` C${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}

type PillLineChartProps = {
  values: number[]
  highlightIndexes?: number[]
  labels?: string[]
  goal?: number
  deltas?: string[]
  /** SVG canvas width — use a larger value for full-width cards */
  width?: number
  height?: number
  valueUnit?: string
  /** When false, hide angled axis ticks (useful when labels live outside the SVG). */
  showTicks?: boolean
}

export function PillLineChart({
  values,
  highlightIndexes = [],
  labels,
  goal,
  deltas,
  width = 520,
  height = 168,
  valueUnit = 'booking',
  showTicks = true,
}: PillLineChartProps) {
  const reactId = useId().replace(/:/g, '')
  const pathRef = useRef<SVGPathElement | null>(null)
  const dataKey = values.join(',')
  const { ref, revealed } = useScrollReveal<SVGSVGElement>({ resetKey: dataKey })
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const padX = 36
  const padTop = 34
  const padBottom = showTicks && labels?.length ? 34 : 16
  const plotW = width - padX * 2
  const plotH = height - padTop - padBottom
  const band = plotH * 0.62
  const bandTop = padTop + (plotH - band) / 2
  const max = Math.max(...values, goal ?? 0, 1)
  const min = Math.min(...values, 0)
  const range = Math.max(max - min, 1)

  const points = values.map((value, index) => {
    const x =
      padX +
      (values.length <= 1 ? plotW / 2 : (index / (values.length - 1)) * plotW)
    const y = bandTop + band - ((value - min) / range) * band
    return { x, y, value }
  })

  const line = smoothLinePath(points, 0.35)
  const pillW = Math.min(28, Math.max(20, plotW / Math.max(values.length * 2.8, 1)))
  const pillTop = bandTop - 14
  const pillH = band + 36
  const highlightSet = new Set(highlightIndexes)
  const hoverPoint = hoverIndex != null ? points[hoverIndex] : null
  const slotW =
    values.length <= 1 ? plotW : plotW / Math.max(values.length - 1, 1)

  useLayoutEffect(() => {
    const el = pathRef.current
    if (!el) return
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const length = el.getTotalLength()

    const clearDash = () => {
      el.style.transition = 'none'
      el.style.strokeDasharray = 'none'
      el.style.strokeDashoffset = '0'
    }

    if (reduceMotion || length <= 0) {
      clearDash()
      return
    }

    if (!revealed) {
      el.style.transition = 'none'
      el.style.strokeDasharray = `${length}`
      el.style.strokeDashoffset = `${length}`
      return
    }

    el.style.transition = 'none'
    el.style.strokeDasharray = `${length}`
    el.style.strokeDashoffset = `${length}`
    void el.getBoundingClientRect()
    el.style.transition = 'stroke-dashoffset 1s 0.08s var(--ease-out)'
    el.style.strokeDashoffset = '0'

    const onEnd = (event: TransitionEvent) => {
      if (event.propertyName !== 'stroke-dashoffset') return
      clearDash()
      el.removeEventListener('transitionend', onEnd)
    }
    el.addEventListener('transitionend', onEnd)
    const fallback = window.setTimeout(clearDash, 1300)
    return () => {
      el.removeEventListener('transitionend', onEnd)
      window.clearTimeout(fallback)
    }
  }, [revealed, dataKey])

  function unitLabel(count: number) {
    return `${count.toLocaleString()} ${count === 1 ? valueUnit : `${valueUnit}s`}`
  }

  return (
    <ChartFrame
      onLeave={() => setHoverIndex(null)}
      tooltip={
        hoverPoint && hoverIndex != null ? (
          <ChartTooltip
            xPct={(hoverPoint.x / width) * 100}
            yPct={(hoverPoint.y / height) * 100}
            title={labels?.[hoverIndex] || `Week ${hoverIndex + 1}`}
            lines={[
              unitLabel(hoverPoint.value),
              deltas?.[hoverIndex] ? `${deltas[hoverIndex]} vs prior week` : '',
            ].filter(Boolean)}
          />
        ) : null
      }
    >
    <svg
      ref={ref}
      className={`${styles.svg} ${styles.svgSoft} ${styles.chartReveal} ${
        revealed ? styles.chartRevealed : ''
      }`}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-hidden
    >
      <defs>
        <filter
          id={`pillShadow-${reactId}`}
          x="-40%"
          y="-20%"
          width="180%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="4"
            floodColor="#148106"
            floodOpacity="0.22"
          />
        </filter>
      </defs>

      {highlightIndexes.map((index, hi) => {
        const point = points[index]
        if (!point) return null
        const letter = (labels?.[index] || 'W').charAt(0).toUpperCase()
        const badgeR = pillW * 0.32
        const badgeCy = pillTop + pillH - badgeR - 7
        return (
          <g
            key={`pill-${index}`}
            className={styles.pillGroup}
            style={
              {
                '--pill-delay': `${0.1 + hi * 0.08}s`,
              } as CSSProperties
            }
          >
            <rect
              x={point.x - pillW / 2}
              y={pillTop}
              width={pillW}
              height={pillH}
              rx={pillW / 2}
              className={hi === 0 ? styles.pillActive : styles.pillMuted}
              filter={`url(#pillShadow-${reactId})`}
            />
            {showTicks ? (
              <>
                <circle
                  cx={point.x}
                  cy={badgeCy}
                  r={badgeR}
                  className={styles.pillBadge}
                />
                <text
                  x={point.x}
                  y={badgeCy + 3.2}
                  textAnchor="middle"
                  className={styles.pillBadgeText}
                >
                  {letter}
                </text>
              </>
            ) : null}
          </g>
        )
      })}

      {line ? (
        <path ref={pathRef} d={line} className={styles.line} fill="none" />
      ) : null}

      {points.map((point, index) => {
        const highlighted = highlightSet.has(index)
        const delta = deltas?.[index]
        return (
          <g
            key={index}
            className={styles.pillDot}
            style={
              {
                '--dot-delay': `${0.35 + index * 0.04}s`,
              } as CSSProperties
            }
          >
            {highlighted && delta ? (
              <g
                className={styles.pillDelta}
                transform={`translate(${point.x}, ${Math.max(14, pillTop - 8)})`}
              >
                <polygon
                  points={
                    delta.trim().startsWith('-')
                      ? '-3.5,-2 0,3 3.5,-2'
                      : '-3.5,2 0,-3 3.5,2'
                  }
                  className={styles.deltaArrow}
                />
                <text x="7" y="2.5" className={styles.delta}>
                  {delta}
                </text>
              </g>
            ) : null}

            {highlighted ? (
              <>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={9}
                  className={styles.targetRing}
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={4.5}
                  className={styles.dotOuter}
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={2}
                  className={styles.dotInner}
                />
              </>
            ) : (
              <>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={3.8}
                  className={styles.dotOuter}
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={1.4}
                  className={styles.dotInner}
                />
              </>
            )}

            {showTicks && labels?.[index] ? (
              <text
                x={point.x + 2}
                y={height - 10}
                textAnchor="end"
                className={styles.tickAngled}
                transform={`rotate(-28 ${point.x + 2} ${height - 10})`}
              >
                {labels[index]}
              </text>
            ) : null}
          </g>
        )
      })}

      {points.map((point, index) => (
        <rect
          key={`hit-${index}`}
          x={point.x - slotW / 2}
          y={padTop}
          width={Math.max(slotW, 24)}
          height={plotH}
          className={styles.hitArea}
          onMouseEnter={() => setHoverIndex(index)}
        />
      ))}

      {hoverPoint ? (
        <line
          x1={hoverPoint.x}
          x2={hoverPoint.x}
          y1={padTop}
          y2={padTop + plotH}
          className={styles.hoverGuide}
        />
      ) : null}
    </svg>
    </ChartFrame>
  )
}

export type MultiSeriesLine = {
  key: string
  label: string
  values: number[]
  color: string
}

type MultiSeriesLineChartProps = {
  series: MultiSeriesLine[]
  labels?: string[]
  width?: number
  height?: number
}

/** Smooth multi-line chart (iOS / Android / Web style). */
export function MultiSeriesLineChart({
  series,
  labels,
  width = 720,
  height = 168,
}: MultiSeriesLineChartProps) {
  const reactId = useId().replace(/:/g, '')
  const pathRefs = useRef<Array<SVGPathElement | null>>([])
  const seriesSignature = series
    .map((item) => `${item.key}:${item.values.join(',')}`)
    .join('|')
  const { ref, revealed: animated } = useScrollReveal<SVGSVGElement>({
    resetKey: seriesSignature,
  })
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const padX = 28
  const padTop = 28
  const padBottom = labels?.length ? 30 : 14
  const plotW = width - padX * 2
  const plotH = height - padTop - padBottom
  const band = plotH * 0.7
  const bandTop = padTop + (plotH - band) / 2
  const pointCount = Math.max(...series.map((item) => item.values.length), 1)
  const allValues = series.flatMap((item) => item.values)
  const max = Math.max(...allValues, 1)
  const min = 0
  const range = Math.max(max - min, 1)

  const pillW = Math.min(26, Math.max(18, plotW / Math.max(pointCount * 2.8, 1)))
  const pillTop = bandTop - 12
  const pillH = band + 30

  // Highlight the global peak across the primary (highest total) series
  const primary = [...series].sort(
    (a, b) =>
      b.values.reduce((sum, value) => sum + value, 0) -
      a.values.reduce((sum, value) => sum + value, 0),
  )[0]
  const peakIndex = primary
    ? primary.values.indexOf(Math.max(...primary.values, 0))
    : -1

  function pointAt(values: number[], index: number) {
    const value = values[index] ?? 0
    const x =
      padX +
      (pointCount <= 1 ? plotW / 2 : (index / (pointCount - 1)) * plotW)
    const y = bandTop + band - ((value - min) / range) * band
    return { x, y, value }
  }

  const labelStep = Math.max(1, Math.ceil(pointCount / 7))
  const hoverX =
    hoverIndex != null ? pointAt(primary?.values ?? [], hoverIndex).x : 0
  const hoverLines =
    hoverIndex != null
      ? series.map((item) => {
          const count = item.values[hoverIndex] ?? 0
          return `${item.label}: ${count.toLocaleString()}`
        })
      : []

  // Draw stroke paths only after the chart is on-screen
  useLayoutEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const cleanups: Array<() => void> = []

    pathRefs.current.forEach((el, index) => {
      if (!el) return
      const length = el.getTotalLength()

      const clearDash = () => {
        el.style.transition = 'none'
        el.style.strokeDasharray = 'none'
        el.style.strokeDashoffset = '0'
      }

      if (reduceMotion || length <= 0) {
        clearDash()
        return
      }

      if (!animated) {
        el.style.transition = 'none'
        el.style.strokeDasharray = `${length}`
        el.style.strokeDashoffset = `${length}`
        return
      }

      el.style.transition = 'none'
      el.style.strokeDasharray = `${length}`
      el.style.strokeDashoffset = `${length}`
      void el.getBoundingClientRect()
      el.style.transition = `stroke-dashoffset 1s ${0.08 + index * 0.14}s var(--ease-out)`
      el.style.strokeDashoffset = '0'

      const onEnd = (event: TransitionEvent) => {
        if (event.propertyName !== 'stroke-dashoffset') return
        clearDash()
        el.removeEventListener('transitionend', onEnd)
      }
      el.addEventListener('transitionend', onEnd)
      const fallback = window.setTimeout(clearDash, 1300 + index * 140)
      cleanups.push(() => {
        el.removeEventListener('transitionend', onEnd)
        window.clearTimeout(fallback)
      })
    })

    return () => {
      cleanups.forEach((fn) => fn())
    }
  }, [animated, seriesSignature])

  return (
    <ChartFrame
      onLeave={() => setHoverIndex(null)}
      tooltip={
        hoverIndex != null ? (
          <ChartTooltip
            xPct={(hoverX / width) * 100}
            yPct={28}
            title={labels?.[hoverIndex] || `Day ${hoverIndex + 1}`}
            lines={hoverLines}
          />
        ) : null
      }
    >
    <svg
      ref={ref}
      className={`${styles.svg} ${styles.svgSoft} ${styles.multiChart} ${
        animated ? styles.multiChartAnimated : ''
      }`}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-hidden
    >
      <defs>
        <filter
          id={`multiPillShadow-${reactId}`}
          x="-40%"
          y="-20%"
          width="180%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="3.5"
            floodColor="#148106"
            floodOpacity="0.18"
          />
        </filter>
      </defs>

      {peakIndex >= 0 && primary ? (
        (() => {
          const point = pointAt(primary.values, peakIndex)
          const letter = (labels?.[peakIndex] || primary.label || 'W')
            .charAt(0)
            .toUpperCase()
          const badgeR = pillW * 0.32
          const badgeCy = pillTop + pillH - badgeR - 6
          return (
            <g className={styles.multiPill}>
              <rect
                x={point.x - pillW / 2}
                y={pillTop}
                width={pillW}
                height={pillH}
                rx={pillW / 2}
                className={styles.pillActive}
                filter={`url(#multiPillShadow-${reactId})`}
              />
              <circle
                cx={point.x}
                cy={badgeCy}
                r={badgeR}
                className={styles.pillBadge}
              />
              <text
                x={point.x}
                y={badgeCy + 3}
                textAnchor="middle"
                className={styles.pillBadgeText}
              >
                {letter}
              </text>
            </g>
          )
        })()
      ) : null}

      {series.map((item, seriesIndex) => {
        const points = Array.from({ length: pointCount }, (_, index) =>
          pointAt(item.values, index),
        )
        const path = smoothLinePath(points, 0.35)
        return (
          <g key={item.key}>
            {path ? (
              <path
                ref={(node) => {
                  pathRefs.current[seriesIndex] = node
                }}
                d={path}
                fill="none"
                stroke={item.color}
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.multiLine}
              />
            ) : null}
            {points.map((point, index) => {
              const highlighted = index === peakIndex && item.key === primary?.key
              return (
                <g
                  key={`${item.key}-${index}`}
                  className={styles.multiDot}
                  style={
                    {
                      '--dot-delay': `${0.35 + seriesIndex * 0.1 + index * 0.032}s`,
                    } as CSSProperties
                  }
                >
                  {highlighted ? (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={8}
                      fill={`${item.color}33`}
                      stroke={item.color}
                      strokeWidth={1.2}
                      className={styles.multiDotGlow}
                    />
                  ) : null}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={highlighted ? 4.2 : 3.2}
                    fill="#fff"
                    stroke={item.color}
                    strokeWidth={1.45}
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={highlighted ? 1.8 : 1.25}
                    fill={item.color}
                  />
                </g>
              )
            })}
          </g>
        )
      })}

      {labels?.map((label, index) => {
        if (index % labelStep !== 0 && index !== labels.length - 1) return null
        const point = pointAt(primary?.values ?? [], index)
        return (
          <text
            key={`label-${index}`}
            x={point.x + 2}
            y={height - 8}
            textAnchor="end"
            className={`${styles.tickAngled} ${styles.multiLabel}`}
            style={
              {
                '--label-delay': `${0.5 + index * 0.03}s`,
              } as CSSProperties
            }
            transform={`rotate(-24 ${point.x + 2} ${height - 8})`}
          >
            {label}
          </text>
        )
      })}

      {Array.from({ length: pointCount }, (_, index) => {
        const point = pointAt(primary?.values ?? [], index)
        const slotW = pointCount <= 1 ? plotW : plotW / (pointCount - 1)
        return (
          <rect
            key={`hit-${index}`}
            x={point.x - slotW / 2}
            y={padTop}
            width={Math.max(slotW, 18)}
            height={plotH}
            className={styles.hitArea}
            onMouseEnter={() => setHoverIndex(index)}
          />
        )
      })}

      {hoverIndex != null ? (
        <line
          x1={hoverX}
          x2={hoverX}
          y1={padTop}
          y2={padTop + plotH}
          className={styles.hoverGuide}
        />
      ) : null}
    </svg>
    </ChartFrame>
  )
}

type ProgressBarProps = {
  value: number
  max?: number
  tone?: 'green' | 'deep' | 'muted'
}

export function ProgressBar({
  value,
  max = 100,
  tone = 'green',
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(max, 1)) * 100))
  const { ref, revealed } = useScrollReveal<HTMLDivElement>({
    resetKey: `${value}:${max}`,
    threshold: 0.2,
  })
  return (
    <div
      ref={ref}
      className={`${styles.progressTrack} ${styles.chartReveal} ${
        revealed ? styles.chartRevealed : ''
      }`}
      aria-hidden
    >
      <i
        className={`${styles.progressFill} ${styles[`tone_${tone}`]} ${styles.progressFillAnim}`}
        style={{ width: revealed ? `${pct}%` : '0%' }}
      />
    </div>
  )
}

type HeatstripProps = {
  values: number[]
}

export function Heatstrip({ values }: HeatstripProps) {
  const max = Math.max(...values, 1)
  return (
    <div className={styles.heatstrip} aria-hidden>
      {values.map((value, index) => {
        const intensity = value / max
        return (
          <i
            key={index}
            style={{
              background:
                intensity < 0.2
                  ? '#e5e7eb'
                  : intensity < 0.45
                    ? 'rgb(20 129 6 / 25%)'
                    : intensity < 0.7
                      ? 'rgb(20 129 6 / 55%)'
                      : '#148106',
            }}
          />
        )
      })}
    </div>
  )
}

type RadarChartProps = {
  axes: Array<{ label: string; value: number }>
}

export function RadarChart({ axes }: RadarChartProps) {
  const size = 220
  const cx = size / 2
  const cy = size / 2
  const rings = [0.35, 0.55, 0.75, 1]
  const radius = 78
  const max = Math.max(...axes.map((a) => a.value), 1)
  const count = Math.max(axes.length, 3)

  const pointAt = (index: number, scale: number) => {
    const angle = -Math.PI / 2 + (index / count) * Math.PI * 2
    return {
      x: cx + Math.cos(angle) * radius * scale,
      y: cy + Math.sin(angle) * radius * scale,
    }
  }

  const poly = axes
    .map((axis, index) => {
      const p = pointAt(index, axis.value / max)
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg
      className={styles.svg}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-hidden
    >
      {rings.map((ring) => (
        <circle
          key={ring}
          cx={cx}
          cy={cy}
          r={radius * ring}
          className={styles.radarRing}
        />
      ))}
      <polygon points={poly} className={styles.radarFill} />
      <polygon points={poly} className={styles.radarStroke} fill="none" />
      <circle cx={cx} cy={cy} r={3} className={styles.radarCenter} />
      {axes.map((axis, index) => {
        const p = pointAt(index, 1.18)
        return (
          <text
            key={axis.label}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            className={styles.radarLabel}
          >
            {axis.label}
          </text>
        )
      })}
    </svg>
  )
}
