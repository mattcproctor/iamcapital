# iAM Capital website

The full iamcapital.com site in Astro, rebuilt in October 2026 from the Brizy/WordPress backup, with the investments
map (previously its own site on iamcapital.vercel.app) as one of its pages. Static output, hosted on Cloudflare Pages,
built from GitHub.

- **Repository**: https://github.com/Brightwork-Digital/iamcapital (branch `full-site` holds the rebuild; `main` is
  still the map-only site. If the old Vercel project is still connected to the repo, a push to `main` redeploys it.)
- **Hosting**: Cloudflare Pages, Git integration. Build command `npm run build`, output directory `dist`, Node 22
  (`.node-version`). Optional variable `PUBLIC_GOOGLE_MAPS_API_KEY` (see `.env.example`). Turn on Web Analytics for
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
astro.config.mjs        site https://iamcapital.com, trailing slashes, folder output; writes dist/_redirects after build
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
    sitemap.xml.ts
  data/                 content extracted from WordPress (edit these to change content)
    documents.json      shareholderNotices, annualReports, press, events: {title, date, url, kind: pdf|external|page}
    properties.json     28 properties: description (paragraph HTML, links kept), facts, gallery, cover, status
    funds.json          the About page's funds and category intros
    team.json, timeline.json, legal.json, events.json, site.ts (nav, contact, footer links)
  lib/                  images.ts (upload('2023/01/x.jpg') -> optimised image), properties.ts, format.ts
  assets/uploads/       the 162 images the site uses, at their WordPress year/month paths (Astro optimises them)
  styles/               global.css (original fonts, colours, headings), investments.css (map), overpass.css (font)
public/
  wp-content/uploads/   the ~90 PDFs (and 4 map images) at their original paths, so old links keep working
  scripts/investments.js, images/ (branding, map property images), fonts/overpass/, robots.txt, llms.txt
tools/wordpress-import/ the scripts that produced src/data from the backup (see its README)
```

## Adding content

- **Press release / report / notice**: put the PDF in `public/wp-content/uploads/YYYY/MM/` and add an entry at the top
  of the right list in `src/data/documents.json` (`kind: "pdf"`, `url: "/wp-content/uploads/YYYY/MM/file.pdf"`).
  External articles use `kind: "external"` and the full URL.
- **Property page**: add an object to `src/data/properties.json` (images under `src/assets/uploads/`) and a row in
  the map's Google Sheet with Portfolio URL `https://iamcapital.com/<slug>/`.
- **Team member**: `src/data/team.json` (photo under `src/assets/uploads/`).

## Investments map

Unchanged from the standalone site apart from layout and styling:

- Data comes live from a Google Sheet through Apps Script (`PROPERTIES_API_URL` in `public/scripts/investments.js`).
  Editing the sheet updates the map within minutes, no deploy needed.
- `localiseProperty()` turns the sheet's absolute links and image URLs on iamcapital.com / iamcapital.vercel.app into
  paths, so the map links to this site's property pages wherever it is served. `/cordoba/` and `/san-sebastian/`
  redirect to `/santa-marta/` and `/pasealekua/` (renamed in WordPress).
- Google Maps API key (`PUBLIC_GOOGLE_MAPS_API_KEY`, falling back to the key in `src/pages/investments.astro`) is
  HTTP-referrer restricted. It allows iamcapital.vercel.app only, so the map shows "Unable to load property map" on
  localhost, Cloudflare previews and iamcapital.com until these are added to the key's Website restrictions in
  Google Cloud Console (APIs & Services > Credentials): `https://iamcapital.com/*`, `https://www.iamcapital.com/*`,
  `https://*.iamcapital.pages.dev/*` and `https://iamcapital.pages.dev/*` (use the real Pages project name), and
  `http://localhost:4321/*` for development. The property cards still load without it.
- Marker colours: Residential #2ECC71, Office/Commercial/Retail #000, Hospitality #7B68EE, Renewable #FFC107.

## Notes

- The home hero film is the old site's `uploads/2023/01/iamcapital-background.mp4` (the same film as Vimeo 794267898),
  with its 0.7s fade from black trimmed and re-encoded for the web: `ffmpeg -ss 0.7 -i in.mp4 -an -c:v libx264
  -preset slow -crf 27 -maxrate 2200k -bufsize 4400k -pix_fmt yuv420p -movflags +faststart hero-1080.mp4` (and
  `-vf scale=1280:-2 -crf 28 -maxrate 1100k` for hero-720.mp4). The poster is its first frame.

- The old site's Complianz cookie banner, Yoast, Burst, MetaSlider and SMTP plugins are not needed: there are no forms.
  Third-party content: Google Maps (/investments/, /contact/), YouTube nocookie
  (one event page). The cookie policy page is a draft describing exactly this.
