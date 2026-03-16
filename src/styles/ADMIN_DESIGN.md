# Admin Panel — Design System (Light Theme)

> Tema claro con acento púrpura. Versión aplicada: marzo 2026.

---

## Fondos

| Token | Valor | Uso |
|---|---|---|
| Fondo general | `bg-[#f8f7fc]` | `AdminLayout` wrapper principal |
| Sidebar / Topbar | `bg-white` | Barras de navegación |
| Cards / Panels | `bg-white` | Tarjetas, dialogs, dropdowns |
| Área tenue | `bg-gray-50` | Hover rows, kanban col, secciones |
| Inputs | `bg-white` | Campos de formulario |
| Badges neutros | `bg-gray-100` | Estados inactivos, contadores |

## Texto

| Token | Uso |
|---|---|
| `text-gray-900` | Títulos principales, valores |
| `text-gray-800` | Títulos secundarios |
| `text-gray-700` | Texto contenido, celdas |
| `text-gray-600` | Labels topbar, nombres portal |
| `text-gray-500` | Labels uppercase, table headers |
| `text-gray-400` | Hints, subtextos, fecha |
| `text-gray-300` | Iconos débiles, divisores |

## Bordes

| Token | Uso |
|---|---|
| `border-gray-100` | Divisores sutiles (sidebar, topbar) |
| `border-gray-200` | Cards, inputs, tabla |
| `border-gray-300` | Hover cards, hover inputs |

## Acento de Marca (Mantener siempre)

| Token | Uso |
|---|---|
| `bg-purple-600` | Botones primarios |
| `hover:bg-purple-700` | Hover botones |
| `bg-purple-50` | Fondo activo nav, tab activo, focus items |
| `bg-purple-100` | Avatar, icon login |
| `text-purple-600` | Texto activo, icon login |
| `text-purple-700` | Nav activo, tab activo, badge operación Venta |
| `text-purple-500` | Iconos activos nav |
| `border-purple-500` | Borde nav item activo |
| `border-purple-200` | Borde elemento activo |

## Nav Item Activo (Sidebar)

```
bg-purple-50 text-purple-700 border-l-2 border-purple-500
```

## Estados semánticos

| Estado | Background | Texto |
|---|---|---|
| Éxito / Disponible / Activo | `bg-emerald-50` | `text-emerald-700` |
| Info / Consulta | `bg-sky-50` | `text-sky-700` |
| Alerta / Sin leer / Reservado | `bg-amber-50` | `text-amber-700` |
| Progreso / Normal | `bg-blue-50` | `text-blue-700` |
| Error / Alta prioridad | `bg-red-50` | `text-red-700` |
| Inactivo / Neutral / Vendido | `bg-gray-100` | `text-gray-500` |
| Baja prioridad | `bg-gray-100` | `text-gray-500` |

## Operación inmobiliaria

| Tipo | Background | Texto |
|---|---|---|
| Venta | `bg-purple-50` | `text-purple-700` |
| Alquiler | `bg-sky-50` | `text-sky-700` |
| Alquiler Temporario | `bg-orange-50` | `text-orange-700` |

## Origen contactos/mensajes

| Origen | Background | Texto |
|---|---|---|
| zonaprop | `bg-purple-50` | `text-purple-700` |
| mercadolibre | `bg-amber-50` | `text-amber-700` |
| web | `bg-sky-50` | `text-sky-700` |
| whatsapp | `bg-emerald-50` | `text-emerald-700` |
| manual | `bg-gray-100` | `text-gray-500` |

## Inputs / Formularios

```
bg-white border-gray-200 text-gray-900 placeholder:text-gray-400
focus-visible:ring-purple-500/30 focus-visible:border-purple-400
```

## Dropdowns / SelectContent

```
bg-white border-gray-200 shadow-md
SelectItem: text-gray-700 focus:bg-purple-50 focus:text-purple-700
```

## Tabla

```
Header row:   bg-gray-50 text-gray-500 border-b border-gray-100
Data row:     hover:bg-gray-50 border-b border-gray-100
Cell text:    text-gray-700 / text-gray-800
```

## Dialogs / Modals

```
bg-white border-gray-200 text-gray-900
```

## Topbar

```
bg-white border-b border-gray-100 shadow-sm
texto: text-gray-600
avatar: bg-purple-100 text-purple-600
```

## Sidebar

```
bg-white border-r border-gray-100
nav inactive: text-gray-500 hover:bg-gray-50 hover:text-gray-700
nav active:   bg-purple-50 text-purple-700 border-l-2 border-purple-500
```

## Chart (recharts)

```
stroke:     #7c3aed  (purple-700)
gradient:   purple-700 → transparent (opacity 0.2→0)
tooltip:    bg-white border-gray-200 shadow text-gray-700
axis tick:  #9ca3af (gray-400)
```

## Login Page

```
fondo:   bg-gray-50
card:    bg-white border border-gray-200 shadow-sm rounded-2xl p-6
icon:    bg-purple-100 text-purple-600 rounded-xl
```

---

> **Nota:** El tema oscuro anterior usaba `#0f0f12`, `#13131a`, `#1a1a24` con `text-white/XX` y `border-white/XX`. Todos esos valores fueron reemplazados. NO regresar a dark theme sin actualizar este documento.
