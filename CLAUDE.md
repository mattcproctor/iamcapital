# iAM Capital website

The full iamcapital.com site in Astro, rebuilt in October 2026 from the Brizy/WordPress backup, with the investments
map (previously its own site on iamcapital.vercel.app) as one of its pages. Static output, hosted on Cloudflare Pages,
built from GitHub.

- **Repository**: https://github.com/Brightwork-Digital/iamcapital (branch `full-site` holds the rebuild; `main` is
  still the map-only site. If the old Vercel project is still connected to the repo, a push to `main` redeploys it.)
- **Hosting**: Cloudflare Pages, Git integration. Build command `npm run build`, output directory `dist`, Node 22
  (`.node-version`). No environment variables are needed. Turn on Web Analytics for
  the project in the Cloudflare dashboard (cookieless; it injects its own beacon).
- **Design**: a faithful rebuild of the original Brizy design (see `.impeccable.md`), not a redesign. Measure against
  the archived pages before changing layout or styles.

## Commands

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # writes dist/ (about 160 MB, mostly PDFs and optimised images)
npm run preview
npx wrangler pages dev dist   # serve dist/ exactly as Cloudflare does (redirects, headers)
```

## Structure

```
astro.config.mjs        site https://www.iamcapital.com, trailing slashes, folder output; writes dist/_redirects after build
redirects.json          123 redirects from old WordPress addresses (to pages, PDFs or external articles)
wrangler.jsonc          Cloudflare Pages project settings (name, output directory)
public/_headers         security headers, long caching for /_astro/* and /fonts/*
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
    contact.astro, cookie-policy.astro (DRAFT, noindex), 404.astro
    [slug].astro                28 property pages + 2 event pages at the WordPress addresses (/castel-porrona/ ...)
    sitemap.xml.ts              pages + linked PDFs, with dates
    llms.txt.ts, llms-full.txt.ts   plain-text site guide and full content for AI search (from src/lib/llms.ts)
  data/                 content extracted from WordPress (edit these to change content)
    shareholder-notices.json, annual-reports.json, press.json, events-news.json
                        documents (edited in Pages CMS): {title, date, pdf | link}; read via src/lib/content.ts
    properties.json     28 properties: description (paragraph HTML, links kept), facts, gallery, cover, status
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
`.pages.yml`): each save commits to `main` and Cloudflare publishes it in about two minutes. Uploaded PDFs go to
`public/wp-content/uploads/documents/`, photos to `src/assets/uploads/team/`. `src/lib/content.ts` turns the editor's
shapes into what the pages use (sorting documents newest first, skipping half-filled entries), so keep the JSON shapes
in step with `.pages.yml`. Pull before editing these files in code, since iAM may have changed them.

- **Press release / report / notice** (in code): an entry `{title, date, pdf}` in the right file
  (`shareholder-notices.json`, `annual-reports.json`, `press.json`, `events-news.json`), or `{title, date, link}` for
  an article on another site.
- **Property page**: add an object to `src/data/properties.json` (images under `src/assets/uploads/`) and a row in
  the map's Google Sheet with Portfolio URL `https://iamcapital.com/<slug>/`.
- **Team member** (in code): `src/data/team.json`, `{name, title, company, group, photo: "/uploads/...", bio: "<p>...</p>"}`.

## Investments map

Unchanged from the standalone site apart from layout and styling:

- Data comes live from a Google Sheet through Apps Script (`PROPERTIES_API_URL` in `public/scripts/investments.js`).
  Editing the sheet updates the map within minutes, no deploy needed.
- `localiseProperty()` turns the sheet's absolute links and image URLs on iamcapital.com / iamcapital.vercel.app into
  paths, so the map links to this site's property pages wherever it is served. `/cordoba/` and `/san-sebastian/`
  redirect to `/santa-marta/` and `/pasealekua/` (renamed in WordPress).
- The map is MapLibre GL (npm `maplibre-gl`, bundled and loaded after first paint) with OpenFreeMap's free vector
  tiles (`tiles.openfreemap.org`, style "positron" recoloured to the old Google map's blue theme in
  `applyBlueTheme()`). No API key, account, billing or cookies. It replaced Google Maps in October 2026 because the
  Google key was restricted to iamcapital.vercel.app and its owner had left the project. Pins are clustered by the
  map source (navy circles); positions are offset by ~0.5-1 km on purpose so exact assets aren't shown.
- Card badge colours: Residential #2ECC71, Office/Commercial/Retail #000, Hospitality #7B68EE, Renewable #FFC107.

## Notes

- SEO: titles/descriptions per page (`seoTitle`, `description` props; descriptions clipped to 155 characters),
  JSON-LD graph in `Layout.astro` (`src/lib/seo.ts`), Search Console verification meta tag from the old site. When
  a page or PDF moves, add the old address to `redirects.json` and run `tools/seo/check-urls.py`.

- Motion: scroll-in animations follow the old site's (which elements, in which order) but shorter and gentler. Mark an
  element `data-reveal` (`up` default, `left`, `fade`, `zoom`) and stagger grid items with `style="--i: n"`; the CSS
  is in `global.css`, the observer in `Layout.astro`. All motion is off for visitors who ask for reduced motion.

- The home hero film is the old site's `uploads/2023/01/iamcapital-background.mp4` (the same film as Vimeo 794267898),
  with its 0.7s fade from black trimmed and re-encoded for the web: `ffmpeg -ss 0.7 -i in.mp4 -an -c:v libx264
  -preset slow -crf 27 -maxrate 2200k -bufsize 4400k -pix_fmt yuv420p -movflags +faststart hero-1080.mp4` (and
  `-vf scale=1280:-2 -crf 28 -maxrate 1100k` for hero-720.mp4). The poster is its first frame.

- The old site's Complianz cookie banner, Yoast, Burst, MetaSlider and SMTP plugins are not needed: there are no forms.
  Third-party content: OpenFreeMap tiles (/investments/, no cookies), Google Maps embed (/contact/), YouTube nocookie
  (one event page). The cookie policy page is a draft describing exactly this.
