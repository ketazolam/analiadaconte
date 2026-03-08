

# Optimización General de la Web

Tras revisar a fondo todos los archivos, identifico mejoras en **rendimiento**, **SEO/accesibilidad**, **UX** y **calidad de código**.

---

## 1. Rendimiento

### 1a. Fonts: eliminar render-blocking
Las Google Fonts se cargan con `<link>` bloqueante. Cambiar a `font-display: swap` ya está implícito en la URL pero agregar `<link rel="preload">` para las fuentes críticas y usar `media="print" onload` pattern para cargar de forma no bloqueante.

### 1b. Unsplash images sin dimensiones fijas en FeaturedProperties y ClosedDeals
Las imágenes de Unsplash no tienen `width`/`height` en ClosedDeals (líneas 59-67 sí tienen pero faltan en algunos). Más importante: las property cards usan URLs de Unsplash con `w=500` — para mobile deberían usar `w=350`. Agregar `srcSet` para servir tamaños óptimos.

### 1c. ReviewsSection: `emblaApi.off("reInit")` falta en cleanup
Línea 103-105: solo se hace `off("select")` pero no `off("reInit")`. Memory leak menor.

### 1d. WhatsAppFAB: idle timer con mousemove listener sin throttle
El `resetIdle` se ejecuta en cada pixel de movimiento de mouse. Agregar un throttle simple o usar `pointermove` con `{ passive: true }` (ya tiene passive) pero throttlear a ~1s.

### 1e. Agregar `loading="lazy"` a las imágenes de ClosedDeals que ya lo tienen — OK. Pero las de FeaturedProperties (Unsplash) deberían tener `fetchpriority="low"`.

---

## 2. SEO y Accesibilidad

### 2a. Missing `lang` attribute — Ya tiene `lang="es"` — OK.

### 2b. Botones sin `aria-label` en Navigation mobile toggle
El botón hamburguesa (Menu icon) y el X no tienen `aria-label`.

### 2c. Structured data (JSON-LD)
Agregar schema.org `LocalBusiness` + `AggregateRating` en `index.html` para que Google muestre las estrellas en resultados de búsqueda. Esto es alto impacto para un negocio local.

### 2d. Missing `<meta name="robots">` y canonical URL
Agregar `<link rel="canonical" href="https://analiadaconte.lovable.app/" />` y asegurar que `robots.txt` es correcto.

### 2e. OG image apunta a un storage de Google temporal
La URL `storage.googleapis.com/gpt-engineer-file-uploads/...` podría expirar. Mover a `/public/images/og-image.jpg`.

---

## 3. UX / Visual

### 3a. StatsBar en mobile: `grid-cols-3` con números grandes se apila mal
Los números `clamp(56px,6vw,80px)` en 3 columnas en pantallas <400px se truncan. Cambiar a `grid-cols-1 sm:grid-cols-3` con separadores visuales entre items en mobile.

### 3b. ReviewsSection: agregar autoplay al carousel
El carousel es estático. Agregar autoplay con pausa on hover para mantener engagement.

### 3c. Footer links apuntan a `#` (no funcionales)
Los links de "Venta", "Alquiler", "Emprendimientos", etc. y "Quién soy", "Trayectoria", etc. van a `#`. Conectarlos a las secciones existentes o a WhatsApp.

### 3d. ValuationTool: el formulario no envía datos a ningún lado
El `handleSubmit` es un `setTimeout` fake. Esto es esperado sin backend, pero al menos podría redirigir a WhatsApp con los datos del formulario como mensaje pre-armado al "enviar".

### 3e. Navegación: agregar `scroll-margin-top` a las secciones
Cuando se hace smooth scroll a una sección, el contenido queda detrás del nav fijo. Agregar `scroll-margin-top: 80px` a las secciones con id.

---

## 4. Calidad de código

### 4a. Duplicate Google logo SVG
El `GoogleLogo` SVG se repite en `ReviewsSection.tsx` y `HeroSection.tsx`. Extraerlo a un componente compartido.

### 4b. Duplicate `ease` constant
`const ease = [0.22, 1, 0.36, 1]` se repite en 8+ archivos. Moverlo a `lib/constants.ts`.

### 4c. `NavLink.tsx` y `SellersSection.tsx` parecen no usarse
Verificar si son dead code y eliminar.

---

## Plan de implementación

### Archivos a modificar:

1. **`index.html`** — JSON-LD structured data, canonical URL, preload fonts pattern
2. **`src/lib/constants.ts`** — agregar `ease` constant compartida, Google Maps URL
3. **`src/components/GoogleLogo.tsx`** (nuevo) — componente SVG compartido
4. **`src/components/sections/Navigation.tsx`** — aria-labels en botones
5. **`src/components/sections/StatsBar.tsx`** — responsive grid mobile
6. **`src/components/sections/ReviewsSection.tsx`** — autoplay, cleanup embla listeners, usar GoogleLogo compartido
7. **`src/components/sections/HeroSection.tsx`** — usar GoogleLogo compartido, scroll-margin
8. **`src/components/sections/Footer.tsx`** — conectar links a secciones reales
9. **`src/components/WhatsAppFAB.tsx`** — throttle idle timer
10. **`src/index.css`** — scroll-margin-top para secciones con id
11. **`src/components/sections/FeaturedProperties.tsx`** — srcSet optimizado
12. **Eliminar** `NavLink.tsx` y `SellersSection.tsx` si son dead code

### Prioridad: SEO structured data > responsive fixes > performance > code cleanup

