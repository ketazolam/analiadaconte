

# Mejora del Footer — Inspirado en la web actual de Analía Daconte

## Referencia (screenshot)
La web actual tiene un footer con 4 columnas: Logo + descripción + botón "Contáctenos", Links Rápidos, Contáctenos (dirección completa, teléfono, email, matrícula), Síganos (redes sociales). Debajo una barra con copyright y créditos.

## Cambios planificados

### Estructura: 4 columnas (desktop) → stack (mobile)

**Columna 1 — Marca**
- Logo "AD" con subtítulo "Inversiones Inmobiliarias"
- Texto: "Más de 25 años como Martillera y Corredora Pública en la ciudad de Mar del Plata y alrededores"
- Botón outline gold "Contáctenos" → abre WhatsApp

**Columna 2 — Links Rápidos**
- Título con underline dorado sutil
- Links: Inicio (`/`), Venta (`/propiedades?operacion=venta`), Alquiler (`/propiedades?operacion=alquiler`), Vender (`/vender`), Mapa (`/mapa`)
- Usar React Router `Link` en vez de scroll anchors

**Columna 3 — Contacto**
- Dirección completa: "Ortega y Gasset 658 / Av. Constitución 4920, Mar del Plata, Buenos Aires"
- Teléfono (clickable `tel:`)
- Email (clickable `mailto:`)
- Matrícula: 2815

**Columna 4 — Redes sociales**
- Título "Síguenos" con underline dorado
- Iconos: Instagram, Facebook (si hay URL), WhatsApp
- Iconos más grandes (24px) con hover gold

**Barra inferior**
- Separador dorado sutil
- "© 2026 Analía Daconte Inversiones Inmobiliarias"

### Mobile
- Stack vertical, cada sección centrada
- Botón "Contáctenos" full-width
- Iconos de redes en fila centrada

### Actualización de constants.ts
- Agregar `ADDRESS_FULL` con la dirección completa del screenshot

### Archivos
- **Modificar**: `src/components/sections/Footer.tsx` — rediseño completo
- **Modificar**: `src/lib/constants.ts` — agregar dirección completa

