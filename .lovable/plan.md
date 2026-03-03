

# Auditoría UX/UI — Avatar Ideal y Mejoras

## Tu Avatar Ideal (Prospecto)

**Perfil A — Vendedor** (60% del tráfico esperado): Mujer/hombre 40-65, propietario en MdP, clase media-alta. Quiere vender rápido, al mejor precio, sin complicaciones. Busca confianza, profesionalismo y resultados comprobables. No es nativo digital — necesita claridad inmediata.

**Perfil B — Comprador**: 30-50 años, busca invertir o mudarse a MdP. Quiere ver propiedades rápido, filtrar por zona/precio, y contactar sin fricción.

Ambos perfiles valoran: **confianza visual instantánea**, **prueba social**, **velocidad de contacto**, y **claridad sobre qué hace Analía diferente**.

---

## 1. Errores y Problemas Detectados

### 1.1 Hero — Sin CTA claro para el avatar principal
- Los botones "Quiero comprar" / "Quiero vender" no llevan a ningún lado (`href` no definido). El usuario hace click y no pasa nada — destruye confianza al instante.
- **Fix**: "Quiero comprar" scrollea a `#propiedades`, "Quiero vender" scrollea a `#tasacion`.

### 1.2 Navigation — Links rotos
- `#propiedades`, `#vendedores`, `#about`, `#contacto` — solo `#propiedades`, `#vendedores` y `#about` tienen `id` real en el DOM. `#contacto` no existe.
- **Fix**: Agregar `id="contacto"` al Footer o al ValuationTool. Implementar smooth scroll con `scrollIntoView({ behavior: 'smooth' })`.

### 1.3 FeaturedProperties — Scroll horizontal sin indicador
- El carrusel draggable no tiene ninguna pista visual de que se puede arrastrar. El avatar de 50+ años no va a descubrir esto solo.
- **Fix**: Agregar flechas de navegación visibles y/o dots indicadores. También un texto sutil "Deslizá →".

### 1.4 FeaturedProperties — Solo 4 propiedades, no hay "Ver más"
- El prospecto ve 4 cards y asume que eso es todo. No hay link a un catálogo completo.
- **Fix**: Agregar un botón "Ver todas las propiedades →" al final de la sección.

### 1.5 StatsBar — "15K Seguidores" es ambiguo
- El avatar no sabe si son seguidores de Instagram, de la web, etc. Y "MdP" como stat no tiene valor numérico.
- **Fix**: Cambiar a "15K en Instagram" y reemplazar "MdP" por algo con valor real como "98% satisfacción" o "500+ familias".

### 1.6 DualPath — Redundancia con SellersSection y SellProposal
- Hay 3 secciones dirigidas a vendedores (DualPath vendedores, SellersSection, SellProposal). El prospecto ve el mismo mensaje 3 veces — fatiga y confusión.
- **Fix**: Eliminar SellersSection (redundante). DualPath introduce, SellProposal profundiza. Suficiente.

### 1.7 Reviews — Solo 3, sin fuente verificable
- 3 reviews genéricas sin foto, sin link a Google. El avatar desconfía.
- **Fix**: Agregar avatar/iniciales al review card, link a Google Reviews real, y un badge "4.9 ★ en Google" arriba de la sección.

### 1.8 Footer — Datos de contacto placeholder
- `+54 9 223 500-0000` y `info@analiadaconte.com.ar` son placeholders. Si alguien llega al footer y quiere llamar, no puede.
- **Fix**: Reemplazar con datos reales (pendiente de la cliente).

### 1.9 WhatsApp links — Número placeholder en toda la web
- Todos los `wa.me/5492235000000` son falsos. Ningún CTA funciona realmente.
- **Fix**: Centralizar el número en una constante (`WHATSAPP_NUMBER`) para cambiar en un solo lugar cuando llegue el real.

### 1.10 Mobile — Texto hero demasiado grande
- `clamp(52px,7vw,120px)` en mobile resulta en texto que ocupa demasiado espacio vertical, empujando los CTAs fuera del viewport.
- **Fix**: Reducir el clamp mínimo a `40px`.

### 1.11 ValuationTool — Formulario no envía a ningún lado
- El `handleSubmit` hace un `setTimeout` fake. No hay integración real.
- **Fix**: Marcar como TODO para backend. Por ahora, al menos que el "success" redirija a WhatsApp con los datos pre-cargados (ya lo hace parcialmente).

---

## 2. Propuestas de Mejora

### 2.1 Centralizar constantes de contacto
Crear `src/lib/constants.ts` con `WHATSAPP_NUMBER`, `PHONE`, `EMAIL`, `INSTAGRAM_URL` — usado en todos los componentes. Permite cambiar datos en un solo archivo.

### 2.2 Smooth scroll para navegación interna
Implementar `scrollIntoView({ behavior: 'smooth' })` en todos los anchor links del nav y los CTAs del hero, en vez de `href="#section"` que hace un salto brusco.

### 2.3 Hero CTAs funcionales
- "Quiero comprar" → scroll suave a `#propiedades`
- "Quiero vender" → scroll suave a `#tasacion`

### 2.4 Indicador visual en carrusel de propiedades
Agregar flechas `←` `→` con click handlers y un hint de "Deslizá" para mobile.

### 2.5 Eliminar sección redundante (SellersSection)
El contenido de SellersSection (Foto profesional, Drone, 360°, PDF) ya está cubierto en SellProposal con los tags y los 4 pasos. Removerla reduce scroll innecesario y mantiene el mensaje más impactante.

### 2.6 Reviews con más credibilidad
Agregar iniciales/avatar circular, rating agregado ("4.9 ★ basado en 47 reseñas"), y link "Ver en Google".

### 2.7 Hero font-size mobile fix
Reducir `clamp(52px,7vw,120px)` a `clamp(40px,7vw,100px)` para que los CTAs sean visibles sin scroll en mobile.

---

## Archivos a Modificar

1. **Nuevo: `src/lib/constants.ts`** — constantes de contacto centralizadas
2. **HeroSection.tsx** — CTAs funcionales con smooth scroll, font-size fix
3. **Navigation.tsx** — smooth scroll en links, agregar `#contacto` target
4. **FeaturedProperties.tsx** — agregar flechas de navegación y botón "Ver todas"
5. **StatsBar.tsx** — mejorar labels ambiguas
6. **ReviewsSection.tsx** — agregar avatares, rating global, link Google
7. **Footer.tsx** — agregar `id="contacto"`, usar constantes centralizadas
8. **Index.tsx** — eliminar import de SellersSection
9. **Todos los componentes con WhatsApp** — usar constante centralizada
10. **ValuationTool.tsx** — usar constante centralizada

