

## Analisis Exhaustivo: Web Analia Daconte Inversiones Inmobiliarias

---

### ERRORES Y BUGS ACTIVOS

**1. Filtros de /propiedades rotos en desktop**
Los selects de Tipo, Dormitorios y Ordenar se renderizan a ancho completo (full-width), uno debajo del otro, en vez de inline. Esto ocurre porque los `<select>` no tienen restriccion de ancho y el flex container los deja crecer. En el screenshot se ven 3 filas de selects apilados.

**2. forwardRef warning en Footer**
La consola muestra `Function components cannot be given refs` para `SectionTitle` dentro de `Footer.tsx`. El componente `SectionTitle` es una funcion simple que recibe ref implicitamente de algun parent (probablemente framer-motion). Necesita ser envuelto en `forwardRef` o el parent no deberia pasarle ref.

**3. Hero CTA "Quiero comprar" apunta a anchor `#propiedades` (smoothScrollTo("propiedades"))** pero no hay ningun elemento con `id="propiedades"` visible en la home porque `FeaturedProperties` usa `id="propiedades"`. Pero el CTA deberia navegar a `/propiedades`. Actualmente scrollea a la seccion de destacadas en home, lo cual es confuso.

**4. Hero CTA "Quiero vender" apunta a `smoothScrollTo("tasacion")` pero la seccion de tasacion fue removida de Index** (comentario en linea 50: "ValuationTool removed"). El boton no hace nada.

**5. Footer link "/vender" da 404** - quickLinks incluye `{ label: "Vender", to: "/vender" }` pero esa ruta no existe. Deberia ser `/tasaciones`.

**6. NotFound page no sigue el design system** - Es un div blanco con texto generico en ingles. Deberia tener el dark theme, Navigation, y texto en español.

**7. Datos de contacto son placeholder** - `WHATSAPP_NUMBER = "5492235000000"`, `PHONE = "+54 9 223 500-0000"`, `EMAIL = "info@analiadaconte.com.ar"` parecen datos falsos. Si son reales, ok. Si no, la web esta publicada con datos de contacto incorrectos.

**8. ClosedDeals usa imagenes de Unsplash genericas** - No son propiedades reales vendidas. Esto rompe la promesa de "operaciones concretadas" con fotos stock que no son de MdP.

**9. Mapa `/mapa` solo carga 21 propiedades** (PAGE_SIZE = 21) - Usa `useProperties(filters, 0)` que limita a la primera pagina. Un mapa deberia mostrar TODAS las propiedades con coordenadas.

**10. `externalSupabase.ts` tiene la anon key hardcodeada en el codigo fuente** - Aunque es la anon key (publica), es mejor practica usar variables de entorno. Ademas, hay DOS clientes Supabase: el de Lovable Cloud y el externo, lo que puede confundir.

---

### MEJORAS DE UX/UI

**11. Navigation: falta indicador de pagina activa**
Los links de nav no muestran cual esta activo. Agregar un underline o cambio de color al link correspondiente a la ruta actual.

**12. Navigation: link "Propiedades" va a `/propiedades` pero no esta en navLinks**
El nav tiene `{ label: "Propiedades", href: "/propiedades" }` - esto esta ok. Pero falta un link a "Mapa" que es una funcionalidad importante.

**13. Filtros: layout desktop roto**
Los selects y pills necesitan ancho fijo o `flex-shrink-0` para mantenerse en una fila. Actualmente los selects crecen al 100% del container.

**14. Filtros: no hay indicador visual de filtros activos**
Cuando se selecciona un tipo o dormitorios, los selects nativos no muestran estado activo claramente. Seria mejor usar pills customizados o al menos un estilo distinto.

**15. PropertyCard: el precio "USD 350.000" se superpone con la imagen en ciertas resoluciones**
El precio esta posicionado absolute en bottom-3 left-4 sobre la imagen, pero el gradient overlay puede no ser suficiente con imagenes claras.

**16. Falta breadcrumb en pagina de detalle**
Solo hay un link "Volver al catalogo". Un breadcrumb tipo "Inicio > Propiedades > [Titulo]" mejora la navegacion y el SEO.

**17. Pagina de detalle: descripcion sin formato**
Las descripciones del scraper vienen como texto plano largo. Seria util detectar y formatear listas, separar en parrafos, y limpiar caracteres raros.

**18. Tasaciones: el wizard envia todo por WhatsApp**
No hay persistencia en base de datos. Si Analia quiere ver las solicitudes de tasacion, se pierden. Deberia guardarse en una tabla `tasacion_solicitudes`.

**19. Falta pagina de "Vender"**
El Footer linkea a `/vender` que no existe. Deberia crearse una landing page para vendedores (expandiendo SellProposal) o redirigir a `/tasaciones`.

---

### FUNCIONALIDADES FALTANTES PARA SER "LA MEJOR WEB INMOBILIARIA DE MDP"

**20. Busqueda por barrio/zona con autocompletado**
Las inmobiliarias top tienen un buscador con sugerencias de barrios. Extraer barrios unicos limpios de la DB y mostrar como sugerencias.

