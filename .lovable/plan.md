
# Performance Optimization Plan

## Issues Found

### 1. CustomCursor -- re-renders on every mouse move
- `isVisible` is in the `useEffect` dependency array, causing the effect to re-register every time visibility changes
- Using React state (`useState`) for visibility triggers re-renders; should use `useMotionValue` for opacity instead
- Fix: Remove `isVisible` from deps, use a ref for first-show logic, use `useMotionValue` for opacity

### 2. MagneticButton -- setState on every mousemove
- `setPosition({ x, y })` triggers a full React re-render on every single mouse movement
- Fix: Replace `useState` with two `useMotionValue` instances (`mx`, `my`) and a `useSpring` wrapper, update via `.set()` which bypasses React rendering entirely

### 3. HeroSection -- useTransform created inside JSX
- `useTransform(scrollYProgress, ...)` is called inline inside JSX for the background text parallax, which creates a new motion value on every render
- Fix: Move it to a named variable alongside the other `useTransform` calls at the top of the component

### 4. ParticleField -- too many animated DOM nodes
- 25 particles with CSS `animation` each running infinitely
- Fix: Reduce to 15 particles, add `will-change: transform` so the browser composites them on GPU, and use `contain: strict` on the container

### 5. FeaturedProperties -- inline style tag per card
- Each card renders an inline `<style>` tag for the WhatsApp hover effect, creating/destroying style elements during scroll
- Fix: Remove the inline `<style>` tags entirely; use a proper CSS class with `group-hover:opacity-100` in Tailwind instead

### 6. Navigation scroll listener -- not passive
- The scroll event listener isn't marked as `{ passive: true }`
- Fix: Add `{ passive: true }` to `addEventListener`

### 7. WhatsAppFAB pulse -- Framer Motion overhead for simple loop
- The infinite pulse ring uses Framer Motion's `animate` prop with `repeat: Infinity`, which keeps the Framer animation loop running forever
- Fix: Replace with a CSS `@keyframes` animation for the pulse ring (zero JS cost)

### 8. General GPU hints
- Add `will-change: transform` to ScrollProgress bar and CustomCursor elements
- Add CSS `contain: content` to heavy sections (ClosedDeals grid, FeaturedProperties scroll container) to limit paint/layout scope

---

## Implementation Plan

### Task 1: Fix CustomCursor (zero-lag cursor)
- Replace `useState(isVisible)` with `useMotionValue(0)` for opacity
- Use a `useRef(false)` for the first-show flag instead of state
- Remove `isVisible` from the `useEffect` dependency array (only keep spring values)
- Add `will-change: transform` to both cursor divs

### Task 2: Fix MagneticButton (no re-renders on hover)
- Replace `useState({ x, y })` with `useMotionValue(0)` for x and y
- Wrap each in `useSpring(mv, { stiffness: 150, damping: 15, mass: 0.1 })`
- Update values via `.set()` in `onMouseMove` -- zero React re-renders
- Pass spring values to `style={{ x: springX, y: springY }}` instead of `animate`

### Task 3: Fix HeroSection inline useTransform
- Move the background text `useTransform` call out of JSX into a named const at the top of the component

### Task 4: Optimize ParticleField
- Reduce particle count from 25 to 15
- Add `will-change: transform` and `contain: strict` to the container
- Increase minimum animation duration to 20s (slower = fewer compositor updates)

### Task 5: Fix FeaturedProperties inline styles
- Remove all inline `<style>` tags from the card render
- Add `opacity-0 group-hover:opacity-100 transition-opacity` classes to the WhatsApp button instead
- Remove `whileHover` scale on cards; replace with CSS `hover:scale-[1.02]` and `transition-transform` (cheaper than Framer Motion spring per card)

### Task 6: Passive scroll listener in Navigation
- Change `addEventListener("scroll", onScroll)` to `addEventListener("scroll", onScroll, { passive: true })`

### Task 7: CSS-only WhatsApp pulse
- Replace the Framer Motion animated pulse div with a plain `<div>` using a CSS `@keyframes whatsapp-pulse` animation
- Add the keyframes to `index.css`

### Task 8: GPU hints in CSS
- Add `will-change: transform` to `.fixed` cursor/progress elements
- Add CSS `contain: content` to section containers with many children

---

## Files Modified
- `src/components/CustomCursor.tsx` -- rewrite spring/visibility logic
- `src/components/MagneticButton.tsx` -- useMotionValue instead of useState
- `src/components/sections/HeroSection.tsx` -- move useTransform out of JSX
- `src/components/ParticleField.tsx` -- reduce count, add GPU hints
- `src/components/sections/FeaturedProperties.tsx` -- remove inline styles, CSS hover
- `src/components/sections/Navigation.tsx` -- passive listener
- `src/components/WhatsAppFAB.tsx` -- CSS pulse
- `src/index.css` -- add whatsapp-pulse keyframes, GPU hint utilities
