

# Visual & Legibility Audit — Home Page

## Problem Analysis (from the screenshot)

The screenshot reveals the core issue clearly: **the hero text is fighting a losing battle against the busy aerial photo**. The ocean, buildings, and bright sky create visual noise that makes "Encontrá tu próxima propiedad" and especially the subtitle nearly invisible. The navigation links at the top also disappear against the bright blue sky.

This isn't just the hero — there are legibility and visual hierarchy issues throughout the home.

---

## Issues & Fixes

### 1. Hero — Weak Overlay Gradient (Critical)
The current gradient is `rgba(12,11,15,0.3)` at top → `0.5` at center → `0.85` at bottom. The top half is nearly transparent, making the nav and eyebrow text invisible against the bright sky.

**Fix**: Strengthen the gradient significantly — `0.55` at top, `0.65` at center, `0.88` at bottom. This darkens the sky/buildings enough for white text to pop while still showing the photo through.

### 2. Hero — Background Position
The photo is centered, showing mostly buildings and parking lots in the middle. The ocean/coastline (the emotional hook) is pushed to the top edge.

**Fix**: Shift `backgroundPosition` to `center 30%` so the coastline is more prominent behind the text, and the less interesting parking area is cropped out at the bottom.

### 3. Navigation — Invisible Against Bright Sky
When not scrolled, the nav has `bg-transparent` — links vanish against the bright sky. Even the logo "AD" is hard to see.

**Fix**: Add a subtle top-to-bottom gradient behind the nav (even when not scrolled): `linear-gradient(to bottom, rgba(12,11,15,0.6) 0%, transparent 100%)` as a pseudo-element or inline style. This creates a natural vignette without looking like a bar.

### 4. Hero — Subtitle Too Dim
"25 años construyendo confianza en Mar del Plata" uses `text-text-secondary` which is `hsl(30, 3%, 52%)` — a mid-gray that's nearly invisible over a photo. 

**Fix**: Bump to `text-foreground/70` or `rgba(242,239,232,0.7)` — still secondary but legible.

### 5. Hero — "Quiero Vender" Outline Button Hard to See
The outline variant uses `border border-primary text-primary` — a thin 1px gold border over a photo background barely registers visually.

**Fix**: Increase border to `border-2` and add a subtle backdrop: `bg-white/5 backdrop-blur-sm` to give the outline button a frosted-glass base.

### 6. Hero — Eyebrow Text Too Small
`label-eyebrow` is 10px with 3px letter-spacing. At that size on a photo background, it's invisible.

**Fix**: Bump to 12px and add a subtle text-shadow: `0 1px 8px rgba(0,0,0,0.5)`.

### 7. Hero — Add Text Shadow to All Hero Text
Every text element in the hero sits over a photo. Even with a stronger gradient, a subtle `text-shadow` on the h1 and subtitle dramatically improves legibility without changing the aesthetic.

**Fix**: Add `textShadow: "0 2px 20px rgba(0,0,0,0.4)"` to the hero content wrapper.

### 8. DualPath — Overlay Too Dark
Both panels use `rgba(12,11,15,0.75)` overlay. The photos are almost invisible — defeats the purpose of having them.

**Fix**: Reduce to `0.65` and add a gradient (darker at bottom where text sits, lighter at top where photo shows).

### 9. Property Cards — "Consultar" Button Always Hidden
The WhatsApp "Consultar" button only appears on hover (`opacity-0 group-hover:opacity-100`). On mobile there's no hover — the button is permanently invisible.

**Fix**: On mobile, always show the button. Use `opacity-100 md:opacity-0 md:group-hover:opacity-100`.

### 10. StatsBar — Numbers Need More Visual Weight
The counters blend with the section. They need a stronger visual separation.

**Fix**: Add a subtle `textShadow: "0 0 30px rgba(196,154,60,0.3)"` to the gold numbers for a glow effect that reinforces the premium feel.

### 11. Section Backgrounds — Monotone Dark
Every section alternates between `#0C0B0F` and `#111015` — the difference is nearly imperceptible. The page feels like one continuous dark block.

**Fix**: Alternate more noticeably: keep `#0C0B0F` for primary sections, use `#151320` (slightly warmer/violet-tinted) for alternate sections. This creates visual rhythm without breaking the dark theme.

---

## Files to Modify

1. **HeroSection.tsx** — stronger gradient, background position, text shadows, eyebrow size
2. **Navigation.tsx** — add gradient overlay behind nav when not scrolled
3. **MagneticButton.tsx** — outline variant gets `border-2` + frosted glass
4. **DualPathSection.tsx** — lighter overlay with gradient
5. **FeaturedProperties.tsx** — mobile-visible Consultar button
6. **StatsBar.tsx** — gold glow on numbers
7. **src/index.css** — alternate section background token, eyebrow size bump

