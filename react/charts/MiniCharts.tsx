import styles from './MiniCharts.module.css'

type Point = { label: string; value: number }
type SeriesPoint = { label: string; a: number; b: number }

type HoverProps = {
  onHover?: (index: number | null) => void
  activeIndex?: number | null
}

const W = 400
const H = 150
const PAD_X = 10
const PAD_TOP = 10
const PAD_BOTTOM = 26

/** Stacked weekly bars: a (flights) + b (hotels). */
export function MiniStackedBars({
  data,
  onHover,
  activeIndex = null,
}: HoverProps & { data: SeriesPoint[] }) {
  const max = Math.max(...data.map((d) => d.a + d.b), 1)
  const plotW = W - PAD_X * 2
  const plotH = H - PAD_TOP - PAD_BOTTOM

  return (
    <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-hidden>
      {data.map((d, i) => {
        const slot = plotW / Math.max(data.length, 1)
        const barW = Math.min(22, slot * 0.5)
        const x = PAD_X + i * slot + (slot - barW) / 2
        const aH = (d.a / max) * plotH
        const bH = (d.b / max) * plotH
        const base = PAD_TOP + plotH
        const active = activeIndex === i
        return (
          <g
            key={`${d.label}-${i}`}
            opacity={activeIndex == null || active ? 1 : 0.35}
            onMouseEnter={() => onHover?.(i)}
            onMouseLeave={() => onHover?.(null)}
          >
            <rect
              x={x}
              y={base - aH - bH}
              width={barW}
              height={Math.max(bH, 0)}
              rx={3}
              className={styles.barSoft}
            />
            <rect
              x={x}
              y={base - aH}
              width={barW}
              height={Math.max(aH, 0)}
              rx={3}
              className={active ? styles.barActive : styles.bar}
            />
            {d.a + d.b === 0 ? (
              <rect x={x} y={base - 2} width={barW} height={2} rx={1} className={styles.barSoft} />
            ) : null}
            <rect x={x - 4} y={PAD_TOP} width={barW + 8} height={plotH} fill="transparent" />
            <text x={x + barW / 2} y={H - 7} textAnchor="middle" className={styles.tick}>
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/** Area + line for revenue (or any series). */
export function MiniAreaChart({
  data,
  onHover,
  activeIndex = null,
}: HoverProps & { data: Point[] }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const plotW = W - PAD_X * 2
  const plotH = H - PAD_TOP - PAD_BOTTOM
  const baseY = PAD_TOP + plotH

  const points = data.map((d, i) => {
    const x =
      PAD_X + (data.length <= 1 ? plotW / 2 : (i / (data.length - 1)) * plotW)
    const y = PAD_TOP + plotH - (d.value / max) * plotH
    return { x, y, d }
  })

  const line = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ')
  const area =
    points.length > 0
      ? `${line} L${points[points.length - 1].x.toFixed(1)} ${baseY} L${points[0].x.toFixed(1)} ${baseY} Z`
      : ''

  return (
    <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-hidden>
      <defs>
        <linearGradient id="mini-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <line x1={PAD_X} x2={W - PAD_X} y1={baseY} y2={baseY} className={styles.axis} />
      {area ? <path d={area} fill="url(#mini-area)" /> : null}
      {line ? (
        <path
          d={line}
          fill="none"
          className={styles.line}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
      {points.map(({ x, y, d }, i) => (
        <g
          key={`${d.label}-${i}`}
          onMouseEnter={() => onHover?.(i)}
          onMouseLeave={() => onHover?.(null)}
        >
          <circle
            cx={x}
            cy={y}
            r={activeIndex === i ? 4 : 3}
            className={activeIndex === i ? styles.dotActive : styles.dot}
          />
          <circle cx={x} cy={y} r={12} fill="transparent" />
          <text x={x} y={H - 7} textAnchor="middle" className={styles.tick}>
            {d.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

/** Simple donut for two parts (e.g. flights vs hotels). */
export function MiniDonut({
  a,
  b,
  aLabel = 'Flights',
  bLabel = 'Hotels',
}: {
  a: number
  b: number
  aLabel?: string
  bLabel?: string
}) {
  const total = Math.max(a + b, 1)
  const size = 120
  const cx = size / 2
  const cy = size / 2
  const r = 38
  const stroke = 12
  const c = 2 * Math.PI * r
  const aLen = (a / total) * c
  const bLen = (b / total) * c

  return (
    <div className={styles.donutWrap}>
      <svg className={styles.donutSvg} viewBox={`0 0 ${size} ${size}`} role="img" aria-hidden>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--color-line-soft)"
          strokeWidth={stroke}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          className={styles.donutA}
          strokeWidth={stroke}
          strokeDasharray={`${aLen} ${c - aLen}`}
          strokeDashoffset={c * 0.25}
          strokeLinecap="butt"
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          className={styles.donutB}
          strokeWidth={stroke}
          strokeDasharray={`${bLen} ${c - bLen}`}
          strokeDashoffset={c * 0.25 - aLen}
          strokeLinecap="butt"
        />
        <text x={cx} y={cy - 2} textAnchor="middle" className={styles.donutValue}>
          {a + b}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" className={styles.donutSub}>
          total
        </text>
      </svg>
      <ul className={styles.donutLegend}>
        <li>
          <i className={styles.swatchA} /> {aLabel} · {a}
        </li>
        <li>
          <i className={styles.swatchB} /> {bLabel} · {b}
        </li>
      </ul>
    </div>
  )
}
