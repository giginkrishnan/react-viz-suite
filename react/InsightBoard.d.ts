import type { ReactElement, ReactNode } from 'react'

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
