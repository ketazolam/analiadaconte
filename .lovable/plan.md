

# Reemplazar foto de Compradores en DualPath

## Problema
`mdp-coastline.jpg` (panel Compradores) es una vista aérea de la costa, prácticamente idéntica al hero (`mdp-aerial-hero.jpg`). No hay diferenciación visual.

## Solución
Usar `waiting-room.jpg` (ya subida en el proyecto) como fondo del panel Compradores. Razón:
- **Contraste total** con el hero aéreo — pasa de paisaje exterior a interior premium
- **Transmite la experiencia** de ser atendido por Analía — el comprador se imagina ahí
- **Complementa** el panel Vendedores que ya usa `office-wide.jpg` (otra foto interior/oficina pero diferente)
- No requiere descargar ni agregar imágenes nuevas

## Cambio
**`src/components/sections/DualPathSection.tsx`** — línea 25:
- Cambiar `bgImage: "/images/mdp-coastline.jpg"` → `bgImage: "/images/waiting-room.jpg"`

Un solo cambio de una línea.

