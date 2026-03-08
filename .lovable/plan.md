

# Expansion: Catálogo de Propiedades, Página de Tasaciones y Mapa Interactivo

## Analysis of Vanzini and Premium Real Estate Patterns

### What Vanzini does well
- **Feed/Catálogo** (`/feed`): Filter bar at top (operacion, tipologia, dormitorios, precio, ubicacion, amenities, superficie). Grid of 3 cards per row. Each card shows image with overlay (superficie + precio), type badge, title, address, and "Consultar" CTA. Count of results + sort + toggle to map view.
- **Tasaciones** (`/tasaciones`): Full landing page structure: hero with drone city photo + CTA "Vender mi propiedad", then 3 value props (Vendedores profesionales, Expertos, Atención personalizada), then 4-step process, then a contact form at the bottom (nombre, email, telefono, direccion, tipo, descripcion).
- **Mapa** (`/mapa`): Split layout — left panel with scrollable property list (thumbnail + title + address + price), right side is the map (Google Maps) with markers. Same filter bar at top. Toggle between "Ver Listado" and map view.

### What we'll build differently (Analía Daconte identity)
- Dark editorial theme (already established) vs Vanzini's white/blue corporate look
- Gold accents, display typography, noise overlays — premium luxury feel
- WhatsApp-first CTA instead of generic "Consultar" forms
- Aerial drone photos of Mar del Plata as hero backgrounds

---

## Prerequisite: Connect Supabase to Lovable

Your Supabase is currently only used via n8n. We need to **connect it to this Lovable project** so pages can query the `propiedades` table directly. This is step zero before any implementation.

---

## Architecture: 3 New Pages + Navigation Updates

```text
/                  → Home (existing landing page, tweaked)
/propiedades       → Property catalog (feed/grid + filters)
/vender            → Sell landing page (replaces current ValuationTool section)
/mapa              → Interactive map with property markers
```

### Navigation changes
- Update `Navigation.tsx`: links become router `<Link>` elements instead of scroll anchors
- "Propiedades" → `/propiedades`, "Vendedores" → `/vender`, "Mapa" → `/mapa`
- Keep "Quiénes somos" and "Contacto" as scroll anchors on homepage only

---

## Page 1: `/propiedades` — Property Catalog

### Structure (inspired by Vanzini feed but with AD identity)

1. **Sticky filter bar** below nav: Operación (Venta/Alquiler pills), Tipo (dropdown), Dormitorios (dropdown), Precio min/max (range), Barrio (dropdown from distinct values), Superficie min/max
2. **Results header**: "{N} propiedades en {operación}" + sort dropdown (Precio ↑↓, Más recientes) + "Ver en mapa" link to `/mapa`
3. **Property grid**: 3 columns desktop, 2 tablet, 1 mobile. Each card:
   - Image (first from `fotos` jsonb array) with overlay showing superficie + precio
   - Type badge (VENTA/ALQUILER in gold or outline)
   - Title, barrio, ciudad
   - Icons row: dormitorios, baños, superficie, cochera
   - WhatsApp CTA button (pre-filled message with property title)
4. **Pagination**: Load more button or infinite scroll (prefer load more for SEO)
5. **Empty state**: "No encontramos propiedades con esos filtros" + clear filters button

### Data flow
- Supabase query with filters as URL params (`?operacion=venta&tipo=departamento&dormitorios=2`)
- `useQuery` with Supabase client, filtered server-side via `.eq()`, `.gte()`, `.lte()`
- Pagination via `.range(offset, offset + 20)`

---

## Page 2: `/vender` — Landing Page for Sellers

### Structure (Vanzini tasaciones + current SellProposal combined)

