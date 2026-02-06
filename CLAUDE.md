# iAM Capital - Investment Properties Map

## Project Overview
Professional investment property map page for iAM Capital displaying properties from a Google Sheet with interactive Google Maps integration. Built using serverless architecture with Google Apps Script.

**Project Status:** ✅ Live in Production

**Live Site:**
- **Production URL**: https://iamcapital.vercel.app/
- **GitHub Repository**: https://github.com/websitelab/iamcapital/
- **Hosting**: Vercel (auto-deploys from main branch)
- **Last Updated**: February 6, 2026 (Version 2.5)

**Live Configuration:**
- Google Apps Script URL: `https://script.google.com/macros/s/AKfycbzd8F3e1nlUPY8ybszTpiopyWpLU8pZ3JL15tWHBArrWvCWFyGuZydFAStZPp6MIOPzMQ/exec`
- Google Maps API Key: `AIzaSyAFOA9PrQdFW1bI-l9DIuWrIFhC8uozN0c`
- Map Center: Europe (Italy/France/Spain region, lat: 45.0, lng: 10.0)
- Property Data: 27 real properties (18 Sold, 9 Active) across Italy, France, and Spain
- Deployment: ✅ GitHub, ✅ Vercel, ✅ Fully Operational

**Technology Stack:**
- Pure HTML5/CSS3/Vanilla JavaScript
- Google Sheets (data storage/CMS with pre-geocoded coordinates)
- Google Apps Script v2 (JSON API endpoint with lat/lng support)
- Google Maps JavaScript API (map rendering)
- FontAwesome SVG icons (category-based map markers)
- Serverless architecture (no backend needed)
- Vercel hosting (static site deployment)
- GitHub repository (version control)

---

## Architecture Overview

### Serverless 3-Layer Design

```
Google Sheet (Data Storage + Pre-Geocoded Coords)
    ↓
Google Apps Script v2 (API Layer)
    ↓
HTTPS JSON Endpoint (with lat/lng)
    ↓
JavaScript fetch() (Frontend)
    ↓
FontAwesome SVG Markers + Property Cards
```

**Key Benefits:**
- ✅ Zero server infrastructure
- ✅ Real-time updates (edit sheet → live in 1-5 minutes)
- ✅ HTTPS by default (Google Apps Script)
- ✅ GDPR compliant (no cookies, no tracking, no PII)
- ✅ Fast loading (~1-2 seconds with pre-geocoded coords)
- ✅ Zero geocoding API calls (coordinates in sheet)
- ✅ Scalable (handles 10-50 properties easily)
- ✅ Easy updates (non-technical staff can edit Google Sheet)

---

## File Structure

```
iamcapital.com/
├── index.html                    # Root redirect to investments page
├── investments.html              # Main page with map and filters
├── investments.css               # Styling (header, footer, cards, filters)
├── investments.js                # Map logic, FA markers, filters, mobile menu
├── vercel.json                   # Vercel configuration (clean URLs)
├── .gitignore                    # Git ignore (working-files, .DS_Store, etc.)
├── images/
│   ├── hero/
│   │   └── milan-cathedral-hero.webp  # Hero background (247KB WebP)
│   ├── branding/
│   │   ├── iam-capital-logo.webp      # Header logo (6.8KB)
│   │   └── logo-white.png             # Footer logo (2KB)
│   └── properties/                    # Property card images (WebP, 800px wide)
│       ├── abruzzi.webp               # 21 optimized property images
│       ├── berthe-ravignan.webp       # Sourced from iamcapital.com
│       ├── bourbon.webp               # header/carousel images
│       ├── bressanone.webp            # Resized to 800px wide
│       ├── capo-mimosa.webp           # Converted to WebP @ quality 80
│       ├── depretis.webp              # Total: ~1.2MB (was 11MB)
│       ├── fulvio-testi.webp
│       ├── galerie.webp
│       ├── gobetti.webp
│       ├── govone.webp
│       ├── murat.webp
│       ├── patay.webp
│       ├── repubblica.webp
│       ├── roquette.webp
│       ├── saint-ouen.webp
│       ├── sanzio.webp
│       ├── sevres.webp
│       ├── sirtori.webp
│       ├── temple.webp
│       ├── valassina.webp
│       └── via-torino.webp
├── working-files/                # Non-production files (not in GitHub)
│   ├── DEPLOYMENT-GUIDE-v2.md
│   ├── README-INVESTMENTS.md
│   ├── google-apps-script.js     # Old version
│   ├── google-apps-script-v2.js  # Current version (reference)
│   ├── sample-properties.csv     # Property data with lat/lng
│   ├── property-image-urls.csv   # Image URLs mapped to spreadsheet order
│   └── new-images/               # Source images for replacements
├── CLAUDE.md                     # This documentation
└── .git/                         # Git repository
```

