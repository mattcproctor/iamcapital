# iAM Capital website

The full iamcapital.com site in Astro, rebuilt in October 2026 from the Brizy/WordPress backup, with the investments
map (previously its own site on iamcapital.vercel.app) as one of its pages. Static output, hosted on Vercel (iAM
Capital's Pro team), built from GitHub. Moved from Cloudflare Pages in October 2026.

- **Repository**: https://github.com/mattcproctor/iamcapital, branch `main` (production).
- **Hosting**: Vercel, Git integration. Framework Astro, build command `npm run build`, output directory `dist`, Node
  22.x (`vercel.json`, `package.json` engines). No environment variables are needed. Every push to `main` publishes;
  other branches get preview addresses. The production domain is the bare **iamcapital.com**; www.iamcapital.com
  redirects to it (301). Turn on Web Analytics in the project's Analytics tab (cookieless; `@vercel/analytics`'s
  `<Analytics />` in `Layout.astro`).
- **Design**: a faithful rebuild of the original Brizy design (see `.impeccable.md`), not a redesign. Measure against
  the archived pages before changing layout or styles.

## Commands

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # writes dist/ (about 160 MB, mostly PDFs and optimised images)
npm run preview
vercel dev        # serve the site with vercel.json's redirects and headers (needs `vercel link` first)
```

## Structure

```
astro.config.mjs        site https://iamcapital.com, trailing slashes, folder output; keeps vercel.json's redirects in step
                        with redirects.json (a local build rewrites them; a Vercel build stops if they're out of date)
redirects.json          the redirects from old WordPress addresses (to pages, PDFs or external articles): edit this one
vercel.json             Vercel settings: build, trailing slashes, security headers, long caching for /_astro/*, /fonts/*
                        and /video/*, and the redirects (generated: www -> bare domain, then redirects.json)
src/
  layouts/Layout.astro  <head> (SEO, social image, fonts, JSON-LD), header, footer
  components/           Header (main menu + per-page sub-menu), Footer, Banner (photo banner), PostGrid (document
                        cards, 8 per page), FundCard (accordion), Timeline, Icon (Font Awesome Free + Lucide)
  pages/
    index.astro                 home (background film public/video/hero-*.mp4, poster src/assets/video/hero-poster.jpg)
    about.astro                 who we are, regulatory, active/exited funds, history (anchors #who #management ...)
    investments.astro           the Google map + cards (see "Investments map")
    team.astro                  three groups; biographies open in a <dialog> pop-up
    responsibility.astro        ESG steps, certifications, legal PDFs (#esg, #legal)
    investor-relations.astro    shareholder notices, annual reports (#shareholder, #reports)
    latest-news.astro           press, events (#press, #events)
    contact.astro, cookie-policy.astro (approved by iAM, October 2026), 404.astro
    [slug].astro                28 property pages + 2 event pages at the WordPress addresses (/castel-porrona/ ...)
    sitemap.xml.ts              pages + linked PDFs, with dates
    llms.txt.ts, llms-full.txt.ts   plain-text site guide and full content for AI search (from src/lib/llms.ts)
  data/                 content extracted from WordPress (edit these to change content)
    shareholder-notices.json, annual-reports.json, press.json, events-news.json
                        documents (edited in Pages CMS): {title, date, pdf | link}; read via src/lib/content.ts
    properties/         one file per property (edited in Pages CMS): page content and map pin together;
                        the file name is the page address; read via src/lib/properties.ts
    funds.json          the About page's funds and category intros
    team.json, legal.json   team and policies (edited in Pages CMS), also read via src/lib/content.ts
    timeline.json, events.json, site.ts (nav, contact, footer links)
  lib/                  images.ts (upload('2023/01/x.jpg') -> optimised image), properties.ts, format.ts
  assets/uploads/       the 162 images the site uses, at their WordPress year/month paths (Astro optimises them)
  styles/               global.css (original fonts, colours, headings), investments.css (map), overpass.css (font)
public/
  wp-content/uploads/   the ~90 PDFs (and 4 map images) at their original paths, so old links keep working
  scripts/investments.js, images/ (branding, map property images), fonts/overpass/, robots.txt, llms.txt
tools/wordpress-import/ the scripts that produced src/data from the backup (see its README)
tools/seo/              old-urls.txt (600 old addresses) and check-urls.py (checks they all still work)
docs/SEO-LAUNCH.md      the domain switch checklist (DNS on Route 53, Mimecast email, Search Console)
```

## Adding content

iAM edits documents, the team and policies themselves in **Pages CMS** (https://app.pagescms.org, configured in
`.pages.yml`): each save commits to `main` and Vercel publishes it in about two minutes. Uploaded PDFs go to
`public/wp-content/uploads/documents/`, photos to `src/assets/uploads/team/`. `src/lib/content.ts` turns the editor's
shapes into what the pages use (sorting documents newest first, skipping half-filled entries), so keep the JSON shapes
in step with `.pages.yml`. Pull before editing these files in code, since iAM may have changed them.

- **Press release / report / notice** (in code): an entry `{title, date, pdf}` in the right file
  (`shareholder-notices.json`, `annual-reports.json`, `press.json`, `events-news.json`), or `{title, date, link}` for
  an article on another site.
- **Property** (normally done by iAM in Pages CMS → Properties): a file `src/data/properties/<slug>.json` holds the
  page (cover, gallery, description, facts) and the map pin (status, category list, city, country, latitude,
  longitude, size, acquired `YYYY-MM`, optional cardPhoto, optional otherPins for a second investment in the same
  building). `listed: false` keeps the page but leaves it off the map and lists (the solar portfolios).
- **Team member** (in code): `src/data/team.json`, `{name, title, company, group, photo: "/uploads/...", bio: "<p>...</p>"}`.

## Investments map

- The pins and cards come from the property files (`src/lib/properties.ts` → `pins`), built into the Investments page
  as JSON (`<script id="map-data">`) in the field names of the Google Sheet the map used until October 2026, which
  `public/scripts/investments.js` reads. The Sheet and its Apps Script are no longer used. Cards list active
  properties first, then by acquisition date, newest first; card photos are resized to 700px WebP at build.
- The map is MapLibre GL (npm `maplibre-gl`, bundled and loaded after first paint) with OpenFreeMap's free vector
  tiles (`tiles.openfreemap.org`, style "positron" recoloured to the old Google map's blue theme in
  `applyBlueTheme()`). No API key, account, billing or cookies. Pins are clustered by the map source (navy circles);
  positions are offset by ~0.5-1 km on purpose so exact assets aren't shown.
- The Contact page uses the same MapLibre/OpenFreeMap setup, in grey, for the office.
- Card badge colours: Residential #2ECC71, Office/Commercial/Retail #000, Hospitality #7B68EE, Renewable #FFC107.

## Notes

- SEO: titles/descriptions per page (`seoTitle`, `description` props; descriptions clipped to 155 characters),
  JSON-LD graph in `Layout.astro` (`src/lib/seo.ts`), Search Console verification meta tag from the old site. When
  a page or PDF moves, add the old address to `redirects.json`, run `npm run build` (which updates `vercel.json`),
  commit both, and run `tools/seo/check-urls.py`.

- Security: a Content Security Policy is built into every page by Astro (`security.csp` in `astro.config.mjs`), with
  hashes for each page's own scripts and styles; the headers in `vercel.json` add HSTS, frame-ancestors/X-Frame-Options,
  Permissions-Policy and COOP. A new outside service (a script, an embed, an image or data host) must be added to the
  CSP directives there or the browser will block it. Inline `onclick=` handlers are blocked: use addEventListener.
  MapLibre 6 loads its worker from `maplibre-gl-worker.mjs?url` via `setWorkerUrl()` on both map pages.

- Motion: scroll-in animations follow the old site's (which elements, in which order) but shorter and gentler. Mark an
  element `data-reveal` (`up` default, `left`, `fade`, `zoom`) and stagger grid items with `style="--i: n"`; the CSS
  is in `global.css`, the observer in `Layout.astro`. All motion is off for visitors who ask for reduced motion.

- The home hero film is the old site's `uploads/2023/01/iamcapital-background.mp4` (the same film as Vimeo 794267898),
  with its 0.7s fade from black trimmed and re-encoded for the web: `ffmpeg -ss 0.7 -i in.mp4 -an -c:v libx264
  -preset slow -crf 27 -maxrate 2200k -bufsize 4400k -pix_fmt yuv420p -movflags +faststart hero-1080.mp4` (and
  `-vf scale=1280:-2 -crf 28 -maxrate 1100k` for hero-720.mp4). The poster is its first frame. Vercel serves
  /video/* with HTTP Range support (206), which Safari needs to play it; on Cloudflare this took a Pages Function.

- The old site's Complianz cookie banner, Yoast, Burst, MetaSlider and SMTP plugins are not needed: there are no forms.
  Third-party content: Vercel Web Analytics (cookieless, same-origin), OpenFreeMap tiles (/investments/ and /contact/, no cookies), YouTube nocookie (one event page).
  The cookie policy page describes exactly this; update it if a new outside service is added.
