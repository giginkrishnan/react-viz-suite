import { cn } from '../cn.js'
import styles from './Logo.module.css'

type LogoProps = {
  className?: string
  size?: number
}

export function Logo({ className, size = 36 }: LogoProps) {
  return (
    <img
      className={cn(styles.logo, className)}
      src="/triphype_logo.png"
      alt="Triphype"
      width={size}
      height={size}
      decoding="async"
    />
  )
}
