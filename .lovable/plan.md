

## Plan de mejoras: WhatsApp FAB en Tasaciones + Formulario paso 2/3

### 1. WhatsApp FAB contextual en `/tasaciones`

**Problema**: El FAB muestra mensajes como "¿Buscás propiedad?" que no tienen sentido en una página de tasación. Distrae al usuario del formulario.

**Solución**: Agregar una prop `mode` al componente `WhatsAppFAB` con dos modos:
- `"default"` (comportamiento actual — scroll triggers, idle triggers, tooltips)
- `"minimal"` (para tasaciones — sin tooltips nunca, el botón aparece hidden y solo se muestra brevemente al llegar al footer con scroll ≥ 0.92, auto-hide después de 3s, sin idle triggers)

En `Tasaciones.tsx`, pasar `<WhatsAppFAB mode="minimal" />`.

### 2. Dividir paso 2 en paso 2 + paso 3

**Problema**: El paso 2 actual tiene 6 campos (zona, dirección, superficie, ambientes, estado, cochera) + resumen + botones. En mobile (390px) requiere mucho scroll y el CTA queda fuera de pantalla.

**Solución**: Dividir en 3 pasos:
- **Paso 1** (sin cambios): Selección de tipo de propiedad
- **Paso 2** (nuevo): Solo los campos de ubicación y superficie (Zona, Dirección opcional, Superficie m²) — 3 campos que caben sin scroll
- **Paso 3** (nuevo): Características (Ambientes, Estado, Cochera) + Resumen + botón CTA de WhatsApp

Actualizar el progress bar y step indicator para reflejar "Paso X de 3".

### 3. Botón CTA más estético con identidad WhatsApp

**Problema actual**: El botón "Solicitar tasación" tiene el color verde WhatsApp pero es pequeño y no comunica claramente que abre WhatsApp.

**Solución**: Rediseñar el CTA final:
- Botón full-width con fondo verde WhatsApp (`bg-whatsapp`)
- Icono SVG de WhatsApp (el mismo del FAB) en lugar del genérico `MessageCircle`
- Texto: "Enviar por WhatsApp" (más claro que "Solicitar tasación")
- Tamaño más grande: `py-4 text-base`
- Subtexto debajo del botón: "Tu consulta va directo al chat de Analía"

### Archivos a modificar

1. **`src/components/WhatsAppFAB.tsx`** — Agregar prop `mode: "default" | "minimal"`, condicionar toda la lógica de tooltips/idle/scroll según el modo
2. **`src/pages/Tasaciones.tsx`** — Pasar `mode="minimal"` al FAB
3. **`src/components/sections/ValuationTool.tsx`** — Reestructurar en 3 pasos, rediseñar el botón CTA con icono WhatsApp y estilo más prominente

