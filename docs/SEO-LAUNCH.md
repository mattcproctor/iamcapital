# Launch checklist: pointing iamcapital.com at Vercel

Prepared October 2026 with the SEO/AIO audit; updated when hosting moved from Cloudflare Pages to Vercel (iAM Capital's
Pro team). This is what moves iamcapital.com onto the Vercel project without losing search rankings, links or email.

## What is already done in the site

- **Every old address keeps working.** 600 addresses Google may know (Wayback Machine crawl, the old site's Yoast
  records, its archived sitemaps) were checked: all pages and PDFs answer, directly or through one 301 redirect
  (`redirects.json` → `vercel.json`). Old policy PDFs redirect to the current version of the same policy; old
  WordPress sitemaps redirect to `/sitemap.xml`; 105 indexed images were restored at their old paths. Only these stay
  404 on purpose: 108 images from the pre-WordPress site (not in the backup), hacking probes (`/bh.php`, `/cf.php`,
  `/ns.php`, `/indexe.php`, `/captcha/…`, `/min/`), a test page (`/burak-test/`) and two unused videos.
  Re-check any time: `python3 tools/seo/check-urls.py https://iamcapital.com`
- **Search Console stays verified**: the old site's `google-site-verification` meta tag is in every page's head.
- **Sitemap**: `/sitemap.xml` lists 38 pages and 84 PDFs (reports, notices, press releases, policies) with dates.
- **robots.txt** allows everything and points to the sitemap. The 404 page is `noindex`.
- **Titles and descriptions**: unique on every page, 20–65 and 70–160 characters.
- **Structured data** (JSON-LD) on every page: Organization (with iAM Invest Ltd as FCA-regulated subsidiary,
  contact points, LinkedIn), WebSite, WebPage (AboutPage, ContactPage, CollectionPage), BreadcrumbList; Person for
  each team member.
- **AI search (AIO)**: `/llms.txt` (site guide) and `/llms-full.txt` (all facts: funds, history, team, properties,
  documents), generated from the site's data; the Investments page has a plain-HTML list of all 28 properties for
  crawlers that don't run JavaScript; all content is server-rendered.
- Canonical URLs are `https://iamcapital.com/...` everywhere, so the vercel.app copies are not treated as the original.

## Monday: domain

DNS stays on **AWS Route 53**; only the website moves. The site's address is the bare **iamcapital.com** (`site` in
`astro.config.mjs`, `SITE` in `src/lib/seo.ts`) and www.iamcapital.com redirects to it. Unlike Cloudflare Pages,
Vercel can serve the bare domain from a plain A record, so no CloudFront forwarding is needed.

1. **Vercel**: Project → Settings → Domains → add `iamcapital.com` (production). Add `www.iamcapital.com` too and set
   it to **Redirect to iamcapital.com, 301**. (`vercel.json` also redirects www to the bare domain, as a backstop.)
   Vercel then shows the exact records to create; use those values if they differ from the ones below.
2. **Route 53** (domain owners):
   - `iamcapital.com` A → `76.76.21.21` (replacing the old Lightsail address 35.178.128.7; remove any AAAA record).
   - `www` CNAME → `cname.vercel-dns.com` (replacing whatever `www` points to now).
   - Any TXT record Vercel asks for to verify the domain.
   No other record changes; email (Mimecast MX, SPF, DMARC, DKIM) is untouched. Vercel issues the HTTPS
   certificates itself once the records resolve (usually minutes).
3. **Vercel**: Analytics tab → enable Web Analytics. Check Firewall/Bot settings don't block AI crawlers.
4. The old Lightsail server (already answering 503) can then be retired.

Old addresses on www.iamcapital.com reach their page in at most two steps (www → bare, then the old-address redirect).

## Monday: after the switch

- Run `python3 tools/seo/check-urls.py https://iamcapital.com`; it should report nothing unexpected broken.
- **Google Search Console**: add the property `https://iamcapital.com/` (or a Domain property for iamcapital.com) (the verification meta tag on every page
  verifies it for the same Google account), submit `https://iamcapital.com/sitemap.xml`, and request indexing for
  `/`, `/about/`, `/investments/`, `/team/`, `/investor-relations/`. No "Change of address" (same domain).
- **Bing Webmaster Tools**: import the site from Search Console and submit the sitemap (Bing feeds ChatGPT search and
  Copilot).
- Watch Search Console → Pages → "Not found (404)" for two to four weeks; add any real old address that appears to
  `redirects.json`.
- Once Vercel is confirmed, the old Lightsail server and the Cloudflare Pages project can be retired.
