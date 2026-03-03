

# Performance & Image Optimization Plan

## Current Issues

1. **Raw JPG images** — uploaded photos are uncompressed originals (likely 2-5MB each). No `<link rel="preload">` for the hero image.
2. **No lazy loading for below-fold sections** — all 10+ sections render on first paint, including heavy framer-motion animations.
3. **ParticleField** — 15 DOM nodes with `willChange: "transform"` each = 15 compositor layers permanently allocated. Wasteful.
4. **Unsplash images** in FeaturedProperties/ClosedDeals use `w=600&q=80` and `w=400&q=80` — decent but no `srcSet` or size hints.
5. **No image dimensions** — causes Cumulative Layout Shift (CLS). No `width`/`height` on any `<img>`.
6. **Unused `App.css`** — default Vite boilerplate still loaded.
7. **Font loading** — Google Fonts loads synchronously (render-blocking). No `font-display: swap` control.
8. **Background images** — DualPath, SellProposal, Reviews all load background images inline via CSS `url()` with no lazy strategy.
9. **No hero image preload** — the most critical image (`mdp-aerial-hero.jpg`) competes with fonts and JS for bandwidth.

## Plan

### 1. Preload hero image in `index.html`
Add `<link rel="preload" as="image" href="/images/mdp-aerial-hero.jpg">` so the browser fetches it immediately. Add `fetchpriority="high"` hint. Also add `&display=swap` to Google Fonts URL.

### 2. Lazy load below-fold sections with React.lazy + Suspense
Wrap sections after HeroSection in `React.lazy()` so their JS doesn't block initial paint:
- `DualPathSection`, `StatsBar`, `FeaturedProperties`, `SellProposal`, `AboutSection`, `ClosedDeals`, `ReviewsSection`, `ValuationTool`, `Footer`

### 3. Optimize ParticleField
Remove `willChange: "transform"` from individual particles (CSS animations don't need it when using `transform`). Reduce from 15 to 8 particles on mobile via `useIsMobile()`.

### 4. Add image dimensions to prevent CLS
Add explicit `width` and `height` attributes to all `<img>` tags in AboutSection, ClosedDeals, FeaturedProperties.

### 5. Convert background images to lazy `<img>` where possible
For DualPath panels and ReviewsSection, use an `<img loading="lazy">` behind an overlay `<div>` instead of CSS `background-image` (which can't be lazy-loaded by the browser).

### 6. Optimize Unsplash URLs
Change FeaturedProperties images to `w=500&q=70&auto=format` and ClosedDeals to `w=350&q=70&auto=format` (auto=format serves WebP when supported).

### 7. Delete unused `App.css`
Remove `src/App.css` — it's default Vite boilerplate not imported anywhere meaningful.

### 8. Add `contain: content` to heavy sections
Add CSS containment to StatsBar, ClosedDeals, ReviewsSection, SellProposal to limit browser layout/paint scope.

### 9. Mobile-specific optimizations
- Disable `CustomCursor` completely on touch (already done, but ensure zero JS runs)
- Reduce particle count on mobile
- Add `touch-action: pan-y` to scrollable areas

### 10. Font loading optimization
Add `&display=swap` to Google Fonts link in `index.html` (already present in URL but verify). Add `<link rel="preconnect">` for Unsplash CDN (`images.unsplash.com`).

## Files to Modify

1. **`index.html`** — preload hero image, preconnect Unsplash, font display swap
2. **`src/pages/Index.tsx`** — React.lazy + Suspense for below-fold sections
3. **`src/components/ParticleField.tsx`** — remove willChange, reduce count on mobile
4. **`src/components/sections/DualPathSection.tsx`** — convert bg-image to lazy `<img>`
5. **`src/components/sections/ReviewsSection.tsx`** — convert bg-image to lazy `<img>`
6. **`src/components/sections/SellProposal.tsx`** — convert bg-image to lazy `<img>`
7. **`src/components/sections/AboutSection.tsx`** — add img dimensions
8. **`src/components/sections/FeaturedProperties.tsx`** — optimize Unsplash URLs, add dimensions
9. **`src/components/sections/ClosedDeals.tsx`** — optimize Unsplash URLs, add dimensions
10. **Delete `src/App.css`**
11. **`src/index.css`** — add containment utilities

