import type { ReactNode } from 'react'
import styles from './DataTable.module.css'

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

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  emptyMessage = 'No results.',
  onRowClick,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={rowKey(row, index)}
              className={onRowClick ? styles.clickableRow : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => (
                <td key={column.key} className={column.className}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export type MetaBarProps = {
  total?: number
  page?: number
  limit?: number
  totalPages?: number
  hasMore?: boolean
}

export function MetaBar({
  total,
  page,
  limit,
  totalPages,
  hasMore,
}: MetaBarProps) {
  const pages =
    typeof totalPages === 'number'
      ? totalPages
      : typeof total === 'number' && typeof limit === 'number' && limit > 0
        ? Math.max(1, Math.ceil(total / limit))
        : undefined

  return (
    <p className={styles.meta}>
      {typeof total === 'number' ? `${total} total` : '—'}
      {typeof page === 'number' && typeof pages === 'number'
        ? ` · page ${page} of ${pages}`
        : typeof page === 'number'
          ? ` · page ${page}`
          : ''}
      {typeof limit === 'number' ? ` · ${limit}/page` : ''}
      {hasMore && pages == null ? ' · more available' : ''}
    </p>
  )
}
