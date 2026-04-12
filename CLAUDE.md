# Analía Daconte — Sitio Inmobiliario

## Stack
- React + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (DB principal)
- Bun como package manager (`bun install`, `bun run dev`)
- React Router, Framer Motion, Leaflet (mapa)
- Lovable (deploy automático desde `main`)

## Deploy
- **Vercel** (migrado desde Lovable el 2026-04-12)
- URL producción: https://analiadaconte.vercel.app
- Cuenta Vercel: tommyotegui@gmail.com (team: tommyotegui-5496s-projects)
- Push a `main` → Vercel re-deployea automáticamente (~1-2 min)
- **Build config crítico:** Install Command override = `bun install` (no npm)
- Dominio propio: pendiente de vincular

## Supabase — Producción
- Project ref: `cypgnhtwazinvvuipxct`
- URL: `https://cypgnhtwazinvvuipxct.supabase.co`
- Anon key: `sb_publishable_YTMUByF1tykzNAOkGtTOHQ_dUuOXQ3B`
- Service role key: en `analia.md` de la memoria global (no hardcodear en código)

## Base de datos — Tabla `propiedades`
Columnas principales: `id`, `titulo`, `lat`, `lng`, `direccion`, `barrio`, `ciudad`, `tipo`, `operacion`, `precio`, `moneda`, `fotos` (array), `estado`, `destacada`
Columnas extendidas (migración 2026-03-16): `notas_privadas`, `etiqueta`, `estado_actual`, `no_publicar_precio`, `m2_descubiertos`, `m2_semicubiertos`, `a_estrenar`, `antiguedad`, `expensas`, `orientacion`, `cantidad_plantas`, `cobertura_cochera`, `luminosidad`, `video_url`, `recorrido_360_proveedor`, `recorrido_360_codigo`, `planos`

Tabla `mensajes`: `respondido boolean`, `destacado boolean`
Tabla `property_views`: `id`, `propiedad_id`, `path`, `created_at` — tracking de visitas

## Colores del sitio
- Primary: `hsl(275, 62%, 38%)` (púrpura)
- Footer bg: `hsl(270 55% 12%)`
- Nav scrolled bg: `rgba(252,252,252,0.95)`

## Logo
- Archivo: `public/images/logo-ad.png`
- Nav: `h-7`, sin filter en fondo claro / `brightness(0) invert(1)` en hero oscuro
- Footer: `h-10`, siempre `brightness(0) invert(1)` (fondo oscuro púrpura)

## Componentes clave
- `src/components/sections/Navigation.tsx` — navbar con logo
- `src/components/sections/Footer.tsx` — footer con logo
- `src/components/sections/HeroSection.tsx` — hero con video en mobile
- `src/pages/Mapa.tsx` — mapa Leaflet con propiedades
- `src/pages/PropiedadDetalle.tsx` — detalle de propiedad
- `src/lib/types.ts` — tipo `Propiedad` completo

## Design System — Admin Panel
- Tema claro (light theme) — rediseñado 2026-03-15
- Archivo canónico: `src/styles/ADMIN_DESIGN.md`
- Credenciales admin: `admin@analiadaconte.com.ar` / `Analia2026!`

## Decisiones de diseño (NO revertir)
- **StatsBar eliminada** — no volver a agregar este componente
- **Hero mobile usa video** — no reemplazar con carousel de imágenes
- Imágenes en WebP (público/images/*.webp) — no volver a JPG/PNG

## Performance (2026-03-18)
- Imágenes WebP: 20 MB → 4 MB total
- vite.config.ts: manualChunks + gzip/brotli
- AdminAuthProvider lazy via AdminShell.tsx (solo carga en /admin/*)
- Hero: solo slide activo en DOM; preload slides 2-4 con `new Image()` a 2s

## GitHub
- Repo: https://github.com/ketazolam/analiadaconte
- Usuario: ketazolam (cuenta de Analía)
- Token puede estar vencido (temporal ~7 días desde 2026-03-10). Si falla el push, pedir nuevo token classic a Analía.
