import type { APIRoute } from 'astro';
import { properties } from '../lib/properties';
import events from '../data/events.json';
import documents from '../data/documents.json';
import legal from '../data/legal.json';

// Every indexable page, plus the PDFs the site links to (reports, notices, press releases, policies), which Google
// indexes as documents. lastmod is given where the content carries a real date. The cookie policy and 404 are
// left out (noindex).

type Entry = { path: string; lastmod?: string };

const newest = (dates: string[]) => dates.filter(Boolean).sort().at(-1);
const allDocs = [...documents.press, ...documents.events, ...documents.shareholderNotices, ...documents.annualReports];

export const GET: APIRoute = ({ site }) => {
  const entries: Entry[] = [
    { path: '/', lastmod: newest(documents.press.map((d) => d.date)) },
    { path: '/about/' },
    { path: '/investments/', lastmod: newest(properties.map((p) => p.date)) },
    { path: '/team/' },
    { path: '/responsibility/' },
    { path: '/investor-relations/', lastmod: newest([...documents.shareholderNotices, ...documents.annualReports].map((d) => d.date)) },
    { path: '/latest-news/', lastmod: newest([...documents.press, ...documents.events].map((d) => d.date)) },
    { path: '/contact/' },
    ...properties.map((p) => ({ path: `/${p.slug}/`, lastmod: p.date })),
    ...events.map((e) => ({ path: `/${e.slug}/`, lastmod: e.date })),
  ];

  // Documents served by this site (not external articles), each once
  const seen = new Set<string>();
  for (const d of [...allDocs.map((d) => ({ path: d.url, lastmod: d.date })), ...legal.map((l) => ({ path: l.url }))]) {
    if (!d.path.startsWith('/wp-content/uploads/') || seen.has(d.path)) continue;
    seen.add(d.path);
    entries.push(d);
  }

  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map((e) => `  <url><loc>${esc(new URL(encodeURI(e.path), site).href)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>`)
  .join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
