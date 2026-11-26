# Baba Travels & Tours — Frontend (React · MERN-ready)

Production frontend for **Baba Travels & Tours**: glassmorphism navbar, 3D split-panel flip hero carousel,
dark/light themes, mobile-first layout, and SEO/GEO/AIO baked in (static prerender + JSON-LD + llms.txt).

## Run (Ubuntu)

```bash
cd client
npm install
npm run dev          # http://localhost:5173
npm run build        # client build + SSR build + prerender every route to static HTML
npm run preview      # serve dist/client on http://localhost:4173
```

Node 18+ (tested on Node 22). Deploy `dist/client/` to any static host (Nginx, Vercel, Netlify, Cloudflare Pages).
For Nginx, use `try_files $uri $uri/index.html /404.html;`.

## Connecting the Express API (the "E" and "N" of MERN)

Forms call `src/lib/api.js → POST ${VITE_API_URL}/api/leads`. Without `VITE_API_URL` they simulate success
so the UI can be reviewed. Create `client/.env`:

```
VITE_API_URL=https://api.babatravels.pk
```

Payload: `{ type: 'quote' | 'contact', service, from, to, date, adults, children, budget, name, phone, email, notes, source }`.

## Before launch — replace placeholders

Everything the client must confirm lives in **`src/data/site.js`** (search for `CONFIRM`):
phone, WhatsApp, email, office addresses + geo, licence/IATA numbers, prices, stats, reviews, domain.
NAP (name/address/phone) must match the Google Business Profile exactly.

**Hero images:** replace files in `public/images/hero/` keeping the same names
(`<name>-1920.webp` 1920×1080, `<name>-1280.webp` 1280×720, `<name>-m.webp` 720×1280 portrait for phones,
`<name>-thumb.webp` 480×270). Current files are illustrated placeholders. Use real, licensed photos.
Export WebP at quality ~75; keep each 1920 under ~250 KB.

## Structure

```
src/
  data/site.js            all content (services, packages, destinations, FAQs, offices)
  components/
    HeroCarousel.jsx      3D split-panel flip carousel (see notes inside)
    Navbar.jsx            glass navbar, mega menus, mobile drawer, theme toggle, scroll progress
    BookingWidget.jsx     tabbed quick-quote widget → /quote prefilled
    Blocks.jsx            cards, route map, steps, stats, testimonials, FAQ, CTA, page hero
    Chrome.jsx            footer, mobile bottom bar, WhatsApp FAB, breadcrumbs, section heads
  pages/                  Home, Services, ServiceDetail, Packages, Destination, About, Contact, Quote, BlogPost, 404
  lib/seo.jsx             <Seo> + schema builders (TravelAgency, WebSite, FAQPage, BreadcrumbList, Service, TouristTrip, Article)
  lib/hooks.js            reveal-on-scroll, tilt, magnetic buttons, theme
  styles/                 tokens.css (design tokens) · base · components · sections
scripts/prerender.js      SSG: writes /route/index.html for every route + sitemap.xml + robots.txt
public/llms.txt           summary for AI assistants (GEO/AIO)
```

## SEO / GEO / AIO checklist (built in)

- Every route prerendered to real HTML (crawlers and AI bots read content without JS).
- One H1 per page; logical H2/H3; breadcrumbs on inner pages.
- Answer-first "Quick answer" block (40–60 words) on service, destination, about and guide pages.
- Key-facts tables (price, duration, best time, coverage) for easy extraction.
- Visible FAQ + FAQPage schema on home, service and destination pages.
- JSON-LD: TravelAgency (+ branch departments), WebSite, Service, TouristTrip with PKR Offer, BreadcrumbList, Article.
- Canonical, Open Graph, Twitter, hreflang `en-PK`, geo meta.
- `robots.txt` explicitly allows GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended.
- Guides show author + "last updated" (E-E-A-T).
- No text in images; descriptive alt text on content images.

## Animation notes (for developers)

| Element | Trigger | Duration / easing | Notes |
|---|---|---|---|
| Hero panel flip | autoplay 6.5 s, arrows, tabs, swipe, ←/→ | 1150 ms `cubic-bezier(.7,0,.2,1)`, 75 ms stagger, Z −220 px mid-flip | WAAPI, transform only; next image decoded first; pauses off-screen / tab hidden / hover |
| Hero headline | each slide | 1 s `cubic-bezier(.16,1,.3,1)`, 55 ms per word | CSS; H1 is static for SEO, display line rotates |
| Hero media | scroll | rAF parallax 0.28× + 22 s "breathe" scale | transform only |
| Scroll reveal | 8% into viewport | 0.8–1 s ease-out, per-item delay | hidden only when JS runs |
| Service / package cards | pointer move (desktop) | 0.5 s ease-out tilt ±7° + spotlight | disabled on touch + reduced motion |
| Route map | 25% visible | 1.6 s line draw, 90 ms stagger; planes via SVG animateMotion | hover/focus a city to highlight route |
| Counters | 40% visible | 1.6 s ease-out-quart | SSR renders final values |
| Theme toggle | click | 0.7 s circular reveal (View Transitions) | instant fallback |

`prefers-reduced-motion`: hero becomes a 400 ms crossfade, marquee becomes scrollable, all reveals instant.
