
## Respuestas

### 1. ¿Usás "opus 4.6"?
No puedo confirmar qué modelo específico me impulsa — Lovable usa una combinación de modelos que se actualiza continuamente. No tengo acceso a esa información.

---

### 2. Análisis de diseño profesional del Hero en mobile

Analizando la imagen y el código actual, aquí está mi devolución como diseñador:

---

**LO QUE FUNCIONA BIEN**
- La foto aérea de MdP da un contexto geográfico inmediato y poderoso
- La tipografía Cormorant Garamond tiene peso editorial correcto
- El gold gradient en "Mar del Plata" funciona como punto focal
- El badge de Google añade credibilidad sin molestar

---

**PROBLEMAS IDENTIFICADOS**

**A) Jerarquía visual rota en mobile**
El eyebrow label "INVERSIONES INMOBILIARIAS · MAR DEL PLATA" está en `mb-8` (32px de margin inferior), creando demasiado espacio entre él y el H1. En mobile con pantalla más corta, el contenido queda demasiado comprimido hacia abajo.

**B) Los botones en mobile son demasiado grandes y ocupan mucho ancho**
`"Quiero comprar"` y `"Quiero vender"` en `flex-row` con padding `px-6 py-3` en mobile se ven bien, pero visualmente los botones son casi del mismo tamaño visual y el CTA principal no se distingue como primario. El botón de outline tiene `bg-white/5 backdrop-blur-sm` pero en mobile no se percibe la distinción con el relleno.

**C) Overlay de la foto muy uniforme**
El gradiente actual va de `0.55 → 0.65 → 0.88` pero la foto de MdP tiene un sky claro en la parte superior. El resultado en mobile es que la foto se "aplana" visualmente — pierde contraste en la zona media donde se asienta el texto. Necesita un overlay más trabajado: más transparente arriba (para ver el cielo y la ciudad), más opaco en el centro exacto donde está el H1.

**D) El "SCROLL" en la parte inferior**
La línea dorada + "SCROLL" en `fontSize: 9` es demasiado pequeña en mobile y queda muy baja (casi sin margen). Además el texto "Scroll" en minúscula uppercase de 9px no se lee en pantallas pequeñas.

**E) El eyebrow "Inversiones Inmobiliarias · Mar del Plata" es redundante**
El H1 ya dice "Expertos en / Mar del Plata". El eyebrow repite el mismo concepto geográfico. En desktop tiene sentido como contextualizador, pero en mobile ocupa espacio valioso above the fold y el texto wrappea en dos líneas (se ve en la imagen capturada).

**F) mb-12 antes de los botones**
El subtexto "25 años construyendo confianza..." tiene `mb-12` (48px) antes de los botones. En mobile eso empuja los CTAs hacia abajo innecesariamente.

---

**PROPUESTA DE MEJORAS**

1. **Overlay más cinematográfico**: Cambiar el gradiente plano por uno de 3 zonas — arriba sutil (0.3), centro reforzado donde está el texto (0.7), base muy oscura (0.92). Resultado: la foto "respira" arriba y el texto tiene contraste real.

2. **Reducir espaciado mobile**: Aplicar `mb-4 md:mb-8` al eyebrow y `mb-6 md:mb-12` antes de los botones. Recupera ~60px verticales en mobile.

3. **Eliminar el eyebrow en mobile o simplificarlo** a solo "Mar del Plata" — el full texto wrappea en 2 líneas en pantallas <390px.

4. **Diferenciar más visualmente los CTAs**: Aumentar el peso visual del botón primario (filled) y hacer el secundario (outline) más delgado en border — `border` en vez de `border-2` en mobile.

5. **SCROLL indicator**: Agrandarlo y subirlo `bottom-8 → bottom-10`, aumentar el font-size a 10px.

6. **Considerar anclar el contenido verticalmente más arriba**: El contenido actualmente está `items-center` (centrado). En mobile, centrar verticalmente funciona bien pero el Google badge queda muy pegado al borde del WhatsApp FAB (que está en la esquina). Podría desplazarse el contenido a `items-start` con un `pt-[30vh]` para alinearlo ópticamente a 1/3 desde arriba — principio de proporción áurea vertical.

---

**PLAN DE IMPLEMENTACIÓN**

Aplicar las mejoras al `HeroSection.tsx` y `MagneticButton.tsx`:

- Overlay: 3-zona más cinematográfico
- Espaciados mobile: `mb-4 md:mb-8`, `mb-6 md:mb-12`  
- Eyebrow: ocultar en mobile (`hidden sm:block`) o recortar texto
- Botón outline: `border md:border-2` en mobile
- Scroll indicator: agrandar
- Posicionamiento vertical: `items-start pt-[28vh] md:items-center md:pt-0` para proporción áurea en mobile
