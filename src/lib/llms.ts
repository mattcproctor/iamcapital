// Plain-text versions of the site for AI assistants and answer engines (llms.txt convention: https://llmstxt.org).
// Generated from the same data as the pages, so they always match the site.
import { listed, location, status } from './properties';
import fundData from '../data/funds.json';
import timeline from '../data/timeline.json';
import { team, documents, legal } from './content';
import { contact } from '../data/site';
import { monthYear } from './format';

const S = 'https://www.iamcapital.com';
const text = (h: string) => h.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const abs = (u: string) => (u.startsWith('/') ? S + u : u);

export const summary = `iAM Capital is a European private equity investment group, founded in 1997 and based in London, that deploys capital into alternative investment strategies with a focus on real estate and hospitality-led investment in Southern Europe (Italy, France and Spain). Its fully owned subsidiary, iAM Invest Ltd, is authorised and regulated by the UK Financial Conduct Authority (FCA).`;

export function llmsTxt(): string {
  return `# iAM Capital

> ${summary}

Key figures (real estate deals through dedicated funds and solar deals since 2015 only): 50+ transactions, 120,000+ sqm of real estate assets, 7+ major European cities and resorts, €300M+ transaction value.

## Pages

- [Home](${S}/): overview, key figures, approach and focus
- [About](${S}/about/): who we are, regulatory framework, active and exited funds (ICE II, ICE III, IREO, IGO, IAO, FinTLV, U.S. Tax Lien Program), history since 1997
- [Investments](${S}/investments/): portfolio map of active and sold properties in Italy, France and Spain
- [Team](${S}/team/): Board of Directors, investments and fundraising, operations
- [Responsibility](${S}/responsibility/): ESG principles and legal disclosures
- [Investor Relations](${S}/investor-relations/): shareholder notices and annual reports
- [News](${S}/latest-news/): press releases, coverage and events
- [Contact](${S}/contact/)

## Properties

${listed.map((p) => `- [${p.name}](${S}/${p.slug}/): ${p.category}, ${location(p)}${status(p) ? `, ${status(p)}` : ''}`).join('\n')}

## Legal and regulatory documents

${legal.map((d) => `- [${d.title}](${abs(d.url)})`).join('\n')}

## Optional

- [Full text of this site](${S}/llms-full.txt): everything above in detail, including fund terms, team biographies, property descriptions and the full document lists

## Contact

- ${contact.company}, ${contact.street}, ${contact.city} ${contact.postcode}, United Kingdom
- Phone: ${contact.phones[0]}
- Email: ${contact.emails.general}; investor relations: ${contact.emails.investors}
`;
}

export function llmsFullTxt(): string {
  const out: string[] = [];
  out.push(`# iAM Capital: full site content\n\n> ${summary}\n\nSource: ${S}/ (this file is generated from the website's content).`);

  out.push(`## Who we are\n\nEuropean private equity investment group with nearly 30 years of experience, focused on real estate investment strategies with a particular emphasis on hospitality and residential assets in Southern European markets. Founded in 1997, iAM Capital deploys capital across diversified asset classes, combining deep market expertise with active asset management.\n\nKey figures (real estate deals through dedicated funds and solar deals since 2015 only; figures for other discretionary funds, direct deals and alternative investments not disclosed): 50+ transactions; 120,000+ sqm of real estate assets; 7+ major European cities and resorts; €300M+ transaction value.\n\nApproach: local market expertise in Southern Europe; sector specialisation in hospitality and real estate; operational excellence through active asset management; strategic partnerships with premier operators (including CATS Hostels).`);

  out.push(`## Regulatory framework\n\n- FCA regulated in the United Kingdom (iAM Invest Ltd, the investment manager of iAM Capital's funds)\n- London-based investment management\n- Luxembourg domiciled AIFs\n- Italian domiciled FIAs`);

  const funds = fundData.funds.map((f) => {
    const facts = f.facts.map((x) => `  - ${x.label}: ${x.value}`).join('\n');
    return `### ${f.name} (${f.portfolio === 'active' ? 'active' : 'exited'}, ${f.category}${f.launched ? `, launched ${f.launched}` : ''})\n\n${(f.summary ?? []).map(text).join('\n\n')}\n\n${facts}`;
  });
  out.push(`## Funds\n\nSource: ${S}/about/\n\n${funds.join('\n\n')}`);

  out.push(`## History\n\n${timeline.map((t) => `- ${t.year}: ${t.title}. ${t.points.join(' ')}`).join('\n')}`);

  out.push(`## Team\n\nSource: ${S}/team/\n\n${team.map((p) => `### ${p.name}, ${p.title ?? ''} (${p.group})\n\n${p.bio.map(text).join('\n\n')}`).join('\n\n')}`);

  out.push(`## Properties\n\nSource: ${S}/investments/\n\n${listed.map((p) => `### ${p.name}\n\nURL: ${S}/${p.slug}/\nCategory: ${p.category}. Location: ${location(p)}.${status(p) ? ` Status: ${status(p)}.` : ''}\n\n${p.description.map(text).join('\n\n')}\n\n${p.facts.map((f) => `- ${f.label}: ${f.value}`).join('\n')}`).join('\n\n')}`);

  out.push(`## Responsibility (ESG)\n\niAM Capital considers ESG factors in its decision making and with regards to all asset management activities, and strives to uphold the principles of responsible investing and attain globally recognized efficiency certifications (LEED, WELL).\n\n- Screening: confirm each opportunity is consistent with our criteria\n- Due diligence: complete ESG due diligence on every new investment\n- Planning: implement sustainability factors in each business plan\n- Monitoring: actively monitor ESG performance with management teams\n- Exit: assess ESG performance and lessons learned after each divestment\n\nLegal disclosures:\n${legal.map((d) => `- ${d.title}: ${abs(d.url)}`).join('\n')}`);

  const list = (docs: { title: string; date: string; url: string }[]) => docs.map((d) => `- ${monthYear(d.date)}: ${d.title} (${abs(d.url)})`).join('\n');
  out.push(`## Investor relations\n\n### Shareholder notices\n\n${list(documents.shareholderNotices)}\n\n### Annual reports\n\n${list(documents.annualReports)}`);
  out.push(`## News\n\n### Press\n\n${list(documents.press)}\n\n### Events\n\n${list(documents.events)}`);

  out.push(`## Contact\n\n${contact.company}, ${contact.street}, ${contact.city} ${contact.postcode}, United Kingdom\nPhone: ${contact.phones.join(', ')}\nEmail: ${contact.emails.general}; investor relations: ${contact.emails.investors}\nLinkedIn: ${contact.linkedin}`);
  return out.join('\n\n') + '\n';
}
