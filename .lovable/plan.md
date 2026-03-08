

## Phase 1 Deep Dive: `/propiedades` — Full Improvement Plan

### Issues Found

1. **No property detail page (`/propiedad/:slug`)** — Cards are dead ends with no way to see full info, gallery, description, or map. This is the biggest gap.

2. **Barrio data is garbage** — The scraper is extracting random description fragments as `barrio` (e.g. "nuestra redes y enterate de los nuevos ingresos @analiadacontepropiedades", "planta baja", "las fotos"). The barrio filter dropdown is unusable. Need to either clean data or hide the filter.

3. **Pagination replaces instead of appending** — "Cargar más" replaces results instead of appending. Each page change triggers a new query that replaces the previous results.

4. **No search by text** — Vanzini has a search bar for barrio/direction. We have none.

5. **No image carousel on cards** — Vanzini shows multiple images per card. Our cards show only the first image.

6. **No share/bookmark actions** — Vanzini has favorite, share, alert buttons per card.

7. **Filters UX on mobile** — The current filter row wraps awkwardly on small screens. Needs a collapsible/drawer approach.

---

### Plan

#### 1. Create Property Detail Page (`/propiedad/:slug`)
- New route `/propiedad/:slug` using `pixel_slug` field
- New hook `useProperty(slug)` to fetch single property
- **Layout** (inspired by Vanzini detail page):
  - Full-width image gallery with thumbnails + navigation (Anterior/Siguiente)
  - Title, address, type badges
  - Price + surface prominently displayed
  - Features grid: dormitorios, banos, superficie total/cubierta, cochera, apto credito, mascotas
  - Full description text
  - Mini map (Leaflet) showing property location if lat/lng available
  - WhatsApp CTA sidebar (sticky on desktop)
  - Share button (copy link, WhatsApp share)
- **PropertyCard** updated to be a `<Link to={/propiedad/${slug}}>` wrapping the card
- Includes: Navigation, CustomCursor, ScrollProgress, WhatsAppFAB, Footer

#### 2. Fix Pagination (Infinite Scroll / Append)
- Change from page replacement to accumulation: store all loaded properties in state
- "Cargar más" appends next page results to existing array
- Show running count: "Mostrando 21 de 208"

#### 3. Fix Barrio Filter
- Remove the barrio dropdown from filters since the data is corrupted
- Replace with a **text search input** that searches across `titulo`, `direccion`, and `barrio` using Supabase `or(titulo.ilike.%term%,direccion.ilike.%term%)` 
- Add search icon and debounce (300ms)
- Add `searchText` to `PropertyFilters` type

#### 4. Image Carousel on Cards
- Add small dot indicators or a subtle left/right hover arrow on cards to browse 2-3 images
- Use `embla-carousel-react` (already installed) for lightweight swipe
- Show photo count badge (e.g. "1/12")

#### 5. Mobile Filters Drawer
- On mobile (`< md`), collapse filters into a button that opens a bottom sheet/drawer
- Show active filter count as badge
- Use the existing `vaul` drawer component

#### 6. Route Updates
- `App.tsx`: Add `/propiedad/:slug` route
- `PropertyCard`: Wrap entire card in `<Link>` to detail page
- Add new `useProperty` hook for single property fetch

### Files to create/modify
- **Create**: `src/pages/PropiedadDetalle.tsx` — detail page
- **Create**: `src/hooks/useProperty.ts` — single property hook
- **Modify**: `src/App.tsx` — add route
- **Modify**: `src/components/PropertyCard.tsx` — add Link, image carousel, photo count
- **Modify**: `src/components/PropertyFilters.tsx` — remove barrio, add text search, mobile drawer
- **Modify**: `src/pages/Propiedades.tsx` — fix pagination accumulation
- **Modify**: `src/hooks/useProperties.ts` — add text search filter
- **Modify**: `src/lib/types.ts` — add `searchText` to PropertyFilters

### Priority order
1. Property detail page (biggest UX gap)
2. Fix pagination
3. Text search + remove broken barrio filter
4. Image carousel on cards
5. Mobile filters drawer

