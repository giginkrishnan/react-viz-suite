# react-viz-suite — Component documentation

Package: `react-viz-suite@0.3.0`  
Requires `react-viz-suite/tokens.css` loaded once in the app shell.

```js
import 'react-viz-suite/tokens.css'
```

Peers: `react` ≥18, `react-dom` ≥18, `lucide-react` ≥0.400 (Toast, CopyableId, RangeCalendar).

Consumers must transpile the package (Vite / Next `transpilePackages`) because React sources ship as TSX/JSX + CSS modules.

---

## Contents

1. [Lists — SoftList](#1-lists--softlist)
2. [Actions & status](#2-actions--status)
3. [Feedback](#3-feedback)
4. [Data display](#4-data-display)
5. [Charts](#5-charts)
6. [Icons & illustration](#6-icons--illustration)
7. [Utilities](#7-utilities)
8. [Tokens](#8-tokens)
9. [Import map](#9-import-map)

---

## 1. Lists — SoftList

**Import:** `react-viz-suite/react/SoftList`

Router-free soft list / product-row pattern. Alternating metric columns use `#f7f8f9` striping via CSS modules.

| Export | Role |
|--------|------|
| `SoftList` | `<ul>` root |
| `SoftListItem` | Row — `as`: `div` (default), `button`, `a`, or `to` link |
| `SoftListInner` | Inner grid for head + stats |
| `SoftListHead` | Media + copy column |
| `SoftListCover` | Cover `<img>` |
| `SoftListMedia` | Icon tile — `tone`: `green` \| `amber` \| `muted` |
| `SoftListMeta` | Stats cells container |
| `SoftListCell` | `label`, `value`, optional `hint` / `action`, `compact` |
| `SoftListTitleRow` / `SoftListTitle` | Title line |
| `SoftListLinkProvider` | Provide SPA `Link` for `to=` rows |
| `softListStyles` | CSS module map (avatars, status pills, etc.) |

### SoftListItem

| Prop | Notes |
|------|--------|
| `as` | `'div'` \| `'button'` \| `'a'` \| `'link'` |
| `to` | SPA path when using link mode |
| `href` | Native anchor |
| `selected` / `muted` | Visual states |
| `className` | Extra class |

### Router wiring

```jsx
import {
  SoftList,
  SoftListItem,
  SoftListLinkProvider,
} from 'react-viz-suite/react/SoftList'
import { Link } from 'react-router-dom'

<SoftListLinkProvider component={Link}>
  <SoftList>
    <SoftListItem to="/trips/abc">Open trip</SoftListItem>
  </SoftList>
</SoftListLinkProvider>
```

Without a provider, `to` renders as `<a href={to}>`.

### Example row

```jsx
<SoftListItem to={`/trips/${id}`}>
  <SoftListInner>
    <SoftListHead
      media={<SoftListMedia tone="green"><Plane /></SoftListMedia>}
    >
      <SoftListTitleRow>
        <SoftListTitle>COK → DXB</SoftListTitle>
      </SoftListTitleRow>
    </SoftListHead>
    <SoftListMeta>
      <SoftListCell label="Dates" value="Aug 10–12" hint="3 nights" />
      <SoftListCell label="Spend" value="$1,240" />
    </SoftListMeta>
  </SoftListInner>
</SoftListItem>
```

---

## 2. Actions & status

### Button

**Import:** `react-viz-suite/react/Button`

| Prop | Values | Default |
|------|--------|---------|
| `variant` | `primary` \| `secondary` \| `ghost` \| `outline` | `primary` |
| `size` | `sm` \| `md` \| `lg` | `md` |
| `fullWidth` | boolean | `false` |
| `leadingIcon` / `trailingIcon` | `ReactNode` | — |

Extends native `<button>` attributes.

### Badge

**Import:** `react-viz-suite/react/Badge`

| Prop | Values | Default |
|------|--------|---------|
| `children` | `string` | required |
| `tone` | `upcoming` \| `confirmed` \| `completed` \| `neutral` | `neutral` |

Tones map to status CSS variables in `tokens.css`.

---

## 3. Feedback

### LoadingState

**Import:** `react-viz-suite/react/LoadingState`

| Prop | Type | Default |
|------|------|---------|
| `label` | `string` | `'Loading…'` |
| `variant` | `'inline'` \| `'block'` | `'inline'` |
| `className` | `string` | — |

Orbit dots + shimmer bar. Use `block` for centered full-width loading.

### Toast

**Import:** `react-viz-suite/react/Toast`

Wrap the app once:

```jsx
import { ToastProvider, useToast } from 'react-viz-suite/react/Toast'

<ToastProvider>
  <App />
</ToastProvider>

const toast = useToast()
toast.success('Saved')
toast.error('Failed')
toast.info('FYI')
```

Requires `lucide-react`.

### CopyableId

**Import:** `react-viz-suite/react/CopyableId`

| Prop | Notes |
|------|--------|
| `value` | ID string |
| `label` | Optional prefix |
| `full` | Show full value |
| `size` | `sm` \| `md` |

Also exports `shortenId(id, max?)`.

---

## 4. Data display

### InsightCard / InsightStrip

**Import:** `react-viz-suite/react/InsightCard`, `…/InsightStrip`

**InsightCard**

| Prop | Notes |
|------|--------|
| `title` | Card title |
| `value` | Display value (supports count-up parse) |
| `description` | Optional body |
| `count` | Secondary count |
| `progress` | 0–1 progress bar |
| `trend` | `up` \| `down` \| `flat` |
| `tone` | `green` \| `amber` \| `muted` |
| `revealDelayMs` | Stagger for strips |

**InsightStrip** — `cards: InsightCardProps[]`, optional `chart`, `chartTitle`, `layout`: `horizontal` \| `vertical`.

### DataTable / MetaBar

**Import:** `react-viz-suite/react/DataTable`

```tsx
<DataTable
  rows={rows}
  rowKey={(row) => row.id}
  emptyMessage="No results."
  onRowClick={(row) => navigate(row.id)}
  columns={[
    { key: 'name', header: 'Name', render: (r) => r.name },
    { key: 'status', header: 'Status', render: (r) => r.status },
  ]}
/>

<MetaBar total={120} page={1} limit={20} />
```

### RangeCalendar

**Import:** `react-viz-suite/react/RangeCalendar`

| Prop | Notes |
|------|--------|
| `value` | `{ start: Date \| null, end: Date \| null }` |
| `onChange` | `(range) => void` |
| `bookingDates` | `string[]` highlighted days |
| `embedded` | Compact chrome |

Requires `lucide-react`.

### Sparkline

**Import:** `react-viz-suite/react/Sparkline`

```jsx
<Sparkline points={[2, 4, 3, 7, 5]} />
```

---

## 5. Charts

**Import:** `react-viz-suite/react/charts`

Custom SVG charts (no chart.js / recharts). Most use `useScrollReveal` for on-scroll draw animation.

| Chart | Typical props | Use when |
|-------|---------------|----------|
| `CapsuleBarChart` | `values`, `labels`, `accentIndex`, `tone`, `height` | Discrete period bars |
| `PillLineChart` | `values`, `labels`, `highlightIndexes`, `deltas`, `width`, `height` | Single series with callouts |
| `MultiSeriesLineChart` | `labels`, `series: MultiSeriesLine[]` | Compare series (e.g. platforms) |
| `PerformanceTimeline` | week segments + active index | Interactive week picker banner |
| `ProgressBar` | `value`, `max`, `tone`, `variant`, `size` | Horizontal progress (`soft`/`solid`, `sm`/`md`) |
| `Heatstrip` | `values: number[]` | Intensity row |
| `RadarChart` | `axes: { label, value }[]` | Multi-axis score |
| `MiniStackedBars` | `data: { label, a, b }[]` | Compact stacked weekly |
| `MiniAreaChart` | compact area | Dense dashboard tiles |
| `MiniDonut` | compact donut | Share / composition |
| `MiniTrendChart` | `kind: 'line' \| 'bars'`, `values` | Thin wrapper over capsule/pill |

Example:

```jsx
import { CapsuleBarChart, MiniTrendChart } from 'react-viz-suite/react/charts'

<CapsuleBarChart
  values={[3, 7, 5, 9]}
  labels={['W1', 'W2', 'W3', 'W4']}
  tone="amber"
  height={120}
/>

<MiniTrendChart kind="line" values={[10, 12, 9, 15, 18]} />
```

---

## 6. Icons & illustration

| Export | Import | Notes |
|--------|--------|-------|
| `Logo` | `react-viz-suite/react/Logo` | Serves `/triphype_logo.png` from the host app |
| `MountainScene` | `…/MountainScene` | Decorative SVG (`currentColor`) |
| `FlightBookingIcon` | `…/BookingIcons` | Solid flight glyph |
| `HotelBookingIcon` | same | Solid hotel glyph |

```jsx
<Logo size={40} />
<FlightBookingIcon size={28} />
```

---

## 7. Utilities

### cn

```js
import { cn } from 'react-viz-suite/react/cn'
cn(styles.root, active && styles.active, className)
```

### useScrollReveal

```js
import { useScrollReveal } from 'react-viz-suite/react/useScrollReveal'

const { ref, revealed } = useScrollReveal({ threshold: 0.28, replay: true })
```

Returns `{ ref, revealed }`. Respects `prefers-reduced-motion`.

---

## 8. Tokens

| File | Purpose |
|------|---------|
| `react-viz-suite/tokens.css` | CSS custom properties |
| `react-viz-suite/tokens.scss` | SCSS `$th-*` mirrors |
| `react-viz-suite/bootstrap-map.scss` | Maps tokens → Bootstrap 5 variables |

Key groups: brand greens, accent/amber, neutrals, status (upcoming/confirmed/completed/neutral), radii, shadows, motion (`--ease-out`, `--duration-*`).

Fonts are **not** bundled — set `--font-sans` / `--font-display` in the host app.

---

## 9. Import map

| Subpath | Exports |
|---------|---------|
| `react-viz-suite/react` | Barrel (all of the below) |
| `…/react/SoftList` | SoftList family |
| `…/react/Button` | Button |
| `…/react/Badge` | Badge |
| `…/react/Toast` | ToastProvider, useToast |
| `…/react/CopyableId` | CopyableId, shortenId |
| `…/react/RangeCalendar` | RangeCalendar, DateRange |
| `…/react/Sparkline` | Sparkline |
| `…/react/InsightCard` | InsightCard |
| `…/react/InsightStrip` | InsightStrip |
| `…/react/DataTable` | DataTable, MetaBar |
| `…/react/charts` | All charts + MiniTrendChart |
| `…/react/icons` | Logo, MountainScene, booking icons |
| `…/react/LoadingState` | LoadingState |
| `…/react/cn` | cn |
| `…/react/useScrollReveal` | useScrollReveal |
| `react-viz-suite/tokens.css` | CSS tokens |
| `react-viz-suite/tokens.scss` | SCSS tokens |
| `react-viz-suite/bootstrap-map.scss` | Bootstrap map |

Prefer **subpath imports** in apps that care about tree-shaking / cold start.
