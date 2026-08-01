import {
  CapsuleBarChart,
  PillLineChart,
} from './charts'

type MiniTrendChartProps = {
  kind?: 'line' | 'bars'
  values: number[]
  labels?: string[]
  highlightIndexes?: number[]
  accentIndex?: number
  deltas?: string[]
  height?: number
  valueUnit?: string
  showTicks?: boolean
}

export function MiniTrendChart({
  kind = 'line',
  values,
  labels,
  highlightIndexes,
  accentIndex,
  deltas,
  height = 110,
  valueUnit = 'booking',
  showTicks = true,
}: MiniTrendChartProps) {
  const safeValues = values.length ? values : [0]
  if (kind === 'bars') {
    return (
      <CapsuleBarChart
        values={safeValues}
        labels={showTicks ? labels : undefined}
        accentIndex={accentIndex ?? safeValues.indexOf(Math.max(...safeValues))}
        tone="amber"
        height={height}
        showValues={false}
        valueUnit={valueUnit}
      />
    )
  }

  const peakIndexes = safeValues
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
    .map((item) => item.index)

  const computedDeltas =
    deltas ??
    safeValues.map((value, index) => {
      if (index === 0) return ''
      const prev = safeValues[index - 1] || 0
      if (prev <= 0) return value > 0 ? '+100%' : ''
      const pct = ((value - prev) / prev) * 100
      const rounded =
        Math.abs(pct) >= 10 ? Math.round(pct) : Number(pct.toFixed(1))
      return `${pct >= 0 ? '+' : ''}${rounded}%`
    })

  return (
    <PillLineChart
      values={safeValues}
      labels={labels}
      highlightIndexes={
        highlightIndexes?.length ? highlightIndexes : peakIndexes
      }
      deltas={computedDeltas}
      width={720}
      height={Math.max(height, 168)}
      valueUnit={valueUnit}
      showTicks={showTicks}
    />
  )
}
