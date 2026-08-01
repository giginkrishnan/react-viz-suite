import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentType,
  HTMLAttributes,
  ReactNode,
} from 'react'
import { createContext, useContext } from 'react'
import { cn } from './cn.js'
import styles from './SoftList.module.css'

export type SoftListLinkProps = {
  to: string
  className?: string
  children?: ReactNode
} & Record<string, unknown>

export type SoftListLinkComponent = ComponentType<SoftListLinkProps>

const SoftListLinkContext = createContext<SoftListLinkComponent | null>(null)

function DefaultSoftListLink({
  to,
  className,
  children,
  ...rest
}: SoftListLinkProps) {
  return (
    <a href={to} className={className} {...rest}>
      {children}
    </a>
  )
}

/** Inject a router Link (e.g. react-router) for SoftListItem `to` rows. */
export function SoftListLinkProvider({
  component,
  children,
}: {
  component: SoftListLinkComponent
  children: ReactNode
}) {
  return (
    <SoftListLinkContext.Provider value={component}>
      {children}
    </SoftListLinkContext.Provider>
  )
}

export function SoftList({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <ul className={cn(styles.list, className)}>{children}</ul>
}

type SoftListItemShared = {
  children: ReactNode
  className?: string
  selected?: boolean
  muted?: boolean
}

type SoftListItemProps =
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

function rowClassName({
  className,
  selected,
  muted,
  interactive,
}: {
  className?: string
  selected?: boolean
  muted?: boolean
  interactive: boolean
}) {
  return cn(
    styles.row,
    interactive && styles.rowInteractive,
    selected && styles.rowSelected,
    muted && styles.rowMuted,
    className,
  )
}

export function SoftListItem(props: SoftListItemProps) {
  const { children, className, selected, muted } = props
  const LinkComponent = useContext(SoftListLinkContext) ?? DefaultSoftListLink

  if (props.as === 'button') {
    const {
      as: _as,
      children: _children,
      className: _className,
      selected: _selected,
      muted: _muted,
      type = 'button',
      ...rest
    } = props
    return (
      <button
        type={type}
        className={rowClassName({
          className,
          selected,
          muted,
          interactive: true,
        })}
        {...rest}
      >
        {children}
      </button>
    )
  }

  if (props.as === 'a' || ('href' in props && typeof props.href === 'string')) {
    const {
      children: _children,
      className: _className,
      selected: _selected,
      muted: _muted,
      href,
      ...rest
    } = props as SoftListItemShared &
      AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
    const { as: _as, ...anchorRest } = rest as typeof rest & { as?: string }
    return (
      <a
        className={rowClassName({
          className,
          selected,
          muted,
          interactive: true,
        })}
        href={href}
        {...anchorRest}
      >
        {children}
      </a>
    )
  }

  if (props.as === 'link' || ('to' in props && typeof props.to === 'string')) {
    const {
      children: _children,
      className: _className,
      selected: _selected,
      muted: _muted,
      to,
      ...rest
    } = props as SoftListItemShared &
      Omit<HTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string }
    const { as: _as, ...linkRest } = rest as typeof rest & { as?: string }
    return (
      <LinkComponent
        to={to}
        className={rowClassName({
          className,
          selected,
          muted,
          interactive: true,
        })}
        {...linkRest}
      >
        {children}
      </LinkComponent>
    )
  }

  const {
    children: _children,
    className: _className,
    selected: _selected,
    muted: _muted,
    ...rest
  } = props as SoftListItemShared & HTMLAttributes<HTMLDivElement>
  const { as: _as, ...divRest } = rest as typeof rest & { as?: string }
  const interactive = Boolean(divRest.onClick)

  return (
    <div
      className={rowClassName({
        className,
        selected,
        muted,
        interactive,
      })}
      {...divRest}
    >
      {children}
    </div>
  )
}

export function SoftListInner({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn(styles.rowInner, className)}>{children}</div>
}

export function SoftListHead({
  media,
  children,
  className,
}: {
  media?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn(styles.productHead, className)}>
      {media}
      <div className={styles.copy}>{children}</div>
    </div>
  )
}

export function SoftListCover({
  src,
  alt = '',
  className,
}: {
  src: string
  alt?: string
  className?: string
}) {
  return <img className={cn(styles.cover, className)} src={src} alt={alt} />
}

export function SoftListMedia({
  children,
  className,
  tone = 'green',
}: {
  children: ReactNode
  className?: string
  tone?: 'green' | 'amber' | 'muted'
}) {
  return (
    <div
      className={cn(
        styles.media,
        tone === 'amber' && styles.mediaAmber,
        tone === 'muted' && styles.mediaMuted,
        className,
      )}
    >
      {children}
    </div>
  )
}

export function SoftListMeta({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn(styles.rowStats, className)}>{children}</div>
}

export function SoftListCell({
  label,
  value,
  hint,
  action,
  compact,
  className,
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  action?: ReactNode
  compact?: boolean
  className?: string
}) {
  return (
    <div className={cn(styles.cell, className)}>
      <p className={styles.cellLabel}>{label}</p>
      <div className={cn(styles.cellValue, compact && styles.cellValueSm)}>
        {value}
      </div>
      {hint != null && hint !== '' ? (
        <p className={styles.cellHint}>{hint}</p>
      ) : null}
      {action ? <div className={styles.cellAction}>{action}</div> : null}
    </div>
  )
}

export function SoftListTitleRow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn(styles.titleRow, className)}>{children}</div>
}

export function SoftListTitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <h2 className={cn(styles.itemTitle, className)}>{children}</h2>
}

export const softListStyles = styles
