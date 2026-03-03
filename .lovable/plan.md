

# Image Placement Plan — Strategic Analysis

## Psychological Analysis of the Ideal Client

The target client is a property owner or buyer in Mar del Plata, aged 35-60, upper-middle class. They need to feel:
- **Trust**: Real photos of the office/team prove legitimacy (vs. stock photos)
- **Local expertise**: Aerial shots of MdP say "I know every corner of this city"
- **Premium service**: The Chesterfield lounge and modern office convey high-end treatment
- **Human connection**: Seeing the team celebration creates emotional warmth

## Image-to-Section Mapping

| Image | Content | Placement | Rationale |
|-------|---------|-----------|-----------|
| `315b676b` | Vibrant aerial MdP (wider, bluer sky) | **Hero background** | First impression = "this is Mar del Plata". Drone perspective conveys authority and scope |
| `7c3bb4b3` | Aerial coastline MdP | **DualPath — Compradores panel** | Buyers want to see the city they're investing in. Beach + buildings = lifestyle promise |
| `c47e5c07` | Wide office (desk + Chesterfield) | **DualPath — Vendedores panel** | Sellers see a professional workspace. Signals "your property is in capable hands" |
| `034e342f` | Chesterfield lounge close-up | **SellProposal background** | Premium ambiance behind the sales pitch. The warm lighting + marble wall = luxury service |
| `8bc3e75c` | Team celebration/inauguration | **AboutSection — main photo** | Replaces stock portrait. Shows the real team, builds human connection and trust |
| `a82cb95f` | Private office with antique desk | **AboutSection — secondary photo** (new addition below main) | Shows the actual workspace where deals happen. Antique furniture = tradition + experience |
| `ebe4131e` | Waiting room with modern furniture | **ReviewsSection background** | Subtle background behind reviews. Clients see where they'd sit — makes testimonials feel real |

**Not placed on the page**: The MP4 video file — can be used later as a hero video replacement.

## Files to Modify

1. **Copy all 7 images + video to `public/images/`**
2. **HeroSection.tsx** — replace Unsplash URL with `/images/mdp-aerial-hero.jpg`
3. **DualPathSection.tsx** — replace both panel backgrounds with real photos
4. **SellProposal.tsx** — replace background with Chesterfield lounge
5. **AboutSection.tsx** — replace portrait with team photo, add secondary office photo below
6. **ReviewsSection.tsx** — add subtle office background behind reviews

ClosedDeals and FeaturedProperties keep their Unsplash images (those represent actual properties — will be replaced when real listing photos arrive).

## Technical Details

- All images copied to `public/images/` for direct CSS `url()` references (since most are used as background-image, not React imports)
- Team photo in AboutSection used as `<img>` tag — also goes to `public/images/`
- Aspect ratios preserved; `object-fit: cover` and `object-position: center` handle cropping
- All images get `loading="lazy"` where applicable

