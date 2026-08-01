import type { RefObject } from 'react'

export type UseScrollRevealOptions = {
  /** Fraction of the element that must be visible (0–1) */
  threshold?: number
  /** Replay when scrolling away and back into view */
  replay?: boolean
  /** Dependency that resets the observer (e.g. data signature) */
  resetKey?: string | number
}

export declare function useScrollReveal<T extends Element = SVGSVGElement>(
  options?: UseScrollRevealOptions,
): {
  ref: RefObject<T | null>
  revealed: boolean
}
