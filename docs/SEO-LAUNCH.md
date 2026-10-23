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
- Canonical URLs are `https://iamcapital.com/...` everywhere, so the pages.dev copy is not treated as the original.

## Monday: domain

iamcapital.com's DNS is on **AWS Route 53** today (A record 35.178.128.7, the old Lightsail server). Cloudflare Pages
can only serve the bare domain (`iamcapital.com`, without www) when the domain's DNS is on Cloudflare, so the DNS
moves to Cloudflare.

**Email runs through Mimecast. Copy every record exactly or email stops.**

1. **Export the Route 53 zone first** (Route 53 → Hosted zones → iamcapital.com → export, or list every record).
   As of 23 Oct 2026 it includes at least:
   - MX `10 eu-smtp-inbound-1.mimecast.com`, `10 eu-smtp-inbound-2.mimecast.com`
   - TXT SPF `v=spf1 ip4:205.201.128.0/20 ip4:198.2.128.0/18 ip4:148.105.0.0/16 include:eu._netblocks.mimecast.com ~all`
   - TXT `MS=ms88679439`, `cisco-ci-domain-verification=…`, `knowbe4-site-verification=…` and four other tokens
   - `_dmarc` TXT `v=DMARC1; p=quarantine; …`
   - plus any DKIM (`*._domainkey`), `autodiscover`, `selector1/selector2`, Mimecast or other subdomain records that
     only the full export shows.
2. **Cloudflare → Add a domain → iamcapital.com** (free plan). Compare the imported records with the export line by
   line and add anything missing. Set the mail-related records to **DNS only** (grey cloud).
3. **Change the nameservers** at the registrar to the two Cloudflare gives. Keep Route 53 untouched until Cloudflare
   shows the domain Active and email is confirmed working (send and receive a test message).
4. **Pages → iamcapital → Custom domains**: add `iamcapital.com` and `www.iamcapital.com`. Cloudflare creates the
   records and the certificates.
5. **Redirects** (Rules → Redirect Rules or Bulk Redirects, 301, keep path and query string):
   - `www.iamcapital.com/*` → `https://iamcapital.com/$1`
   - `iamcapital.pages.dev/*` → `https://iamcapital.com/$1` (so the pages.dev copy can't compete in search)
6. **SSL/TLS**: Always Use HTTPS on; minimum TLS 1.2.
7. **AI crawlers**: Cloudflare can block AI crawlers by default on new domains. Under Security → Bots (AI Crawl
   Control / "Block AI bots"), make sure AI crawlers are **allowed** and that no managed robots.txt adds `Disallow`
   rules, otherwise ChatGPT, Perplexity, Claude and Google's AI features can't read the site.
8. **Web Analytics**: turn it on for the Pages project.

## Monday: after the switch

- Run `python3 tools/seo/check-urls.py https://iamcapital.com`; it should report nothing unexpected broken.
- **Google Search Console** (property iamcapital.com, already verified): Sitemaps → submit
  `https://iamcapital.com/sitemap.xml` and remove the old `sitemap_index.xml`. URL Inspection → Request indexing for
  `/`, `/about/`, `/investments/`, `/team/`, `/investor-relations/`. No "Change of address" (same domain).
- **Bing Webmaster Tools**: import the site from Search Console and submit the sitemap (Bing feeds ChatGPT search and
  Copilot).
- Watch Search Console → Pages → "Not found (404)" for two to four weeks; add any real old address that appears to
  `redirects.json`.
- Once Cloudflare is confirmed, the old Lightsail server and the Route 53 hosted zone can be retired.
