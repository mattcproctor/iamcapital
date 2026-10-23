import properties from '../data/properties.json';

export type Property = (typeof properties)[number];
export { properties };

// "Country/city" on the old pages reads "Rome, Italy", "Tuscany (Porrona), Italy" or just "Italy"
export function location(p: Property): string {
  const f = p.facts.find((f) => /country|city/i.test(f.label));
  return f?.value ?? [p.city, p.country].filter(Boolean).join(', ');
}

export const bySlug = (slug: string) => properties.find((p) => p.slug === slug)!;

// Active or Sold, from the portfolio map's Google Sheet when the data was extracted. The solar portfolios are not on
// the map, so they have no status and none is shown.
export const status = (p: Property): string | null => p.status;
