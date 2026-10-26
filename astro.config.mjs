// @ts-check
import { defineConfig } from 'astro/config';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import redirects from './redirects.json' with { type: 'json' };

// The full iamcapital.com site, rebuilt from the Brizy/WordPress backup, with the investments map as one of its pages.
// Static output for Cloudflare Pages. Pages build as folders (about/index.html) and every address ends in a slash, so
// the WordPress URLs (/about/, /team/, /castel-porrona/ ...) keep working unchanged.
//
// redirects.json lists the old WordPress addresses (renamed pages, drafts, posts that only pointed at a PDF or an
// article). After each build it is written to dist/_redirects, which Cloudflare applies before serving files; each
// rule is written with and without the trailing slash. The ones that point within the site are also given to Astro,
// so they work in `astro dev` and `astro preview` too.

/** @type {import('astro').AstroIntegration} */
const cloudflareRedirects = {
  name: 'cloudflare-redirects',
  hooks: {
    'astro:build:done': ({ dir, logger }) => {
      // Exact addresses first, each with and without the trailing slash; wildcard rules (/timeline/*) after them
      const exact = [], wildcard = [];
      for (const r of redirects) {
        if (r.from.includes('*')) { wildcard.push(`${r.from} ${r.to} ${r.status}`); continue; }
        const sources = r.from === '/' || /\.[a-z0-9]+$/i.test(r.from) ? [r.from] : [r.from, r.from.replace(/\/$/, '')];
        for (const s of new Set(sources)) exact.push(`${s} ${r.to} ${r.status}`);
      }
      const lines = [...exact, ...wildcard];
      writeFileSync(fileURLToPath(new URL('_redirects', dir)), lines.join('\n') + '\n');
      logger.info(`wrote _redirects (${lines.length} rules)`);
    },
  },
};

export default defineConfig({
  site: 'https://www.iamcapital.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  redirects: Object.fromEntries(
    redirects.filter((r) => r.to.startsWith('/') && r.from !== '/' && !r.from.includes('*') && !/\.[a-z0-9]+$/i.test(r.from)).map((r) => [r.from.replace(/\/$/, ''), r.to]),
  ),
  integrations: [cloudflareRedirects],
  // No code blocks on the site; Shiki's inline styles would also clash with the CSP below
  markdown: { syntaxHighlight: false },
  // Content Security Policy: Astro writes a <meta> policy into each page with the hashes of that page's own scripts and
  // styles, so nothing else can run. Other sources: the map tiles (OpenFreeMap), the YouTube embeds on one event page
  // and Cloudflare Web Analytics (if it's switched on). Inline style="" attributes stay allowed (grid animation
  // delays, the map's cards). Framing is refused by the frame-ancestors header in public/_headers, which a <meta>
  // policy can't set.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: blob: https://tiles.openfreemap.org",
        "font-src 'self' data:",
        "connect-src 'self' https://tiles.openfreemap.org https://cloudflareinsights.com",
        "worker-src 'self' blob:",
        "media-src 'self'",
        "frame-src https://www.youtube-nocookie.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      scriptDirective: { resources: ["'self'", 'https://static.cloudflareinsights.com'] },
      styleDirective: { resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }] },
    },
  },
});
