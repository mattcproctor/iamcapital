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
      const lines = [];
      for (const r of redirects) {
        const sources = r.from === '/' ? ['/'] : [r.from, r.from.replace(/\/$/, '')];
        for (const s of new Set(sources)) lines.push(`${s} ${r.to} ${r.status}`);
      }
      writeFileSync(fileURLToPath(new URL('_redirects', dir)), lines.join('\n') + '\n');
      logger.info(`wrote _redirects (${lines.length} rules)`);
    },
  },
};

export default defineConfig({
  site: 'https://iamcapital.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  redirects: Object.fromEntries(
    redirects.filter((r) => r.to.startsWith('/') && r.from !== '/').map((r) => [r.from.replace(/\/$/, ''), r.to]),
  ),
  integrations: [cloudflareRedirects],
});
