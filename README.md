# `react-viz-suite`

Shared design tokens and React UI primitives (SoftList, charts, cards, tables) for Triphype admin, website, and corporate apps.

Formerly published as `@giginkrishnan/triphype-design`.

## Install

```bash
# local (monorepo sibling)
npm install file:../react-viz-suite

# from npm
npm install react-viz-suite
```

**Peers:** `react` ≥18, `react-dom` ≥18, `lucide-react` ≥0.400 (required for Toast, CopyableId, RangeCalendar).

Vite apps should transpile this package (unbuilt TSX + CSS modules):

```ts
// vite.config.ts
react({
  exclude: /node_modules\/(?!react-viz-suite)/,
})
```

Next.js:

```js
transpilePackages: ['react-viz-suite']
```

## CSS variables

```js
import 'react-viz-suite/tokens.css'
```

Fonts are **consumer-provided**. Override if needed:

```css
:root {
  --font-sans: 'Quicksand', sans-serif;
  --font-display: 'Quicksand', sans-serif;
}
```

## Bootstrap / SCSS

```scss
@import 'react-viz-suite/bootstrap-map.scss';
```

## React exports

Barrel:

```js
import {
  SoftList,
  SoftListItem,
  Button,
  Badge,
  CapsuleBarChart,
  LoadingState,
} from 'react-viz-suite/react'
```

Subpaths (tree-friendlier):

| Import | Contents |
|--------|----------|
| `./react/SoftList` | SoftList family + `SoftListLinkProvider` |
| `./react/Button` | Button |
| `./react/Badge` | Badge |
| `./react/Toast` | ToastProvider, useToast |
| `./react/CopyableId` | CopyableId, shortenId |
| `./react/RangeCalendar` | RangeCalendar |
| `./react/Sparkline` | Sparkline |
| `./react/InsightCard` | InsightCard |
| `./react/InsightStrip` | InsightStrip |
| `./react/DataTable` | DataTable, MetaBar |
| `./react/charts` | CapsuleBarChart, PillLineChart, MultiSeriesLineChart, PerformanceTimeline, ProgressBar, Heatstrip, RadarChart, MiniStackedBars, MiniAreaChart, MiniDonut, MiniTrendChart |
| `./react/icons` | Logo, MountainScene, FlightBookingIcon, HotelBookingIcon |
| `./react/LoadingState` | LoadingState |
| `./react/cn` | `cn()` |
| `./react/useScrollReveal` | scroll-reveal hook |

### SoftList + react-router

Design SoftList has no router dependency. For SPA `to=` rows, wrap with `SoftListLinkProvider`:

```jsx
import {
  SoftList,
  SoftListItem,
  SoftListLinkProvider,
} from 'react-viz-suite/react/SoftList'
import { Link } from 'react-router-dom'

<SoftListLinkProvider component={Link}>
  <SoftList>
    <SoftListItem to="/trips/1">…</SoftListItem>
  </SoftList>
</SoftListLinkProvider>
```

Without a provider, `to` rows render as `<a href={to}>`.

### LoadingState

```jsx
import { LoadingState } from 'react-viz-suite/react'

<LoadingState label="Loading trips…" />
<LoadingState label="Checking your session…" variant="block" />
```

| Prop | Type | Default |
|------|------|---------|
| `label` | `string` | `'Loading…'` |
| `variant` | `'inline' \| 'block'` | `'inline'` |
| `className` | `string` | — |

## Publish

```bash
npm publish --access public
```
