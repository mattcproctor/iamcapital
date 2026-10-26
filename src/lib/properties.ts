// Properties: one file per property in src/data/properties, edited by iAM in Pages CMS (.pages.yml). Each file holds
// both the property page (photos, description, fact table) and its pin on the Investments map; the file name is the
// page's address (/castel-porrona/). Fields left empty in the editor may be missing, so everything is read leniently.

type Pin = { status?: string; category?: string[]; size?: number | string; acquired?: string };
type Entry = Pin & {
  name?: string;
  listed?: boolean;
  city?: string;
  country?: string;
  latitude?: number | string;
  longitude?: number | string;
  cardPhoto?: string;
  cover?: string;
  gallery?: string[];
  description?: string;
  facts?: { label?: string; value?: string }[];
  otherPins?: Pin[];
  added?: string;
};

const files = import.meta.glob<Entry>('/src/data/properties/*.json', { eager: true, import: 'default' });

// "/uploads/2023/01/x.jpg" (the editor's path for src/assets/uploads) -> "2023/01/x.jpg", as upload() takes it
const asset = (path?: string) => (path ? path.replace(/^\/?uploads\//, '') : '');
const num = (v: unknown) => (v === '' || v == null || Number.isNaN(Number(v)) ? null : Number(v));

function paragraphs(html = ''): string[] {
  return html.split(/<\/p>\s*/i).map((s) => s.replace(/^\s*<p[^>]*>/i, '').trim()).filter((s) => s && s !== '<br>');
}

// "2025-12" -> "Dec-25", as the map cards have always shown it
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function shortMonth(ym?: string): string {
  const m = /^(\d{4})-(\d{2})/.exec(ym ?? '');
  return m ? `${MONTHS[Number(m[2]) - 1]}-${m[1].slice(2)}` : '';
}

export const properties = Object.entries(files)
  .map(([path, e]) => {
    const latitude = num(e.latitude);
    const longitude = num(e.longitude);
    return {
      slug: path.split('/').pop()!.replace(/\.json$/, ''),
      name: (e.name ?? '').trim(),
      // On the Investments map and lists: switched on, with a position
      listed: e.listed !== false && latitude !== null && longitude !== null,
      status: e.status || null,
      category: (e.category ?? []).join(' & '),
      city: e.city ?? '',
      country: e.country ?? '',
      latitude,
      longitude,
      size: num(e.size),
      acquired: e.acquired ?? '',
      cardPhoto: asset(e.cardPhoto) || asset(e.cover),
      cover: asset(e.cover) || null,
      gallery: (e.gallery ?? []).map(asset).filter(Boolean),
      description: paragraphs(e.description),
      facts: (e.facts ?? []).filter((f) => f.label && f.value) as { label: string; value: string }[],
      otherPins: e.otherPins ?? [],
      date: e.added ?? '',
    };
  })
  .filter((p) => p.name);

export type Property = (typeof properties)[number];

// "Country/city" on the old pages reads "Rome, Italy", "Tuscany (Porrona), Italy" or just "Italy"
export function location(p: Property): string {
  const f = p.facts.find((f) => /country|city/i.test(f.label));
  return f?.value ?? [p.city, p.country].filter(Boolean).join(', ');
}

export const bySlug = (slug: string) => properties.find((p) => p.slug === slug)!;

// The properties the site lists (Investments map and cards, sitemap, AI-search files). The solar portfolios keep their
// pages at the old addresses but are switched off, as iAM hid the old Investments page's Renewable Energy section.
export const listed = properties.filter((p) => p.listed);

export const status = (p: Property): string | null => p.status;

// The map's entries: one per property, plus any further investment in the same building (Sirtori and Quai Bourbon
// each have an active and a sold one), sharing its position, photo and page. Active first, then newest acquisition.
export const pins = listed
  .flatMap((p) => [
    { property: p, status: p.status ?? '', category: p.category, size: p.size, acquired: p.acquired },
    ...p.otherPins.map((o) => ({
      property: p,
      status: o.status ?? '',
      category: (o.category ?? []).join(' & ') || p.category,
      size: num(o.size),
      acquired: o.acquired ?? '',
    })),
  ])
  .sort((a, b) => Number(b.status === 'Active') - Number(a.status === 'Active') || b.acquired.localeCompare(a.acquired));
