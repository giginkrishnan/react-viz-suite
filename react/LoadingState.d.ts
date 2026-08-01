import type { ReactElement } from 'react'

export type LoadingStateProps = {
  label?: string
  /** Compact row for list pages; block is centered with more air. */
  variant?: 'inline' | 'block'
  className?: string
}

export declare function LoadingState(props: LoadingStateProps): ReactElement
