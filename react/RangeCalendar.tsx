import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import styles from './RangeCalendar.module.css'

export type DateRange = {
  start: Date | null
  end: Date | null
}

type RangeCalendarProps = {
  value: DateRange
  onChange: (range: DateRange) => void
  bookingDates?: string[]
  /** Compact calendar chrome for side panels */
  embedded?: boolean
}

function startOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function inRange(day: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false
  const t = day.getTime()
  return t >= startOfDay(start).getTime() && t <= startOfDay(end).getTime()
}

function monthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month, 1))
}

function formatRangeDay(date: Date | null) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export function RangeCalendar({
  value,
  onChange,
  bookingDates = [],
  embedded = false,
}: RangeCalendarProps) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const [view, setView] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }))

  const marked = useMemo(() => {
    const set = new Set<string>()
    for (const raw of bookingDates) {
      const date = new Date(raw)
      if (Number.isNaN(date.getTime())) continue
      set.add(dayKey(startOfDay(date)))
    }
    return set
  }, [bookingDates])

  const days = useMemo(() => {
    const first = new Date(view.year, view.month, 1)
    const startWeekday = (first.getDay() + 6) % 7 // Monday-first
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
    const cells: Array<{
      date: Date
      inMonth: boolean
    }> = []

    for (let i = 0; i < startWeekday; i += 1) {
      const date = new Date(view.year, view.month, -startWeekday + i + 1)
      cells.push({ date: startOfDay(date), inMonth: false })
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({
        date: startOfDay(new Date(view.year, view.month, day)),
        inMonth: true,
      })
    }

    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1].date
      const next = new Date(last)
      next.setDate(next.getDate() + 1)
      cells.push({ date: startOfDay(next), inMonth: false })
    }

    return cells
  }, [view])

  function selectDay(date: Date) {
    const day = startOfDay(date)
    const { start, end } = value

    if (!start || (start && end)) {
      onChange({ start: day, end: null })
      return
    }

    if (day.getTime() < start.getTime()) {
      onChange({ start: day, end: start })
      return
    }

    onChange({ start, end: day })
  }

  function shiftMonth(delta: number) {
    setView((current) => {
      const next = new Date(current.year, current.month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
  }

  const rangeComplete = Boolean(value.start && value.end)

  return (
    <aside
      className={[styles.panel, embedded ? styles.embedded : ''].filter(Boolean).join(' ')}
      aria-label="Date range calendar"
    >
      {!embedded ? (
        <>
          <div className={styles.header}>
            <p className={styles.eyebrow}>Date range</p>
            <h2 className={styles.title}>Filter by dates</h2>
            <p className={styles.hint}>
              Click a start day, then an end day. The booking list updates to match.
            </p>
          </div>

          <div className={styles.rangeSummary}>
            <div>
              <span className={styles.rangeLabel}>From</span>
              <strong>{formatRangeDay(value.start)}</strong>
            </div>
            <div>
              <span className={styles.rangeLabel}>To</span>
              <strong>{formatRangeDay(value.end)}</strong>
            </div>
          </div>
        </>
      ) : null}

      <div className={styles.calendar}>
        <div className={styles.monthBar}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
          >
            <ChevronLeft size={16} aria-hidden />
          </button>
          <p className={styles.monthLabel}>{monthLabel(view.year, view.month)}</p>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
          >
            <ChevronRight size={16} aria-hidden />
          </button>
        </div>

        <div className={styles.weekdays} aria-hidden>
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className={styles.grid} role="grid" aria-label={monthLabel(view.year, view.month)}>
          {days.map(({ date, inMonth }) => {
            const isStart = value.start ? sameDay(date, value.start) : false
            const isEnd = value.end ? sameDay(date, value.end) : false
            const isToday = sameDay(date, today)
            const isInRange = inRange(date, value.start, value.end)
            const hasBooking = marked.has(dayKey(date))
            const className = [
              styles.day,
              !inMonth ? styles.dayOutside : '',
              isToday ? styles.dayToday : '',
              isInRange ? styles.dayInRange : '',
              isStart || isEnd ? styles.daySelected : '',
              isStart ? styles.dayStart : '',
              isEnd ? styles.dayEnd : '',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <button
                key={date.toISOString()}
                type="button"
                className={className}
                onClick={() => selectDay(date)}
                aria-pressed={isStart || isEnd || isInRange}
                aria-label={date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              >
                <span>{date.getDate()}</span>
                {hasBooking ? <i className={styles.dot} aria-hidden /> : null}
              </button>
            )
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.status}>
          {!value.start
            ? 'Select a start date'
            : !value.end
              ? 'Select an end date'
              : rangeComplete
                ? 'Range selected'
                : ''}
        </p>
        <button
          type="button"
          className={styles.clear}
          disabled={!value.start && !value.end}
          onClick={() => onChange({ start: null, end: null })}
        >
          Clear
        </button>
      </div>
    </aside>
  )
}
