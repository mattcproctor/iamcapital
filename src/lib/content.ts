// The content iAM edits in Pages CMS (.pages.yml): documents, policies and the team. The JSON files keep the shapes
// the editor writes (a PDF upload or a web link; a biography as formatted text); this module turns them into what
// the pages use, so a change in the editor can't break a page.
import shareholderNotices from '../data/shareholder-notices.json';
import annualReports from '../data/annual-reports.json';
import press from '../data/press.json';
import eventsNews from '../data/events-news.json';
import legalData from '../data/legal.json';
import teamData from '../data/team.json';

export type Doc = { title: string; date: string; url: string; kind: 'pdf' | 'external' | 'page' };
type DocEntry = { title?: string; date?: string; pdf?: string; link?: string };

// A PDF uploaded in the editor, or else a link: another website ("external") or a page on this one
const toDoc = (d: DocEntry): Doc | null => {
  const url = (d.pdf || d.link || '').trim();
  if (!d.title || !url) return null;
  return { title: d.title.trim(), date: d.date ?? '', url, kind: d.pdf ? 'pdf' : /^https?:\/\//.test(url) ? 'external' : 'page' };
};

// Newest first, however the entries were ordered in the editor
const list = (entries: DocEntry[]) =>
  entries.map(toDoc).filter((d): d is Doc => d !== null).sort((a, b) => b.date.localeCompare(a.date));

export const documents = {
  shareholderNotices: list(shareholderNotices),
  annualReports: list(annualReports),
  press: list(press),
  events: list(eventsNews),
};

export const legal = (legalData as { title?: string; pdf?: string }[])
  .filter((l) => l.title && l.pdf)
  .map((l) => ({ title: l.title!, url: l.pdf! }));

// Photos are stored as "/uploads/2026/02/Ever.jpeg" (the editor's path for src/assets/uploads); the biography as
// HTML from the editor, split back into its paragraphs
// Fields left empty in the editor may be missing from the file, so every one is optional here
type Person = { name?: string; title?: string; company?: string; group?: string; photo?: string; bio?: string };

export const team = (teamData as Person[])
  .filter((p) => p.name)
  .map((p) => ({
    name: p.name!,
    title: p.title ?? '',
    group: p.group ?? '',
    photo: p.photo ? p.photo.replace(/^\/?uploads\//, '') : '',
    company: p.company ?? '',
    bio: paragraphs(p.bio ?? ''),
  }));

function paragraphs(html: string): string[] {
  const parts = html.split(/<\/p>\s*/i).map((s) => s.replace(/^\s*<p[^>]*>/i, '').trim());
  return parts.filter((s) => s && s !== '<br>');
}
