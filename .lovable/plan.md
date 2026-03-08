

# Smooth & Optimized Loading, Scroll, and Sections

## Problems Found

1. **Single Suspense boundary** wraps 8 lazy sections — they all block until the largest one loads. No progressive rendering.
2. **No `content-visibility: auto`** on below-fold sections — browser renders all DOM even when off-screen.
3. **No `prefers-reduced-motion` support** — users with motion sensitivity get full parallax, particles, and cursor animations.
4. **Navigation scroll listener fires on every pixel** without throttle/rAF.
5. **`smoothScrollTo` is basic** — no fallback for browsers without smooth scroll support, and no way to cancel mid-scroll.
6. **Framer Motion parallax in HeroSection** (`useScroll` + `useTransform`) is fine on desktop but unnecessary overhead on mobile where parallax is barely visible.
7. **DualPathSection** animates from `x: -100` / `x: 100` — on slow devices this causes paint storms. Should use `transform` only with `will-change`.
8. **Missing `contain-intrinsic-size`** means `content-visibility: auto` would cause layout jumps without it.

## Plan

### 1. Progressive lazy loading — split Suspense boundaries
**File: `src/pages/Index.tsx`**
- Wrap each lazy section in its own `<Suspense fallback={null}>` so they render independently as they load.
- Group only tightly-coupled pairs (e.g., StatsBar right after DualPath can share one boundary).

### 2. CSS `content-visibility: auto` for off-screen sections
**File: `src/index.css`**
- Add a utility class `.section-lazy` with `content-visibility: auto` and `contain-intrinsic-size: 0 600px` (approximate height).
- Apply to all sections below the fold (DualPath, StatsBar, FeaturedProperties, SellProposal, About, ClosedDeals, Reviews, ValuationTool, Footer).
- This tells the browser to skip rendering off-screen sections entirely until they scroll into view — massive paint savings.

### 3. `prefers-reduced-motion` support
**File: `src/index.css`**
- Add `@media (prefers-reduced-motion: reduce)` block that:
  - Disables `scroll-behavior: smooth` → `auto`
  - Sets all `animation: none`
  - Hides ParticleField and CustomCursor

**File: `src/components/CustomCursor.tsx`**
- Check `prefers-reduced-motion` and return `null` if matched.

**File: `src/components/ParticleField.tsx`**
- Same check — skip particles for reduced-motion users.

**File: `src/components/sections/HeroSection.tsx`**
- Disable parallax (`bgY`, `textY`) for reduced-motion users by returning static values.

### 4. Throttle Navigation scroll listener with rAF
**File: `src/components/sections/Navigation.tsx`**
- Replace raw scroll listener with a `requestAnimationFrame` throttle to avoid layout thrashing. Only update `scrolled` state when value actually changes.

### 5. Optimized smooth scroll
**File: `src/lib/smoothScroll.ts`**
- Add `scroll-behavior: smooth` to `<html>` in CSS as base.
- Keep JS `scrollIntoView` but add a check: if `prefers-reduced-motion` is set, use `behavior: "auto"`.

### 6. Disable parallax on mobile in HeroSection
**File: `src/components/sections/HeroSection.tsx`**
- Use `useIsMobile()` hook. On mobile, set `bgY`, `textY`, `bgTextY` to static `"0%"` — saves Framer Motion from running per-frame transforms on low-power devices.

### 7. GPU layer promotion for animated sections
**File: `src/index.css`**
- Add `.gpu-layer { will-change: transform; transform: translateZ(0); }` utility.
- Apply to DualPathSection panels, FeaturedProperties horizontal scroll container, and ReviewsSection carousel — ensures composited layers for smooth animations.

### 8. Add `contain: content` to remaining sections
**Files: StatsBar, SellProposal, AboutSection, ValuationTool, ValuationCTA**
- Several sections already have `contain: content`. Add it to the ones missing it so the browser isolates their layout/paint.

## Files to modify

| File | Changes |
|---|---|
| `src/pages/Index.tsx` | Individual Suspense boundaries per section |
| `src/index.css` | `.section-lazy` (content-visibility), `prefers-reduced-motion`, `.gpu-layer`, `scroll-behavior: smooth` on html |
| `src/components/sections/Navigation.tsx` | rAF-throttled scroll listener |
| `src/components/sections/HeroSection.tsx` | Disable parallax on mobile, reduced-motion check |
| `src/components/CustomCursor.tsx` | Reduced-motion early return |
| `src/components/ParticleField.tsx` | Reduced-motion early return |
| `src/lib/smoothScroll.ts` | Respect reduced-motion preference |
| `src/components/sections/DualPathSection.tsx` | Add `section-lazy` class |
| `src/components/sections/StatsBar.tsx` | Add `section-lazy`, `contain: content` |
| `src/components/sections/FeaturedProperties.tsx` | Add `section-lazy` |
| `src/components/sections/SellProposal.tsx` | Add `section-lazy` |
| `src/components/sections/AboutSection.tsx` | Add `section-lazy`, `contain: content` |
| `src/components/sections/ClosedDeals.tsx` | Add `section-lazy` |
| `src/components/sections/ReviewsSection.tsx` | Add `section-lazy` |
| `src/components/sections/ValuationTool.tsx` | Add `section-lazy` |
| `src/components/sections/Footer.tsx` | Add `section-lazy` |

