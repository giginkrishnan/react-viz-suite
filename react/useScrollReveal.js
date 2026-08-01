import { useEffect, useRef, useState } from 'react'

/**
 * @typedef {object} UseScrollRevealOptions
 * @property {number} [threshold] Fraction of the element that must be visible (0–1)
 * @property {boolean} [replay] Replay when scrolling away and back into view
 * @property {string | number} [resetKey] Dependency that resets the observer
 */

/**
 * Adds scroll-into-view reveal state for chart animations.
 * Returns a ref to attach to the observed node and `revealed` while on-screen.
 *
 * @template {Element} [T=SVGSVGElement]
 * @param {UseScrollRevealOptions} [options]
 */
export function useScrollReveal({
  threshold = 0.28,
  replay = true,
  resetKey,
} = {}) {
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduceMotion) {
      setRevealed(true)
      return
    }

    let visible = false
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        const nowVisible =
          entry.isIntersecting && entry.intersectionRatio >= threshold

        if (nowVisible && !visible) {
          visible = true
          setRevealed(false)
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setRevealed(true))
          })
        } else if (!nowVisible && visible) {
          visible = false
          if (replay) setRevealed(false)
        }
      },
      {
        threshold: [0, threshold, Math.min(1, threshold + 0.2), 0.7],
        rootMargin: '0px 0px -8% 0px',
      },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, replay, resetKey])

  return { ref, revealed }
}
