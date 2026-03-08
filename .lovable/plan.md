

# WhatsApp FAB — Revisión 360° y Mejoras

## Errores encontrados en consola

1. **`ref` warning en `framer-motion` `AnimatePresence`** — El `PopChild` de framer-motion intenta pasar `ref` a un componente que no lo soporta. Esto ocurre en `ValuationTool.tsx` (línea 241 del error), no directamente en el FAB, pero es un warning global.

2. **`ReviewsSection` no puede recibir refs** — Warning: "Function components cannot be given refs". Esto no es del FAB pero se ve en consola.

## Problemas actuales del WhatsApp FAB

### Lógica
- **`dismissed` es permanente por sesión** — Si el usuario cierra el tooltip una vez, nunca más lo ve. Debería resetearse por sesión (ya lo hace con `useState`) pero el UX es agresivo: una sola oportunidad.
- **Tooltip se muestra repetidamente en cada scroll threshold** — Si el usuario scrollea al 30% y luego al 70%, le aparece dos veces el tooltip aunque ya lo haya cerrado manualmente la primera vez (solo `dismissed` lo previene, pero los triggers de scroll no chequean si el tooltip ya fue mostrado recientemente).
- **El tooltip se auto-cierra en 6s pero no marca `dismissed`** — Así que vuelve a aparecer en el siguiente trigger point. Esto puede ser molesto.
- **El pulse ring (`whatsapp-pulse`) se renderiza condicionalmente** — Causa re-mount innecesario. Debería controlarse con CSS opacity.

### Visual
- **Tooltip arrow apunta a la derecha** pero el tooltip está a la izquierda del botón — El arrow debería apuntar hacia el botón (derecha). Actualmente funciona pero el posicionamiento puede romperse en pantallas pequeñas donde el tooltip se superpone al botón.
- **No hay un mensaje pre-armado en el link de WhatsApp** — El botón abre WhatsApp sin texto. Debería tener un mensaje de saludo.
- **Sin feedback táctil en mobile** — El botón tiene `whileTap` de framer pero el tooltip no tiene interacción clara en mobile.

## Plan de mejoras

### 1. Lógica mejorada del tooltip
- Agregar **cooldown de 30s** entre apariciones del tooltip — si se auto-cerró o se cerró manualmente, no volver a mostrar por 30s.
- Después de **2 dismissals manuales**, no volver a mostrar el tooltip en la sesión (dismissed permanente).
- Reducir triggers de scroll a **0.4 y 0.8** (más espaciados).
- Reducir idle timer a **30s** (45s es demasiado largo para ser útil).

### 2. Mensaje pre-armado en WhatsApp
- Usar `whatsappLink("Hola Analía, estoy viendo tu web y me gustaría consultar")` en vez de `WHATSAPP_URL` simple.

### 3. Visual mejorado
- Pulse ring siempre montado, controlado con CSS `opacity` para evitar re-mounts.
- Tooltip con **variantes de mensaje rotativas**: "¿Te ayudamos?", "¿Buscás propiedad?", "Consultá sin compromiso" — rotación en cada aparición.
- Mejorar la animación de entrada del tooltip con un leve `bounce`.

### 4. Accesibilidad
- `role="complementary"` en el contenedor del tooltip.
- `aria-live="polite"` para que screenreaders anuncien el tooltip.

### 5. Fix del warning de consola
- No es del FAB directamente, pero corregir `ReviewsSection` con `forwardRef` para eliminar el warning de la consola.

## Archivos a modificar

1. **`src/components/WhatsAppFAB.tsx`** — Reescritura de lógica + visual
2. **`src/components/sections/ReviewsSection.tsx`** — Agregar `forwardRef` para eliminar el warning de consola

