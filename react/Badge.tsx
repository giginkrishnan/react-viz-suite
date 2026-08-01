import { cn } from './cn.js'
import styles from './Badge.module.css'

type BadgeTone = 'upcoming' | 'confirmed' | 'completed' | 'neutral'

type BadgeProps = {
  children: string
  tone?: BadgeTone
  className?: string
}

export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return <span className={cn(styles.badge, styles[tone], className)}>{children}</span>
}
