

# Reseñas Reales de Google — Rediseño Premium

## Enfoque

Dado que no podemos hacer un embed directo de Google Reviews (requiere API key o servicio de terceros como Featurable), la mejor opción para mantener el control total del diseño premium es **hardcodear las reseñas reales** de los screenshots que compartiste, **imitando fielmente el estilo visual de Google Reviews** pero adaptado a la estética oscura/gold del sitio.

Esto es lo que hacen la mayoría de sitios premium inmobiliarios — reseñas reales con datos exactos, enlace a Google para verificación, y diseño propio que se integra con la marca.

## Reviews a incluir (de los screenshots)

1. **Pablo Lech** — "Hola, es muy recomendable, la atención personalizada ayuda en el proceso de venta. Analia es una martillera de trayectoria en la ciudad, la cual nos da tranquilidad."
2. **Maria Bohn** — "Analia la mejor una grande"
3. **Natalia Rodriguez** — "Si bien uno busca trayectoria y reputación en el mercado inmobiliario porque eso supone experiencia y responsabilidad...la Ética profesional de Analía Daconte combinación perfecta con su empatía, y entrega absoluta..."
4. **Marcelo Pili** — "La mejor inmobiliaria de mar del plata!!"
5. **Anabela Vacotto** — "Excelente inmobiliaria"
6. **Daniel Bichi** — "muy bien atendido por Analia. realmente se preocupa y atiende al cliente. La recomiendo"
7. **Ernesto Ibarzabal** — "Fue un gusto haber sido atendido por ella!!!"

## Diseño

### Cards estilo Google (adaptadas al tema)
- Avatar circular con inicial y color de fondo (imitando Google: verde, azul, etc.)
- Nombre en bold + "Google Review" debajo en muted
- 5 estrellas doradas (como Google)
- Texto de la reseña
- Fecha relativa ("Hace 4 meses", "Hace 11 meses", etc.)

### Layout
- **Carousel horizontal** con scroll suave (usando CSS snap o Embla que ya está instalado) — más premium que una grilla estática, y permite mostrar las 7 reseñas sin abrumar
- En desktop: 3 cards visibles, en mobile: 1 card con swipe
- Navegación con flechas sutiles a los lados

### Header de sección
- Badge de Google con logo SVG inline (la "G" de colores) + "4.9" + estrellas + "basado en 47 reseñas"
- Título: "Reseñas en Google" (reemplaza "Lo que dicen nuestros clientes")
- Link "Ver todas en Google" al final apuntando al perfil real

### Estrellas sutiles en el Hero
- Agregar un badge compacto debajo del CTA del hero: una línea con el ícono G de Google + "4.9 ★★★★★ en Google" — pequeño, sutil, premium

## Archivos a modificar

1. **`src/components/sections/ReviewsSection.tsx`** — reescritura completa con datos reales, carousel con Embla, cards estilo Google, badge de rating
2. **`src/components/sections/HeroSection.tsx`** — agregar badge sutil de Google rating debajo de los CTAs

