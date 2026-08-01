# `react-viz-suite`

Shared design tokens and React UI primitives — SoftList, charts, cards, tables, and feedback components.

**Version:** `0.3.0` · [GitHub](https://github.com/giginkrishnan/react-viz-suite) · [npm](https://www.npmjs.com/package/react-viz-suite)

Formerly `@giginkrishnan/triphype-design`.

## Install

```bash
npm install react-viz-suite
# local monorepo sibling
npm install file:../react-viz-suite
```

**Peers:** `react` ≥18, `react-dom` ≥18, `lucide-react` ≥0.400 (Toast, CopyableId, RangeCalendar).

```ts
// Vite
react({ exclude: /node_modules\/(?!react-viz-suite)/ })

// Next.js
transpilePackages: ['react-viz-suite']
```

Load tokens once in the app shell:

```js
import 'react-viz-suite/tokens.css'
```

## Component catalog

| Component | Import | Description |
|-----------|--------|-------------|
| **SoftList** | `react-viz-suite/react/SoftList` | Soft row list system (items, media, meta cells) |
| SoftListItem | same | Polymorphic row: `div` / `button` / `a` / `to` link |
| SoftListInner | same | Row grid wrapper |
| SoftListHead | same | Title + optional media slot |
| SoftListCover | same | Cover image |
| SoftListMedia | same | Icon/media tile (`green` / `amber` / `muted`) |
| SoftListMeta | same | Stats/meta column group |
| SoftListCell | same | Labeled metric cell |
| SoftListTitle / SoftListTitleRow | same | Row title primitives |
| SoftListLinkProvider | same | Inject router `Link` for `to=` rows |
| **Button** | `…/Button` | `primary` / `secondary` / `ghost` / `outline` |
| **Badge** | `…/Badge` | Status chip (`upcoming` / `confirmed` / `completed` / `neutral`) |
| **LoadingState** | `…/LoadingState` | Orbit + shimmer loader |
| **ToastProvider** / **useToast** | `…/Toast` | Success / error / info toasts |
| **CopyableId** | `…/CopyableId` | Mono ID + copy button (`shortenId` helper) |
| **RangeCalendar** | `…/RangeCalendar` | Date-range picker |
| **Sparkline** | `…/Sparkline` | Tiny SVG trend line |
| **InsightCard** | `…/InsightCard` | Animated stat card |
| **InsightStrip** | `…/InsightStrip` | Card row + optional chart panel |
| **DataTable** | `…/DataTable` | Generic column table |
| **MetaBar** | same | Pagination / totals summary |
| **CapsuleBarChart** | `…/charts` | Capsule bar chart |
| **PillLineChart** | same | Pill-marker line chart |
| **MultiSeriesLineChart** | same | Multi-series line chart |
| **PerformanceTimeline** | same | Week-segment timeline picker |
| **ProgressBar** | same | Horizontal progress |
| **Heatstrip** | same | Intensity strip |
| **RadarChart** | same | Radar / spider chart |
| **MiniStackedBars** | same | Compact stacked bars |
| **MiniAreaChart** | same | Compact area chart |
| **MiniDonut** | same | Compact donut |
| **MiniTrendChart** | same | Convenience bars/line wrapper |
| **Logo** | `…/Logo` | Triphype logo image |
| **MountainScene** | `…/MountainScene` | Decorative SVG scene |
| **FlightBookingIcon** / **HotelBookingIcon** | `…/BookingIcons` | Booking glyphs |
| **cn** | `…/cn` | Classname join helper |
| **useScrollReveal** | `…/useScrollReveal` | Scroll-into-view reveal hook |

Full API notes: **[docs/COMPONENTS.md](docs/COMPONENTS.md)**.

## Quick start

```jsx
import 'react-viz-suite/tokens.css'
import {
  SoftList,
  SoftListItem,
  SoftListLinkProvider,
  Button,
  Badge,
  LoadingState,
  CapsuleBarChart,
} from 'react-viz-suite/react'
import { Link } from 'react-router-dom'

<SoftListLinkProvider component={Link}>
  <SoftList>
    <SoftListItem to="/trips/1">
      Trip A <Badge tone="confirmed">Confirmed</Badge>
    </SoftListItem>
  </SoftList>
</SoftListLinkProvider>

<CapsuleBarChart values={[4, 8, 6, 10]} labels={['Mon', 'Tue', 'Wed', 'Thu']} />
<LoadingState label="Loading…" variant="block" />
<Button variant="primary">Save</Button>
```

## Tokens & Bootstrap

```js
import 'react-viz-suite/tokens.css'
```

```scss
@import 'react-viz-suite/bootstrap-map.scss';
```

Fonts are consumer-provided (`--font-sans`, `--font-display`).

## Publish

```bash
npm publish --access public --otp=<code>
```