**Total Production Code:** ~1,000 lines (HTML + CSS + JS)

---

## Current Live Configuration

### Google Apps Script v2 (with Pre-Geocoded Coordinates)

**Deployment URL:**
```
https://script.google.com/macros/s/AKfycbzd8F3e1nlUPY8ybszTpiopyWpLU8pZ3JL15tWHBArrWvCWFyGuZydFAStZPp6MIOPzMQ/exec
```

**Sheet Structure (15 columns):**
| Column | Name | Example |
|--------|------|---------|
| A | Property Name | "Palazzo Residences" |
| B | Address | "Via dei Condotti 45" |
| C | City | "Rome" |
| D | Country | "Italy" |
| E | Postal Code | "00187" |
| F | Category | "Residential" |
| G | Property Type | "Multifamily" |
| H | Size SQM | "7650" |
| I | Image URL | "https://images.unsplash.com/..." |
| J | Acquisition Date | "Q2 2024" |
| K | Status | "Active" |
| L | Description | "Luxury residential in historic center" |
| M | Portfolio URL | "/portfolio/palazzo-residences" |
| N | Latitude | "41.9055" |
| O | Longitude | "12.4823" |

**API Response Format:**
```json
{
  "properties": [
    {
      "name": "Palazzo Residences",
      "category": "Residential",
      "latitude": 41.9055,
      "longitude": 12.4823,
      ...
    }
  ],
  "count": 12,
  "timestamp": "2026-01-30T..."
}
```

---

## Design System

### Brand Colors
```css
/* Primary */
--color-navy: #19375F;        /* Brand blue (headers, footer, commercial markers) */
--color-gold: #D4AF37;        /* Accent (unused in current design) */
--color-white: #FFFFFF;       /* White backgrounds, text */
--color-black: #000000;       /* Button hovers */

/* Category Marker Colors */
Residential: #4A90E2          /* Bright blue */
Commercial: #19375F           /* Navy (brand color) */
Hospitality: #7B68EE          /* Slate blue */
Renewable Energy: #27AE60     /* Green */

/* Grays */
--color-gray-50: #F9FAFB;
--color-gray-100: #F3F4F6;
--color-gray-200: #E5E7EB;
--color-gray-700: #374151;
--color-gray-900: #111827;
```

### Typography
**Font Family:** Overpass (Google Fonts)
```css
font-family: 'Overpass', -apple-system, BlinkMacSystemFont, sans-serif;
```

**Font Sizes:**
- Header nav: 16px
- Footer: 16px
- Hero title: 3.5rem → 2rem (mobile)
- Section title: 2.5rem → 1.75rem (mobile)
- Body text: 1rem (16px)

**Font Weights:**
- Light: 300
- Regular: 400
- Semi-bold: 600
- Bold: 700
- Black: 900

---

## Page Structure

### 1. Header/Navigation (80px height)