1. **Hero section**: Full-width drone photo of Mar del Plata coastline, overlay title "Vendé tu propiedad con los expertos de Mar del Plata", subtitle with stats, CTA "Solicitar tasación gratuita" (scrolls to form)
2. **Value proposition grid** (3 cards): "Expertos locales", "Marketing premium", "Atención personalizada" — with icons and short descriptions
3. **Process timeline** (reuse current SellProposal 4-step: Tasación → Producción → Difusión → Cierre)
4. **Services tags** (reuse current tag pills: fotografía, drone, 360, etc.)
5. **Contact form** (bottom): Clean form — Nombre, Teléfono/WhatsApp, Email, Dirección de la propiedad, Tipo (pills), Descripción opcional. On submit → opens WhatsApp with pre-filled message summarizing all data. No fake submission flow.
6. **Social proof strip**: "Vendemos 1 de cada 3 propiedades en menos de 60 días"

### Key difference from current
- **Standalone page** instead of embedded section — feels more professional and dedicated
- Removes the wizard (3-step form) which was confusing. Single-page form at the bottom.
- No simulated loading states. Direct WhatsApp action.

---

## Page 3: `/mapa` — Interactive Map

### Structure (inspired by Vanzini mapa)

1. **Split layout**: Left panel (scrollable property list, ~35% width) + Right (map, ~65% width). On mobile: map fills screen with a bottom sheet drawer for the list.
2. **Filter bar** at top: Same filters as `/propiedades` page (shared filter component)
3. **Map**: Leaflet (free, no API key needed) with OpenStreetMap tiles styled dark to match the theme. Markers clustered when zoomed out.
4. **Markers**: Custom gold markers. On click → popup card with thumbnail, title, price, link to WhatsApp
5. **List sync**: Clicking a card in the left panel centers the map on that property. Clicking a marker highlights the card in the list.
6. **Properties without coordinates**: Only show properties with lat/lng on the map. The list panel shows all.

### Library choice
- **Leaflet** via `react-leaflet` — free, no Google Maps API key needed, works well with dark tile themes (CartoDB dark_all tiles)

---

## Changes to Homepage (`/`)

1. **Remove ValuationTool section** entirely (moved to `/vender`)
2. **Remove FeaturedProperties hardcoded data** — replace with a query for `destacada = true` from Supabase (top 4-6 properties)
3. **SellProposal CTA** → links to `/vender` instead of scrolling to tasacion
4. **DualPathSection**: "Ver propiedades" → links to `/propiedades`, "Quiero vender" → links to `/vender`

---

## Files Summary

| Action | File | Description |
|--------|------|-------------|
| **Connect** | Supabase | Must connect external Supabase to Lovable first |
| Create | `src/pages/Propiedades.tsx` | Catalog page with filters + grid |
| Create | `src/pages/Vender.tsx` | Seller landing page with form |
| Create | `src/pages/Mapa.tsx` | Map page with split layout |
| Create | `src/components/PropertyCard.tsx` | Shared card component |
| Create | `src/components/PropertyFilters.tsx` | Shared filter bar |
| Create | `src/components/PropertyMap.tsx` | Leaflet map component |
| Create | `src/hooks/useProperties.ts` | Supabase query hook with filters |
| Create | `src/lib/types.ts` | TypeScript types matching your Supabase schema |
| Modify | `src/App.tsx` | Add routes `/propiedades`, `/vender`, `/mapa` |
| Modify | `src/components/sections/Navigation.tsx` | Router links + route awareness |
| Delete | `src/components/sections/ValuationTool.tsx` | Moved to `/vender` |
| Modify | `src/pages/Index.tsx` | Remove ValuationTool, update FeaturedProperties to use Supabase |
| Modify | `src/components/sections/FeaturedProperties.tsx` | Fetch from Supabase instead of hardcoded data |
| Modify | `src/components/sections/SellProposal.tsx` | CTA links to `/vender` |
| Modify | `src/components/sections/DualPathSection.tsx` | Links to `/propiedades` and `/vender` |
| Install | `react-leaflet`, `leaflet` | Map library (free) |

---

## Implementation Order

This is a large feature set. I recommend breaking it into **3 phases**:

**Phase 1**: Connect Supabase + types + data hook + `/propiedades` page (catalog with filters)
**Phase 2**: `/vender` page (seller landing + form) + remove old ValuationTool + update homepage
**Phase 3**: `/mapa` page (interactive map with Leaflet) + navigation updates

Each phase is independently deployable and testable.

