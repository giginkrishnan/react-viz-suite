import { createElement } from 'react'
import styles from './LoadingState.module.css'

/**
 * @typedef {object} LoadingStateProps
 * @property {string} [label]
 * @property {'inline' | 'block'} [variant]
 * @property {string} [className]
 */

/**
 * Shared Triphype loading indicator (orbit dots + shimmer bar).
 * Requires `react-viz-suite/tokens.css` for brand CSS variables.
 *
 * @param {LoadingStateProps} props
 */
export function LoadingState({
  label = 'Loading…',
  variant = 'inline',
  className,
}) {
  const rootClass = [
    styles.root,
    variant === 'block' ? styles.block : null,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return createElement(
    'div',
    {
      className: rootClass,
      role: 'status',
      'aria-live': 'polite',
      'aria-busy': 'true',
    },
    createElement(
      'div',
      { className: styles.orbit, 'aria-hidden': true },
      createElement('i', { className: styles.dot }),
      createElement('i', { className: `${styles.dot} ${styles.dotAmber}` }),
      createElement('i', { className: `${styles.dot} ${styles.dotTeal}` }),
    ),
    createElement(
      'div',
      { className: styles.copy },
      createElement('p', { className: styles.label }, label),
      createElement('span', { className: styles.bar, 'aria-hidden': true }),
    ),
  )
}