**Design:**
- White background (#FFFFFF)
- iAM Capital logo (WebP, 50px height)
- 7 navigation items (Overpass 16px, #19375F)
- Sticky positioning (z-index: 1000)
- Mobile: Slide-in hamburger menu (navy background)

**Navigation Links:**
- About → https://iamcapital.com/about/
- Investments → https://iamcapital.com/investments/
- Team → https://iamcapital.com/team/
- Responsibility → https://iamcapital.com/responsibility/
- Investor Relations → https://iamcapital.com/investor-relations/
- News → https://iamcapital.com/latest-news/
- Contact → https://iamcapital.com/contact/

**Mobile:**
- Hamburger button (☰) - top right corner
- Slide-in menu from left
- Navy background (#19375F)
- White text links
- Auto-closes on link click

### 2. Map Section

**Map Features:**
- Height: 600px → 400px (mobile)
- Center: Europe (45.0, 10.0)
- Zoom: 5 (shows all European properties)
- **Privacy Protection:** minZoom: 5, maxZoom: 17 (prevents street-level viewing, allows cluster expansion)
- **Marker Clustering:** Groups nearby properties, navy circles with white count (Overpass font)
- **Responsive Padding:** Auto-adjusts bounds for mobile/desktop filter overlays
- Custom blue styling (#19375F base)
- FontAwesome category-based markers
- White outline (stroke-width: 20) on all markers
- Animated marker drops (staggered 100ms intervals)
- Info windows with city/country only (no street addresses)
- SOLD badges on sold property info windows
- Sold properties display with 40-60% opacity

**FontAwesome Marker Icons:**
- **Residential** (house): #2ECC71 green
- **Office** (building): #000000 black
- **Commercial** (building): #000000 black
- **Hospitality** (hotel): #7B68EE slate blue
- **Renewable Energy** (lightning bolt): #FFC107 yellow
- **Retail** (building): #000000 black
- Combined categories use appropriate primary icon

All markers: 40px size, white 20px stroke outline

**Filter System:**
- Mobile: White filter toggle button (top-left, navy bg on mobile)
- Collapsible filter overlay (glassmorphism, scrollable, compact)
- Three filter groups: Status, Category, Country
- **Multi-category filtering:** "Residential & Retail" shows under both filters
- Active filters: Navy background, white text
- Auto-zoom to filtered markers
- Syncs with property cards section filters
- Responsive marker sizing: 28px desktop, 40px mobile

### 3. Property Cards Section

**Layout:**
- Section title: "Investment Portfolio"
- Responsive grid: auto-fill, min 320px columns
- Image-first card design (16:9 ratio)

**Card Structure:**
- Property image with dark gradient overlay
- SOLD badge (top-right, red) for sold properties
- Property name + location badge (city, country only)
- Category badge (colored by category, matches markers)
- Acquisition date

**Category Badge Colors:**
- Residential: #2ECC71 (green)
- Office: #000000 (black)
- Commercial: #000000 (black)
- Hospitality: #7B68EE (purple)
- Renewable Energy: #FFC107 (yellow)
- Retail: #000000 (black)
- Combined categories display full name, colored by primary category

**Interactions:**
- Hover: Lift + border color + shadow
- Click: Zoom map + open info window + scroll to map
- Cursor: pointer

### 4. Footer

**Structure:**
- 3-column grid layout (centered, max-width 1200px)
- Navy background (#19375F)
- White logo (PNG, 131x21px)
- Overpass 16px throughout

**Columns:**
1. **Logo & Address**: Company address (London), "Get directions →" link
2. **Contact**: Phone, emails (info@, ir@), LinkedIn icon
3. **Legal Links**: Disclaimer, Legal, Fraud Awareness, Privacy, Cookie Policy

**Copyright:**
- Dynamic year (JavaScript)
- "© Copyright 2026, iAM Capital Group Ltd. All Rights Reserved"

**Mobile:**
- Single column stack
- All text left-aligned
- Footer components centered

---

## Property Data

### 27 Real Investment Properties

**Geographic Distribution:**
- France: Paris (12 properties - Bourbon, Patay, Roquette, Berthe & Ravignan, Sevres, Temple, Terre Rares, Saint Ouen, Galerie)
- Italy: Milan, Rome, Cervo, Cernusco (12 properties)
- Spain: Madrid, Cordoba, San Sebastian (3 properties)

**Status Distribution:**
- **Active**: 9 properties
- **Sold**: 18 properties

**Category Distribution:**
- **Residential**: 8 properties (house icon, green)
- **Office**: 5 properties (building icon, black)
- **Residential & Retail**: 5 properties (house icon, green)
- **Hospitality**: 3 properties (hotel icon, purple)
- **Commercial**: 2 properties (building icon, black)
- **Residential & Office**: 2 properties (house icon, green)
- **Office & Retail**: 1 property (building icon, black)
- **Retail & Office**: 1 property (building icon, black)

**Property Images:**
- 21 of 27 properties have real images sourced from iamcapital.com
- Images stored in `images/properties/` as optimized WebP (800px wide, quality 80)
- Total image size: ~1.2MB (down from 11MB originals, ~90% reduction)
- 4 properties missing images (no page on iamcapital.com): Canizares, Cordoba, San Sebastian, Terre Rares
- Image URL mapping in `working-files/property-image-urls.csv`

**Key Features:**
- Real client properties (not placeholder data)
- Pre-geocoded lat/lng coordinates (zero geocoding API cost)
- City/country display only (no street addresses for privacy)
- Real property photos for 21/27 properties (4 missing, 2 duplicates share images)
- Portfolio URLs for future detail pages

---

## Performance Optimization

### Load Time Performance
- **Before (v1.0)**: ~3-5 seconds (client-side geocoding)
- **After (v2.0)**: ~1-2 seconds (pre-geocoded)
- **Improvement**: ~2 seconds faster

**Optimizations:**
- Pre-geocoded coordinates (zero geocoding API calls)
- SVG data URLs for markers (no external requests)
- Single CSS/JS files (no framework overhead)
- Preconnect to Google Maps/Fonts
- WebP images (hero: 247KB, property images: ~1.2MB total for 21 images)
- Property images resized to 800px wide (2x retina for ~400px card width)
- Staggered marker animations (visual polish without blocking)

### API Usage
- Google Maps API: $200/month free credit (sufficient)
- Geocoding API: 0 calls per page load (was 12)
- Apps Script: Unlimited reads
- Total cost: $0/month for typical traffic

---

## Mobile Responsive Design

### Breakpoints
```css
Desktop:  1024px+ (80px header, 3-column footer)
Tablet:   768px - 1023px (responsive grid)
Mobile:   < 768px (60px header, hamburger menu, 1-column)
```

### Mobile Features
- Hamburger menu (slide-in from left, navy background)
- Horizontal scrollable navigation (fallback)
- Filter toggle button (white on navy)
- Single column property cards
- Stacked footer layout
- Touch-optimized buttons
- Auto-close menus on interaction

---

## Security & Privacy

### API Key Protection
- Google Maps API: Restricted to iamcapital.vercel.app
- HTTP referrer restrictions enabled
- API-specific restrictions (Maps JS API only)
- Billing alerts configured

### GDPR Compliance
- No cookies or tracking
- No personal data collection
- Public property data only
- No analytics
- EU-ready deployment

### Data Architecture
- Read-only API endpoint
- No write access from frontend
- Server-side validation
- XSS prevention (escapeHtml function)
- No SQL injection risk (no database)

---

## Maintenance & Updates

### Adding New Properties

**Option 1: With Pre-Geocoded Coordinates (Recommended)**
1. Add property data to Google Sheet (columns A-M)
2. Get coordinates from Google Maps (right-click → "What's here?")
3. Add latitude (column N) and longitude (column O)
4. Map loads instantly (no geocoding needed)

**Option 2: Auto-Geocode (Fallback)**
1. Add property data (columns A-M)
2. Leave lat/lng empty
3. Frontend will geocode on load (slower, uses API quota)

### Changing Marker Colors

Edit `getMarkerIcon()` function in investments.js:
```javascript
'Residential': {
    color: '#4A90E2',  // Change this hex code
    ...
}
```

### Changing Category Colors in Cards

Edit CSS in investments.css:
```css
.property-card__category[data-category="Residential"] {
    background: #4A90E2;  /* Change this */
}
```

### Updating Navigation

Edit investments.html header section:
```html
<li class="nav__item"><a href="URL" class="nav__link">Link Text</a></li>
```

---

## Version History

### Version 2.5 (2026-02-06) - Current Production
**Property Images + SEO Review**

**Property Images:**
- ✅ 21 real property images downloaded from iamcapital.com (header/carousel sources)
- ✅ All images resized to 800px wide and converted to WebP (quality 80)
- ✅ Total image payload: ~1.2MB (down from 11MB originals, ~90% reduction)
- ✅ 5 images upgraded to higher-quality carousel sources (Temple, Patay, Fulvio Testi, Depretis, Valassina)
- ✅ Image URL mapping CSV created for spreadsheet integration
- ❌ 4 properties missing (no page on iamcapital.com): Canizares, Cordoba, San Sebastian, Terre Rares

**SEO Audit (findings, not yet implemented):**
- Missing `<h1>` tag (page only has `<h2>`)
- No canonical URL (page accessible at `/`, `/investments`, `/investments.html`)
- No Open Graph / Twitter Card meta tags (important for LinkedIn sharing)
- No favicon reference
- No structured data / JSON-LD (Organization, ItemList)
- No robots.txt or sitemap.xml on Vercel deployment
- No `<meta name="robots">` directive
- Property content entirely JS-rendered (invisible to crawlers without JS execution)
- Property card images use CSS `background-image` (no alt text possible)
- Redundant index.html redirect (vercel.json rewrite handles it)

**Commits:**
- Add property header images from iamcapital.com
- Optimize property images: resize to 800px, convert to WebP
- Replace 5 property images with better carousel sources
- Replace Fulvio Testi image with facade photo

### Version 2.4 (2026-02-06)
**Typography & UX Refinements**

**Cluster Marker Improvements:**
- ✅ Cluster marker text uses Overpass font (matches page typography)
- ✅ Increased maxZoom from 15 to 17 for better cluster expansion
- ✅ Clusters now properly separate when clicked

**Commits:**
- Update cluster marker font to Overpass
- Increase maxZoom to 17 for better cluster expansion

### Version 2.3 (2026-02-05)
**Major Update: Real Properties + Enhanced Privacy**

**Real Property Data:**
- ✅ 27 real client properties (18 Sold, 9 Active)
- ✅ Pre-geocoded coordinates (zero ongoing API cost)
- ✅ Italy and Spain locations
- ✅ 8 category types (including combinations)

**Privacy & Security:**
- ✅ Removed all street addresses (city/country only)
- ✅ MaxZoom: 15 (allows cluster expansion, prevents street detail)
- ✅ SOLD badges on cards and info windows
- ✅ Sold properties display with reduced opacity (40-60%)

**Filtering & UX:**
- ✅ Marker clustering (navy circles, groups nearby properties)
- ✅ Status filters (All/Active/Sold) on map and cards
- ✅ Multi-category filtering (combined categories work correctly)
- ✅ Compact filter menu (scrollable, smaller fonts)
- ✅ Responsive marker sizing (28px desktop, 40px mobile)
- ✅ Two-row filter layout in cards section

**Design Updates:**
- ✅ Removed hero section
- ✅ Removed company description
- ✅ Updated category colors (green residential, black office/commercial)
- ✅ Lightning bolt icon for renewable energy (yellow)

**Commits (20+ today):**
- Remove hero section and company description
- Add status filter and support for new property categories
- Add marker clustering for overlapping properties
- Privacy improvements (remove addresses, SOLD badges)
- Fix cluster zoom expansion (maxZoom 12→15)
- Split combined categories for better filtering
- Add full filter set to property cards section
- Fix category filter buttons event listeners

### Version 2.2 (2026-02-05)
**Initial Privacy & UI Updates:**
- Privacy protection: maxZoom 12
- Renewable energy icon: Yellow lightning bolt
- Mobile map centering fixes

### Version 2.1 (2026-01-30)
**Major Design & UX Updates:**
- ✅ FontAwesome category-based map markers (house, building, hotel, leaf)
- ✅ Category color coding (markers + card badges match)
- ✅ White header with full iAM Capital navigation (7 menu items)
- ✅ Footer matching iamcapital.com exactly (3-column layout)
- ✅ Mobile hamburger menu (slide-in, navy background)
- ✅ White outline on markers (stroke-width: 20)
- ✅ Navy filter button on mobile
- ✅ Overpass 16px throughout header/footer
- ✅ Logo updates (header: WebP, footer: PNG)
- ✅ Dynamic copyright year
- ✅ Working-files folder structure

**Files Updated:**
- investments.js (FontAwesome markers, mobile menu, category colors)
- investments.css (header/footer redesign, category badges, mobile responsive)
- investments.html (navigation, footer, mobile toggle)
- .gitignore (working-files exclusion)

**Commits:**
- 72 commits total
- Latest: Category color matching, marker outlines, mobile menu

### Version 2.0 (2026-01-29)
**Performance Optimization:**
- ✅ Pre-geocoded coordinates (lat/lng in sheet)
- ✅ Apps Script v2 with coordinate support
- ✅ ~2 second load time improvement
- ✅ Zero geocoding API calls

### Version 1.5 (2026-01-29)
**UX Improvements:**
- ✅ Filter label improvements
- ✅ Button hover fixes
- ✅ Stable commit restoration

### Version 1.4 (2026-01-29)
**Image-Based Cards:**
- ✅ Professional property images (Unsplash CDN)
- ✅ 4-category system (Residential, Commercial, Hospitality, Renewable)
- ✅ 12 properties total

### Version 1.0 (2026-01-26)
**Initial Release:**
- ✅ Serverless architecture
- ✅ 10 sample properties
- ✅ Basic map + cards
- ✅ GitHub + Vercel deployment

---

## Development Workflow

### Making Changes

**Update Property Data:**
1. Edit Google Sheet directly
2. Changes appear in 1-5 minutes
3. No code deployment needed

**Update Styles:**
1. Edit investments.css
2. Test locally: `python3 -m http.server 8000`
3. Commit + push to GitHub
4. Vercel auto-deploys

**Update JavaScript:**
1. Edit investments.js
2. Test locally
3. Check browser console for errors
4. Commit + push

**Deploy:**
```bash
git add .
git commit -m "Description"
git push origin main
# Vercel auto-deploys in ~30 seconds
```

### File Organization

**Production Files (in Git):**
- index.html, investments.html
- investments.css, investments.js
- images/, vercel.json
- .gitignore, CLAUDE.md

**Working Files (not in Git):**
- working-files/ directory
- Reference scripts
- Deployment guides
- Sample data

---

## Quick Reference

### Live URLs
- **Production**: https://iamcapital.vercel.app/
- **GitHub**: https://github.com/websitelab/iamcapital/
- **Apps Script v2**: https://script.google.com/.../AKfycbzd8F3e1nlUPY8ybszTpiopyWpLU8pZ3JL15tWHBArrWvCWFyGuZydFAStZPp6MIOPzMQ/exec

### Colors
```css
Navy:   #19375F (brand, header, footer)
Green:  #2ECC71 (residential markers)
Black:  #000000 (office/commercial/retail markers)
Purple: #7B68EE (hospitality markers)
Yellow: #FFC107 (renewable markers)
Red:    #DC2626 (SOLD badges)
White:  #FFFFFF
```

### Key Dimensions
```css
Header: 80px (60px mobile)
Map height: 600px → 400px (mobile)
Map zoom: min 5, max 17 (privacy + cluster expansion)
Marker size: 28px desktop, 40px mobile (stroke: 20px white)
Cluster size: 60px (navy circle, white count, Overpass font)
Logo header: 50px (35px mobile)
Logo footer: 131px × 21px
SOLD badge: Red (#DC2626), top-right corner
```

---

## Support & Documentation

**Working Files (Local Only):**
- `working-files/DEPLOYMENT-GUIDE-v2.md` - Setup instructions
- `working-files/README-INVESTMENTS.md` - Original setup guide
- `working-files/google-apps-script-v2.js` - Current server code
- `working-files/sample-properties.csv` - Property data with coordinates
- `working-files/property-image-urls.csv` - Image URLs in spreadsheet order
- `working-files/new-images/` - Source images for replacements

**Google Documentation:**
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Google Apps Script](https://developers.google.com/apps-script)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [FontAwesome Icons](https://fontawesome.com/icons)

**API Console:**
- [Google Cloud Console](https://console.cloud.google.com) - Monitor usage

---

**Last Updated**: February 6, 2026
**Status**: Live in Production
**Version**: 2.5
**Live URL**: https://iamcapital.vercel.app/

**Property Count**: 27 real properties (18 Sold, 9 Active)
**Property Images**: 21/27 with real photos (4 missing: Canizares, Cordoba, San Sebastian, Terre Rares)
**Zero Cost**: Pre-geocoded coordinates = $0/month API usage
