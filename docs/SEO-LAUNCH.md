# Launch checklist: pointing iamcapital.com at Cloudflare Pages

Prepared October 2026 with the SEO/AIO audit. The site is live at https://iamcapital.pages.dev; this is what moves
iamcapital.com onto it without losing search rankings, links or email.

## What is already done in the site

- **Every old address keeps working.** 600 addresses Google may know (Wayback Machine crawl, the old site's Yoast
  records, its archived sitemaps) were checked: all pages and PDFs answer, directly or through one 301 redirect
  (`redirects.json` → `dist/_redirects`). Old policy PDFs redirect to the current version of the same policy; old
  WordPress sitemaps redirect to `/sitemap.xml`; 105 indexed images were restored at their old paths. Only these stay
  404 on purpose: 108 images from the pre-WordPress site (not in the backup), hacking probes (`/bh.php`, `/cf.php`,
  `/ns.php`, `/indexe.php`, `/captcha/…`, `/min/`), a test page (`/burak-test/`) and two unused videos.
  Re-check any time: `python3 tools/seo/check-urls.py https://iamcapital.com`
- **Search Console stays verified**: the old site's `google-site-verification` meta tag is in every page's head.
- **Sitemap**: `/sitemap.xml` lists 38 pages and 84 PDFs (reports, notices, press releases, policies) with dates.
- **robots.txt** allows everything and points to the sitemap. The cookie policy and 404 are `noindex`.
- **Titles and descriptions**: unique on every page, 20–65 and 70–160 characters.
- **Structured data** (JSON-LD) on every page: Organization (with iAM Invest Ltd as FCA-regulated subsidiary,
  contact points, LinkedIn), WebSite, WebPage (AboutPage, ContactPage, CollectionPage), BreadcrumbList; Person for
  each team member.
- **AI search (AIO)**: `/llms.txt` (site guide) and `/llms-full.txt` (all facts: funds, history, team, properties,
  documents), generated from the site's data; the Investments page has a plain-HTML list of all 28 properties for
  crawlers that don't run JavaScript; all content is server-rendered.
- Canonical URLs are `https://www.iamcapital.com/...` everywhere, so the pages.dev copy is not treated as the original.

## Monday: domain

DNS stays on **AWS Route 53**; only the website moves. Route 53 can't point the bare iamcapital.com at Cloudflare
Pages (no CNAME at the apex; its "alias" records only reach AWS), so the site's address is **www.iamcapital.com**
(`site` in `astro.config.mjs`, `SITE` in `src/lib/seo.ts`) and the bare domain forwards to it from AWS.
Step-by-step instructions for both sides are in the shared doc "iamcapital.com go-live: DNS and Cloudflare". In short:

1. **Cloudflare**: Pages → iamcapital → Custom domains → add `www.iamcapital.com`.
2. **Route 53** (domain owners): `www` → CNAME `iamcapital.pages.dev` (plus any TXT record Cloudflare asks for).
   No other record changes; email (Mimecast MX, SPF, DMARC, DKIM) is untouched.
3. **Route 53 + CloudFront** (domain owners): an ACM certificate for `iamcapital.com` (us-east-1), a CloudFront
   distribution with a viewer-request CloudFront Function that 301s every request to
   `https://www.iamcapital.com` + path + query, and the apex A record switched to an alias of that distribution.
   The old Lightsail server (35.178.128.7, already answering 503) can then be retired.
4. **Cloudflare**: make sure AI-crawler blocking is off; turn on Web Analytics.

Old addresses on iamcapital.com reach their page in at most two steps (bare → www, then the old-address redirect).

## Monday: after the switch

- Run `python3 tools/seo/check-urls.py https://iamcapital.com`; it should report nothing unexpected broken.
- **Google Search Console**: add the property `https://www.iamcapital.com/` (the verification meta tag on every page
  verifies it for the same Google account), submit `https://www.iamcapital.com/sitemap.xml`, and request indexing for
  `/`, `/about/`, `/investments/`, `/team/`, `/investor-relations/`. No "Change of address" (same domain).
- **Bing Webmaster Tools**: import the site from Search Console and submit the sitemap (Bing feeds ChatGPT search and
  Copilot).
- Watch Search Console → Pages → "Not found (404)" for two to four weeks; add any real old address that appears to
  `redirects.json`.
- Once Cloudflare is confirmed, the old Lightsail server and the Route 53 hosted zone can be retired.
