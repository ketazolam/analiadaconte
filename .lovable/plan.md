

# Mejora del Formulario de Tasación + Botón "Volver arriba"

## 1. Formulario de Tasación — Rediseño completo

### Problema actual
El wizard de 3 pasos funciona pero tiene issues:
- El botón "Quiero mi tasación gratuita" en el paso 3 simula un envío con `setTimeout(1500)` y luego abre WhatsApp. No queda claro que se va a abrir WhatsApp.
- No hay validación real (se puede enviar sin zona, sin superficie, etc.)
- El paso de "success" muestra un check y un botón de WhatsApp separado — redundante con el submit que ya abre WhatsApp.
- El `ValuationCTA` es un formulario duplicado más simple que no envía datos a ningún lado.

### Plan de mejora

**Paso 1 — Tipo de propiedad** (mantener, funciona bien)

**Paso 2 — Ubicación y características**
- Agregar validación: zona y superficie obligatorios antes de avanzar.
- Agregar campo de "Dirección aproximada" (opcional) para dar más contexto.
- Mejorar el campo de ambientes: mostrar como pills seleccionables en vez de `<select>`.

**Paso 3 — Datos de contacto + resumen enriquecido**
- Resumen visual mejorado: mostrar todos los datos ingresados como chips/tags en un card con ícono de cada campo.
- Validación de WhatsApp: mínimo 8 dígitos.
- El botón final cambia: en vez de "Quiero mi tasación gratuita" (que simula y luego abre WA), el flujo es:
  1. Al completar nombre + WhatsApp, aparece un **botón verde de WhatsApp animado** con el texto "Enviar por WhatsApp".
  2. Al hacer click, abre WhatsApp directamente con el mensaje pre-armado. Sin setTimeout fake.
  3. Después del click, se muestra la pantalla de éxito con confetti sutil y opciones secundarias.

**Pantalla de éxito**
- Animación de check mejorada.
- Mensaje: "¡Tu consulta fue enviada!" con sub-texto "Analía te responde en menos de 2 horas".
- Link secundario: "Ver propiedades disponibles →".
- Botón para "Enviar otra consulta" que resetea el form.

**Eliminar ValuationCTA** — Es redundante. El wizard ya cubre todo. Reemplazar su uso en Index.tsx.

### Archivos a modificar
- **`src/components/sections/ValuationTool.tsx`** — Rediseño del wizard
- **`src/components/sections/ValuationCTA.tsx`** — Eliminar
- **`src/pages/Index.tsx`** — Quitar ValuationCTA si se importa

---

## 2. Botón "Volver arriba" — Scroll-to-top

### Diseño
- Flecha sutil `↑` (ChevronUp) que aparece cuando el usuario scrolleó más del 50% de la página.
- Posición: **bottom-left** (el FAB de WhatsApp está en bottom-right).
- Estilo: círculo de 40px, borde sutil gold, fondo semi-transparente, aparece con fade+slide.
- Al hacer click: smooth scroll al top.
- En mobile: mismo comportamiento, resuelve el problema de tener que hacer scroll largo con el dedo.
- Desaparece automáticamente cuando está cerca del top (< 300px scrollY).

### Archivo nuevo
- **`src/components/ScrollToTop.tsx`** — Componente independiente
- **`src/pages/Index.tsx`** — Importar y montar

