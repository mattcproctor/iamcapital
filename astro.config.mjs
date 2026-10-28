// @ts-check
import { defineConfig } from 'astro/config';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import redirects from './redirects.json' with { type: 'json' };

// The full iamcapital.com site, rebuilt from the Brizy/WordPress backup, with the investments map as one of its pages.
// Static output for Vercel. Pages build as folders (about/index.html) and every address ends in a slash, so the
// WordPress URLs (/about/, /team/, /castel-porrona/ ...) keep working unchanged.
//
// redirects.json lists the old WordPress addresses (renamed pages, drafts, posts that only pointed at a PDF or an
// article). Vercel reads redirects from vercel.json before the build runs, so they are kept there as well: each build
// works out the rules from redirects.json and, if vercel.json doesn't match, rewrites it (on a local build, so commit
// the change) or stops (on Vercel, so an out-of-date file is never published). Each rule is written with and without
// the trailing slash. The ones that point within the site are also given to Astro, so they work in `astro dev` and
// `astro preview` too. The first rule sends www.iamcapital.com to the bare domain.

const VERCEL_JSON = fileURLToPath(new URL('./vercel.json', import.meta.url));

function vercelRedirects() {
  const rule = (source, r) => ({ source, destination: r.to, statusCode: r.status });
  const exact = [], wildcard = [];
  for (const r of redirects) {
    // "/timeline/*" becomes "/timeline/(.*)": anything under /timeline/, and /timeline/ itself (Vercel adds the slash to
    // /timeline first). Not ":path*", which with trailingSlash only matches /timeline/ on Vercel, not /timeline/2019/.
    if (r.from.includes('*')) { wildcard.push(rule(r.from.replace(/\/\*$/, '/(.*)'), r)); continue; }
    const sources = r.from === '/' || /\.[a-z0-9]+$/i.test(r.from) ? [r.from] : [r.from, r.from.replace(/\/$/, '')];
    // Old addresses with %-escapes are also matched in their decoded form
    for (const s of new Set(sources)) {
      exact.push(rule(s, r));
      if (s.includes('%')) exact.push(rule(decodeURIComponent(s), r));
    }
  }
  return [
    { source: '/:path*', has: [{ type: 'host', value: 'www.iamcapital.com' }], destination: 'https://iamcapital.com/:path*', statusCode: 301 },
    ...exact,
    ...wildcard,
  ];
}

/** @type {import('astro').AstroIntegration} */
const vercelConfig = {
  name: 'vercel-redirects',
  hooks: {
    'astro:build:start': ({ logger }) => {
      const config = JSON.parse(readFileSync(VERCEL_JSON, 'utf8'));
      const wanted = vercelRedirects();
      if (JSON.stringify(config.redirects) === JSON.stringify(wanted)) return;
      if (process.env.VERCEL) throw new Error('vercel.json redirects are out of date with redirects.json: run `npm run build` locally and commit vercel.json');
      writeFileSync(VERCEL_JSON, JSON.stringify({ ...config, redirects: wanted }, null, 2) + '\n');
      logger.warn(`updated vercel.json redirects (${wanted.length} rules) from redirects.json: commit it`);
    },
  },
};

export default defineConfig({
  site: 'https://iamcapital.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  redirects: Object.fromEntries(
    redirects.filter((r) => r.to.startsWith('/') && r.from !== '/' && !r.from.includes('*') && !/\.[a-z0-9]+$/i.test(r.from)).map((r) => [r.from.replace(/\/$/, ''), r.to]),
  ),
  integrations: [vercelConfig],
  // No code blocks on the site; Shiki's inline styles would also clash with the CSP below
  markdown: { syntaxHighlight: false },
  // Content Security Policy: Astro writes a <meta> policy into each page with the hashes of that page's own scripts and
  // styles, so nothing else can run. Other sources: the map tiles (OpenFreeMap), the YouTube embeds on one event page
  // and Vercel Web Analytics (served from the site itself, /_vercel/insights/). Inline style="" attributes stay allowed
  // (grid animation delays, the map's cards). Framing is refused by the frame-ancestors header in vercel.json, which a <meta>
  // policy can't set.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: blob: https://tiles.openfreemap.org",
        "font-src 'self' data:",
        "connect-src 'self' https://tiles.openfreemap.org",
        "worker-src 'self' blob:",
        "media-src 'self'",
        "frame-src https://www.youtube-nocookie.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      scriptDirective: { resources: ["'self'"] },
      styleDirective: { resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }] },
    },
  },
});
