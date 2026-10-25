// Helpers for titles, descriptions and structured data (schema.org JSON-LD).
import { contact } from '../data/site';

export const SITE = 'https://www.iamcapital.com';

// Google shows roughly 155 characters of a description: cut at a word boundary and end cleanly
export function clip(text: string, max = 155): string {
  const t = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const sentence = cut.lastIndexOf('. ');
  if (sentence > max * 0.6) return cut.slice(0, sentence + 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:–-]$/, '') + '…';
}

export const organization = {
  '@type': 'Organization',
  '@id': `${SITE}/#organization`,
  name: 'iAM Capital',
  legalName: contact.company,
  url: `${SITE}/`,
  logo: { '@type': 'ImageObject', url: `${SITE}/images/branding/iam-capital-logo.webp`, width: 665, height: 230 },
  description:
    'A European private equity investment group, founded in 1997, deploying capital into alternative investment strategies with a focus on real estate and hospitality-led investment in Southern Europe.',
  foundingDate: '1997',
  address: {
    '@type': 'PostalAddress',
    streetAddress: contact.street,
    addressLocality: contact.city,
    postalCode: contact.postcode,
    addressCountry: 'GB',
  },
  telephone: contact.phones[0].replace(/\s/g, ''),
  email: contact.emails.general,
  contactPoint: [
    { '@type': 'ContactPoint', contactType: 'customer service', email: contact.emails.general, telephone: contact.phones[0].replace(/\s/g, '') },
    { '@type': 'ContactPoint', contactType: 'investor relations', email: contact.emails.investors },
  ],
  sameAs: [contact.linkedin],
  subOrganization: {
    '@type': 'Organization',
    name: 'iAM Invest Ltd',
    description: 'Fully owned subsidiary of iAM Capital, authorised and regulated by the UK Financial Conduct Authority (FCA).',
    parentOrganization: { '@id': `${SITE}/#organization` },
  },
};

export const website = {
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: `${SITE}/`,
  name: 'iAM Capital',
  inLanguage: 'en-GB',
  publisher: { '@id': `${SITE}/#organization` },
};
