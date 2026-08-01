import { cn } from '../cn.js'
import styles from './MountainScene.module.css'

type MountainSceneProps = {
  className?: string
}

export function MountainScene({ className }: MountainSceneProps) {
  return (
    <svg
      className={cn(styles.scene, className)}
      width="140"
      height="88"
      viewBox="0 0 140 88"
      fill="none"
      aria-hidden
    >
      <circle cx="104" cy="22" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 72 L42 34 L58 52 L78 28 L128 72"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M28 72 L48 48 L62 62 L76 46 L108 72"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M18 72 C18 64 24 58 30 58 C30 52 36 48 42 52 C46 48 52 50 52 56 C58 56 62 62 62 68"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <line x1="8" y1="72" x2="132" y2="72" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
