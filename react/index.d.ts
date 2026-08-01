import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentType,
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  RefObject,
} from 'react'

export declare function cn(
  ...parts: Array<string | false | null | undefined>
): string

export type UseScrollRevealOptions = {
  threshold?: number
  replay?: boolean
  resetKey?: string | number
}

export declare function useScrollReveal<T extends Element = SVGSVGElement>(
  options?: UseScrollRevealOptions,
): {
  ref: RefObject<T | null>
  revealed: boolean
}

export type LoadingStateProps = {
  label?: string
  variant?: 'inline' | 'block'
  className?: string
}

export declare function LoadingState(props: LoadingStateProps): ReactElement

export type SoftListLinkProps = {
  to: string
  className?: string
  children?: ReactNode
} & Record<string, unknown>

export type SoftListLinkComponent = ComponentType<SoftListLinkProps>

export declare function SoftListLinkProvider(props: {
  component: SoftListLinkComponent
  children: ReactNode
}): ReactElement

export declare function SoftList(props: {
  children: ReactNode
  className?: string
}): ReactElement

type SoftListItemShared = {
  children: ReactNode
  className?: string
  selected?: boolean
  muted?: boolean
}

export type SoftListItemProps =
  | (SoftListItemShared & {
      as?: 'div'
      to?: never
      href?: never
    } & HTMLAttributes<HTMLDivElement>)
  | (SoftListItemShared & {
      as: 'button'
      to?: never
      href?: never
    } & ButtonHTMLAttributes<HTMLButtonElement>)
  | (SoftListItemShared & {
      as?: 'link'
      to: string
      href?: never
    } & Omit<HTMLAttributes<HTMLAnchorElement>, 'href'>)
  | (SoftListItemShared & {
      as: 'a'
      href: string
      to?: never
    } & AnchorHTMLAttributes<HTMLAnchorElement>)

export declare function SoftListItem(props: SoftListItemProps): ReactElement
export declare function SoftListInner(props: {
  children: ReactNode
  className?: string
}): ReactElement
export declare function SoftListHead(props: {
  media?: ReactNode
  children: ReactNode
  className?: string
}): ReactElement
export declare function SoftListCover(props: {
  src: string
  alt?: string
  className?: string
}): ReactElement
export declare function SoftListMedia(props: {
  children: ReactNode
  className?: string
  tone?: 'green' | 'amber' | 'muted'
}): ReactElement
export declare function SoftListMeta(props: {
  children: ReactNode
  className?: string
}): ReactElement
export declare function SoftListCell(props: {
  label: string
  value: ReactNode
  hint?: ReactNode
  action?: ReactNode
  compact?: boolean
  className?: string
}): ReactElement
export declare function SoftListTitleRow(props: {
  children: ReactNode
  className?: string
}): ReactElement
export declare function SoftListTitle(props: {
  children: ReactNode
  className?: string
}): ReactElement

export declare const softListStyles: Record<string, string>

export declare function Badge(props: {
  children: string
  tone?: 'upcoming' | 'confirmed' | 'completed' | 'neutral'
  className?: string
}): ReactElement

export declare function Button(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    leadingIcon?: ReactNode
    trailingIcon?: ReactNode
  },
): ReactElement

export declare function ToastProvider(props: {
  children: ReactNode
}): ReactElement
export declare function useToast(): {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

export declare function shortenId(id?: string | null, max?: number): string
export declare function CopyableId(props: {
  value?: string | null
  label?: string
  className?: string
  full?: boolean
  size?: 'sm' | 'md'
}): ReactElement

export type DateRange = {
  start: Date | null
  end: Date | null
}

export declare function RangeCalendar(props: {
  value: DateRange
  onChange: (range: DateRange) => void
  bookingDates?: string[]
  embedded?: boolean
}): ReactElement

export declare function Sparkline(props: {
  points: number[]
  className?: string
}): ReactElement

export type InsightTone = 'green' | 'amber' | 'muted'
export type InsightCardProps = {
  title: string
  description?: string
  value: string
  count?: string | number
  progress?: number
  trend?: 'up' | 'down' | 'flat'
  tone?: InsightTone
  revealDelayMs?: number
}

export declare function InsightCard(props: InsightCardProps): ReactElement
export declare function InsightStrip(props: {
  cards: InsightCardProps[]
  chart?: ReactNode
  chartTitle?: string
  chartSubtitle?: string
  layout?: 'horizontal' | 'vertical'
}): ReactElement
export declare function InsightBoard(props: {
  children: ReactNode
  className?: string
  'aria-label'?: string
}): ReactElement
export declare function InsightMetricRow(props: {
  value?: ReactNode
  label?: ReactNode
  title?: ReactNode
  description?: ReactNode
  hint?: ReactNode
  action?: ReactNode
  chartEyebrow?: ReactNode
  chartCallout?: ReactNode
  children: ReactNode
  className?: string
}): ReactElement

export type DataTableColumn<T> = {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

export type DataTableProps<T> = {
  rows: T[]
  columns: Array<DataTableColumn<T>>
  rowKey: (row: T, index: number) => string
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

export declare function DataTable<T>(props: DataTableProps<T>): ReactElement

export type MetaBarProps = {
  total?: number
  page?: number
  limit?: number
  totalPages?: number
  hasMore?: boolean
}

export declare function MetaBar(props: MetaBarProps): ReactElement

export type MultiSeriesLine = {
  id: string
  label: string
  values: number[]
  color?: string
}

export declare function CapsuleBarChart(props: Record<string, unknown>): ReactElement
export declare function PillLineChart(props: Record<string, unknown>): ReactElement
export declare function MultiSeriesLineChart(props: Record<string, unknown>): ReactElement
export declare function PerformanceTimeline(props: Record<string, unknown>): ReactElement
export declare function ProgressBar(props: {
  value: number
  max?: number
  tone?: 'green' | 'deep' | 'muted' | 'danger'
  variant?: 'soft' | 'solid'
  size?: 'sm' | 'md'
  className?: string
}): ReactElement
export declare function Heatstrip(props: { values: number[] }): ReactElement
export declare function RadarChart(props: {
  axes: Array<{ label: string; value: number }>
}): ReactElement
export declare function MiniStackedBars(props: Record<string, unknown>): ReactElement
export declare function MiniAreaChart(props: Record<string, unknown>): ReactElement
export declare function MiniDonut(props: Record<string, unknown>): ReactElement
export declare function MiniTrendChart(props: {
  kind?: 'line' | 'bars'
  values: number[]
  labels?: string[]
  highlightIndexes?: number[]
  accentIndex?: number
  deltas?: string[]
  height?: number
  valueUnit?: string
  showTicks?: boolean
}): ReactElement

export declare function Logo(props: {
  className?: string
  size?: number
}): ReactElement
export declare function MountainScene(props: {
  className?: string
}): ReactElement
export declare function FlightBookingIcon(props: {
  className?: string
  size?: number
}): ReactElement
export declare function HotelBookingIcon(props: {
  className?: string
  size?: number
}): ReactElement
