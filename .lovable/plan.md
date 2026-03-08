

## Phase 2: `/tasaciones` — Standalone Valuation Page

The ValuationTool wizard currently exists as a component (`src/components/sections/ValuationTool.tsx`) but was removed from the home page (comments in Index.tsx confirm this). It needs its own route.

### What to build
1. **New page `src/pages/Tasaciones.tsx`**
   - Wraps the existing `ValuationTool` component in a full page layout
   - Includes: `Navigation`, `CustomCursor`, `ScrollProgress`, `WhatsAppFAB`, `ScrollToTop`, `Footer`
   - Header section with title "Tasación gratuita" and subtitle, matching the Propiedades page style
   - Dark background consistent with the rest of the site

2. **Route in `App.tsx`**
   - Add `/tasaciones` route with lazy loading

3. **Navigation update**
   - Change "Vendedores" nav link to point to `/tasaciones` (or add a new "Tasación" link)
   - Update DualPathSection's "Quiero vender" CTA to navigate to `/tasaciones` instead of smooth-scrolling to `#tasacion`

---

## Phase 3: `/mapa` — Map View of Properties

The `PropertyFilters` component already has a "Ver en mapa" link pointing to `/mapa`. This page needs to be created.

### What to build
1. **New page `src/pages/Mapa.tsx`**
   - Full-screen map using **Leaflet** (free, no API key needed) via `react-leaflet` + `leaflet` packages
   - Reads properties from external Supabase using existing `useProperties` hook
   - Plots markers for properties that have `lat`/`lng` values
   - Clicking a marker shows a popup with: photo thumbnail, title, price, barrio, and a WhatsApp CTA
   - Compact filter bar at top (reuses `PropertyFiltersBar` with `showMapLink={false}`)
   - Centered on Mar del Plata (-38.0055, -57.5426)
   - Includes: `Navigation`, `CustomCursor`, `ScrollProgress`, `WhatsAppFAB`

2. **Route in `App.tsx`**
   - Add `/mapa` route with lazy loading

3. **Packages to install**
   - `leaflet` + `react-leaflet` + `@types/leaflet`

4. **Consistent UX elements**
   - CustomCursor, ScrollProgress, Navigation, WhatsAppFAB on both new pages

### Technical notes
- Leaflet is completely free with OpenStreetMap tiles — no API key required
- Properties without lat/lng will be silently excluded from the map
- Map markers will use a custom gold-colored marker to match the site's premium aesthetic

