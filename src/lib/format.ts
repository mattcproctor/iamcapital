// Dates in the data files are ISO (2026-03-10); the site shows them as "March 2026", as the old site did.
export const monthYear = (iso: string) =>
  new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export const year = (iso: string) => iso.slice(0, 4);

// Groups an already-sorted list by the year of each item's date, keeping the order.
export function byYear<T extends { date: string }>(items: T[]): [string, T[]][] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const y = year(item.date);
    if (!groups.has(y)) groups.set(y, []);
    groups.get(y)!.push(item);
  }
  return [...groups];
}

export const isExternal = (href: string) => /^https?:\/\//.test(href);
