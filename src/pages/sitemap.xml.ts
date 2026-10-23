import type { APIRoute } from 'astro';
import { properties } from '../lib/properties';
import events from '../data/events.json';

const pages = ['', 'about/', 'investments/', 'team/', 'responsibility/', 'investor-relations/', 'latest-news/', 'contact/'];

export const GET: APIRoute = ({ site }) => {
  const urls = [
    ...pages,
    ...properties.map((p) => `${p.slug}/`),
    ...events.map((e) => `${e.slug}/`),
  ].map((path) => new URL(path, site).href);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