**21. Favoritos / Guardados**
Permitir marcar propiedades como favoritas (localStorage para anonimos, DB para logueados). Muy comun en portales inmobiliarios.

**22. Comparador de propiedades**
Seleccionar 2-3 propiedades y compararlas lado a lado (precio, m2, features).

**23. Alertas de nuevas propiedades**
Formulario "Avisame cuando haya propiedades que matcheen X criterios" guardado en DB + notificacion.

**24. Calculadora de credito hipotecario**
Widget que calcula cuota estimada segun precio, enganche y tasa. Muy util para compradores.

**25. Tour virtual / Video embed**
El campo `url_original` podria linkear a tours 360. Agregar soporte para embed de video/tour en la pagina de detalle.

**26. Blog / Guias inmobiliarias**
Secciones de contenido como "Guia para comprar tu primera propiedad en MdP", "Barrios mas buscados de MdP". Mejora SEO organico enormemente.

**27. Formulario de contacto en detalle de propiedad**
Ademas del WhatsApp, un formulario email embebido en la sidebar para consultas formales. Guardar en DB.

**28. PDF descargable de propiedad**
Boton "Descargar ficha PDF" con los datos, fotos y mapa de la propiedad. Muy profesional.

**29. Historial de precios / Indicador de mercado**
Mostrar si el precio bajo/subio (si hay datos historicos) o al menos un indicador de "precio por m2" vs promedio de zona.

**30. Reviews de Google en tiempo real**
Actualmente las reviews estan hardcodeadas. Podrian actualizarse periodicamente via edge function que consulte Google Places API.

---

### MEJORAS TECNICAS Y RENDIMIENTO

**31. SEO: meta tags dinamicas por pagina**
Solo la home tiene meta tags. `/propiedades`, `/propiedad/:slug`, `/tasaciones`, `/mapa` necesitan titulo y descripcion unicos. Usar react-helmet-async.

**32. SEO: sitemap.xml y robots.txt dinamico**
El robots.txt existe pero esta vacio o basico. Falta un sitemap con todas las URLs de propiedades para indexacion.

**33. Suspense fallback es `null`**
Todas las rutas lazy muestran nada mientras cargan. Deberia haber un loading skeleton que mantenga el layout (Navigation + spinner o skeleton).

**34. Accesibilidad: skip-to-content link**
No hay link "Saltar al contenido" para screen readers.

**35. Accesibilidad: alt texts genericos**
Muchas imagenes usan `alt=""` o textos genericos. Las fotos de propiedades deberian tener alt descriptivo.

**36. Performance: imagenes de propiedades sin optimizar**
Las fotos vienen directo del scraper sin resize. Deberian pasar por un CDN con transformaciones (width, quality, format webp).

**37. Error handling global**
No hay error boundary. Si un componente falla, toda la app crashea. Agregar React Error Boundary con UI de fallback.

**38. Analytics**
No hay tracking de ningun tipo. Para una web comercial, es critico tener Google Analytics o similar para medir trafico, conversiones, etc.

---

### PLAN DE IMPLEMENTACION (Priorizado)

#### Fase A: Bugs criticos (rompen funcionalidad)
1. Fix filtros desktop (selects inline)
2. Fix Hero CTAs (navegar a `/propiedades` y `/tasaciones`)  
3. Fix Footer link `/vender` -> `/tasaciones`
4. Fix mapa: cargar todas las propiedades, no solo 21
5. Fix forwardRef warning en Footer

#### Fase B: UX esencial
6. NotFound page con design system + español
7. Nav: indicador de pagina activa
8. Suspense fallback con skeleton
9. Filtros: mejorar layout y estados activos
10. Descripcion de propiedad: formateo y limpieza

#### Fase C: Funcionalidades competitivas
11. Favoritos (localStorage)
12. Formulario de contacto en detalle (guardar en DB)
13. Guardar solicitudes de tasacion en DB
14. Calculadora de credito hipotecario
15. Nav link al mapa

#### Fase D: SEO y performance
16. Meta tags dinamicas por pagina (react-helmet-async)
17. Sitemap.xml con propiedades
18. Error boundary global
19. CDN de imagenes o proxy con resize
20. Accesibilidad (skip link, alt texts, aria labels)

#### Fase E: Diferenciadores
21. Alertas de propiedades (email notifications)
22. Comparador de propiedades
23. Blog / guias
24. PDF de ficha de propiedad
25. Reviews de Google en tiempo real

---

### Archivos a crear/modificar por fase

**Fase A**: `PropertyFilters.tsx`, `HeroSection.tsx`, `Footer.tsx`, `Mapa.tsx`, `useProperties.ts`
**Fase B**: `NotFound.tsx`, `Navigation.tsx`, `App.tsx`, `PropiedadDetalle.tsx`
**Fase C**: Nuevo `hooks/useFavorites.ts`, nuevo `components/ContactForm.tsx`, nuevo `components/MortgageCalculator.tsx`, migration SQL para `tasacion_solicitudes`
**Fase D**: Instalar `react-helmet-async`, nuevo `components/ErrorBoundary.tsx`, nuevo edge function para sitemap
**Fase E**: Migration SQL para `alertas_propiedades`, nuevo `pages/Blog.tsx`, edge function para Google Places

