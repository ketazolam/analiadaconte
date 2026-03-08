

## Mejoras propuestas para `/propiedades`

Tras revisar el código completo del catálogo, la página de detalle, los filtros y los hooks, estas son las mejoras organizadas por prioridad:

---

### 1. Filtros avanzados: Rango de precio y superficie
Los filtros `precioMin`, `precioMax`, `superficieMin`, `superficieMax` ya existen en el tipo y en el hook, pero no tienen UI. Agregar:
- **Rango de precio**: Dos inputs inline (Desde / Hasta) con formato numérico
- **Rango de superficie**: Igual, Desde / Hasta en m²
- Estos filtros van tanto en desktop como en el drawer mobile

**Archivos**: `PropertyFilters.tsx`

---

### 2. Filtro de "Solo destacadas"
El hook ya soporta `filters.destacada`, pero no hay toggle en la UI. Agregar un chip/toggle "Destacadas" junto a los pills de Venta/Alquiler.

**Archivos**: `PropertyFilters.tsx`

---

### 3. Persistencia de filtros en URL (query params)
Actualmente los filtros se pierden al navegar a una propiedad y volver. Sincronizar todos los filtros con `useSearchParams` para que:
- La URL refleje los filtros activos (`/propiedades?operacion=venta&tipo=Departamento&sort=precio_asc`)
- Al volver con el botón "atrás" se restauren los filtros
- Se puedan compartir búsquedas por link

**Archivos**: `Propiedades.tsx`, `PropertyFilters.tsx`

---

### 4. Vista de lista vs grilla (toggle)
Agregar un toggle grid/list en la barra de filtros. La vista lista muestra cards horizontales con más info visible (descripción truncada, más features). Ideal para comparar propiedades rápido.

**Archivos**: `Propiedades.tsx`, `PropertyFilters.tsx`, nuevo componente `PropertyCardRow.tsx`

---

### 5. Skeleton loading mejorado en cards
Los skeletons actuales son rectángulos planos. Mejorarlos con estructura que simule la card real: bloque imagen + líneas de texto + features row. Da percepción de carga más rápida.

**Archivos**: `Propiedades.tsx` (inline o nuevo `PropertyCardSkeleton.tsx`)

---

### 6. Scroll to top al cambiar filtros
Cuando se cambian filtros, el grid se resetea pero el scroll queda abajo. Agregar `window.scrollTo({ top: 0, behavior: 'smooth' })` al cambiar filtros.

**Archivos**: `Propiedades.tsx`

---

### 7. Mejoras en PropertyCard
- **Barrio sanitization**: El campo `barrio` tiene datos basura del scraper. Truncar a max 40 chars y filtrar strings con `@` o que sean muy largos, mostrando solo `ciudad` como fallback.
- **Swipe en mobile**: Las flechas de navegación de fotos son hover-only (invisible en mobile). Agregar swipe touch con `onTouchStart/onTouchEnd` para navegar fotos.
- **Animación de entrada stagger**: Actualmente el delay se calcula sobre el índice global (`i * 0.05`), lo que genera delays enormes en páginas siguientes. Usar `(i - previousCount) * 0.05` para que solo las nuevas cards tengan animación.

**Archivos**: `PropertyCard.tsx`, `Propiedades.tsx`

---

### 8. Mejoras en PropiedadDetalle
- **Keyboard navigation en galería**: Agregar listener para flechas izquierda/derecha y Escape para cerrar lightbox
- **SEO**: Agregar `document.title` dinámico con el título de la propiedad
- **Propiedades similares**: Al final de la página, mostrar 3 propiedades del mismo tipo/operación usando `useProperties` con filtros prearmados
- **Galería touch swipe**: Mismo concepto que las cards, swipe para navegar fotos en mobile

**Archivos**: `PropiedadDetalle.tsx`

---

### Resumen de archivos a modificar

| Archivo | Cambios |
|---|---|
| `PropertyFilters.tsx` | Rangos precio/superficie, toggle destacadas, toggle vista, URL sync |
| `Propiedades.tsx` | URL sync, scroll top on filter, vista list/grid, skeleton mejorado, fix stagger |
| `PropertyCard.tsx` | Barrio sanitization, touch swipe, fix mobile arrows |
| `PropiedadDetalle.tsx` | Keyboard nav, SEO title, propiedades similares, touch swipe |
| `PropertyCardRow.tsx` | Nuevo componente para vista lista |
| `PropertyCardSkeleton.tsx` | Nuevo componente skeleton |

### Orden de implementación
1. URL sync + scroll to top (foundation)
2. Filtros avanzados (precio, superficie, destacadas)
3. Card fixes (barrio, touch swipe, stagger)
4. Skeleton mejorado
5. Detalle: keyboard, SEO, similares
6. Vista lista toggle

