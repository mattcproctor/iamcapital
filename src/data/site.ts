// Site-wide details: navigation, contact information and the footer's legal links.

export const nav = [
  { label: 'About', href: '/about/' },
  { label: 'Investments', href: '/investments/' },
  { label: 'Team', href: '/team/' },
  { label: 'Responsibility', href: '/responsibility/' },
  { label: 'Investor Relations', href: '/investor-relations/' },
  { label: 'News', href: '/latest-news/' },
  { label: 'Contact', href: '/contact/' },
];

export const contact = {
  company: 'iAM Capital Group Ltd',
  street: '4 Hill Street',
  city: 'London',
  postcode: 'W1J 5NE',
  phones: ['+44 20 7514 9200', '+44 20 7514 9211'],
  emails: { general: 'info@iamcapital.com', investors: 'ir@iamcapital.com' },
  directions:
    'https://www.google.com/maps/dir//IAM+Capital+Group+Plc,+Hill+Street,+London,+UK/@51.5093437,-0.2176033,12z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0x4876052ea5de21fb:0x27ee1e936837a8e7!2m2!1d-0.1475668!2d51.5092602',
  linkedin: 'https://www.linkedin.com/company/iam-capital/',
};

export const footerLinks = [
  { label: 'Disclaimer', href: '/wp-content/uploads/2026/03/2_Clean_iAM-Capital-Disclaimer-1.pdf' },
  { label: 'Legal', href: '/responsibility/#legal' },
  { label: 'Fraud Awareness', href: '/wp-content/uploads/2026/03/4_Clean_iAM-Capital-Fraud-Awareness-Policy.pdf' },
  { label: 'Privacy Policy', href: '/wp-content/uploads/2026/03/iAM-Capital-Privacy-Policy_v2-clean-v.pdf' },
  { label: 'Cookie Policy', href: '/cookie-policy/' },
];

export const tel = (n: string) => 'tel:' + n.replace(/[^+\d]/g, '');
