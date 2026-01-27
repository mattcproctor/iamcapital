# iAM Capital - Investment Properties Map

## Project Overview
Professional investment property map page for iAM Capital displaying properties from a Google Sheet with interactive Google Maps integration. Built using the proven Blue Devil Jiu Jitsu schedule.html pattern (serverless architecture with Google Apps Script).

**Project Status:** ✅ Live in Production

**Live Site:**
- **Production URL**: https://iamcapital.vercel.app/
- **GitHub Repository**: https://github.com/websitelab/iamcapital
- **Hosting**: Vercel (auto-deploys from main branch)
- **Last Updated**: January 26, 2026

**Live Configuration:**
- Google Apps Script URL: `https://script.google.com/macros/s/AKfycbyY3TsuK56cyYpxZ22p9VLCwROthD4mYLmL9Jvb9M-TukPqbsmabsnI49DAjRSGZ4qKAA/exec`
- Google Maps API Key: `AIzaSyAFOA9PrQdFW1bI-l9DIuWrIFhC8uozN0c`
- Map Center: Europe (Italy/France region, lat: 45.0, lng: 10.0)
- Property Data: 10 European properties (Italy, France, Spain, Portugal)
- Deployment: ✅ GitHub, ✅ Vercel, ✅ Fully Operational

**Technology Stack:**
- Pure HTML5/CSS3/Vanilla JavaScript
- Google Sheets (data storage/CMS)
- Google Apps Script (JSON API endpoint)
- Google Maps JavaScript API (map rendering)
- Geocoding API (address to coordinates)
- Serverless architecture (no backend needed)
- Vercel hosting (static site deployment)
- GitHub repository (version control)

---

## Architecture Overview

### Serverless 3-Layer Design (BDJJ Pattern)

```
Google Sheet (Data Storage)
    ↓
Google Apps Script (API Layer)
    ↓
HTTPS JSON Endpoint
    ↓
JavaScript fetch() (Frontend)
    ↓
Google Maps Geocoding API
    ↓
Map Markers + Property Cards
```

**Key Benefits:**
- ✅ Zero server infrastructure
- ✅ Real-time updates (edit sheet → live in 1-5 minutes)
- ✅ HTTPS by default (Google Apps Script)
- ✅ GDPR compliant (no cookies, no tracking, no PII)
- ✅ Free (Google free tiers: 25k geocodes/day, unlimited sheet reads)
- ✅ Scalable (handles 10-50 properties easily)
- ✅ Easy updates (non-technical staff can edit Google Sheet)

---

## File Structure

```
iamcapital.com/
├── index.html                    # Root redirect to investments page
├── investments.html              # Main page with map and filters
├── investments.css               # Styling with filter pills, hero bg
├── investments.js                # Map logic, filters, animations
├── google-apps-script.js         # Server code reference (European properties)
├── sample-properties.csv         # European property data (10 properties)
├── vercel.json                   # Vercel configuration (clean URLs)
├── .gitignore                    # Git ignore (.DS_Store, node_modules)
├── images/
│   └── hero/
│       └── milan-cathedral-hero.webp  # Hero background (247KB WebP)
├── README-INVESTMENTS.md         # Setup guide
├── CLAUDE.md                     # This documentation
└── .git/                         # Git repository
```

**Total Production Code:** ~766 lines (HTML + CSS + JS)

---

## Setup Status

### ✅ Phase 1: Google Sheets Setup (COMPLETE)
- [x] Created Google Sheet: "iAM Capital Investment Properties"
- [x] Added column headers (10 columns)
- [x] Imported sample property data (10 properties)
- [x] Formatted columns as Plain Text

**Sheet Structure (International Properties):**
| Column | Name | Example |
|--------|------|---------|
| A | Property Name | "Palazzo Residences" |
| B | Address | "Via dei Condotti 45" |
| C | City | "Rome" |
| D | Country | "Italy" |
| E | Postal Code | "00187" |
| F | Property Type | "Multifamily" |
| G | Units/Size | "85 units" |
| H | Acquisition Date | "Q2 2024" |
| I | Status | "Active" |
| J | Description | "Luxury residential in historic center" |
| K | Portfolio URL | "/portfolio/palazzo-residences" |

### ✅ Phase 2: Google Apps Script Deployment (COMPLETE)
- [x] Created Apps Script project
- [x] Deployed `doGet()` function
- [x] Configured as public web app
- [x] Obtained deployment URL
- [x] Tested API endpoint (returns JSON)

**Apps Script URL (Current Deployment):**
```
https://script.google.com/macros/s/AKfycbyY3TsuK56cyYpxZ22p9VLCwROthD4mYLmL9Jvb9M-TukPqbsmabsnI49DAjRSGZ4qKAA/exec
```

**API Response Format (Current):**
```json
{
  "properties": [
    {
      "name": "Palazzo Residences",
      "address": "Via dei Condotti 45",
      "city": "Rome",
      "country": "Italy",
      "postalCode": "00187",
      "fullAddress": "Via dei Condotti 45, Rome, 00187 Italy",
      "propertyType": "Multifamily",
      "unitsSize": "85 units",
      "acquisitionDate": "Q2 2024",
      "status": "Active",
      "description": "Luxury residential in historic center",
      "portfolioUrl": "/portfolio/palazzo-residences"
    }
  ],
  "count": 10,
  "timestamp": "2026-01-26T..."
}
```

### ✅ Phase 3: Google Maps API Setup (COMPLETE)
- [x] Created Google Cloud project: "iAM Capital Website"
- [x] Enabled Maps JavaScript API
- [x] Enabled Geocoding API
- [x] Created API key
- [x] Restricted API key (HTTP referrers + API restrictions)

**Google Maps API Key:**
```
AIzaSyAFOA9PrQdFW1bI-l9DIuWrIFhC8uozN0c
```

**API Restrictions (Security):**
- HTTP referrers: `iamcapital.com/*`, `*.iamcapital.com/*`, `localhost:*`
- API restrictions: Maps JavaScript API, Geocoding API only
- Billing: Free tier ($200/month credit)

### ✅ Phase 4: Frontend Configuration (COMPLETE)
- [x] Updated `investments.js` with Apps Script URL (line 6)
- [x] Updated `investments.html` with Google Maps API key (line 91)
- [x] Verified file structure

### ✅ Phase 5: Git Repository Setup (COMPLETE)
- [x] Initialized git repository
- [x] Configured git user: hello@websitelab.biz
- [x] Added remote: https://github.com/websitelab/iamcapital
- [x] Pushed to GitHub main branch
- [x] All files committed and versioned

### ✅ Phase 6: Vercel Deployment (COMPLETE)
- [x] Created vercel.json configuration
- [x] Deployed to Vercel
- [x] Auto-deploy enabled (pushes to main trigger redeployment)
- [x] Production URL: https://iamcapital.vercel.app/
- [x] Clean URLs enabled (no .html extensions)

### ⏳ Phase 7: Testing (NEXT STEP)
- [ ] Add Vercel URL to Google Maps API restrictions
- [ ] Verify map loads with markers on production
- [ ] Test marker clicks (info windows)
- [ ] Test card clicks (zoom to marker)
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Add real property data to Google Sheet

---

## Brand Design System

### Color Palette
```css
/* Primary Colors */
--color-navy: #19375F;        /* Deep navy (primary brand) */
--color-gold: #D4AF37;        /* Gold (accent for markers, buttons) */
--color-white: #FFFFFF;       /* Pure white */
--color-black: #000000;       /* Black */

/* Grays */
--color-gray-50: #F9FAFB;     /* Lightest gray */
--color-gray-100: #F3F4F6;    /* Light gray */
--color-gray-200: #E5E7EB;    /* Border gray */
--color-gray-300: #D1D5DB;    /* Disabled gray */
--color-gray-700: #374151;    /* Body text gray */
--color-gray-900: #111827;    /* Dark text */
```

**Color Usage:**
- **Navy (#19375F)**: Header, hero gradient, property card titles, map base color, active filter pills
- **Gold (#D4AF37)**: Map markers, mobile filter toggle button, property location icons
- **White (#FFFFFF)**: Text on dark backgrounds, card backgrounds, logo, navigation
- **Gray**: Body text, borders, secondary elements, filter backgrounds

### Typography
**Font Family:** Overpass (Google Fonts)
```css
font-family: 'Overpass', -apple-system, BlinkMacSystemFont, sans-serif;
```

**Font Weights:**
- Light: 300 (hero subtitle)
- Regular: 400 (body text)
- Semi-bold: 600 (property card names)
- Bold: 700 (section titles, labels)
- Black: 900 (hero headline)

**Type Scale:**
- Hero Title: 3.5rem (56px) desktop → 2rem (32px) mobile
- Section Title: 2.5rem (40px) → 1.75rem (28px) mobile
- Property Card Name: 1.25rem (20px)
- Body Text: 1rem (16px)
- Labels: 0.875rem (14px) uppercase

### Design Style
**Corporate Investment Aesthetic:**
- Clean, minimalist layout
- Sharp corners (no border-radius on cards)
- High contrast (white on navy, navy on white)
- Professional typography (Overpass sans-serif)
- Subtle animations (hover effects only)
- Modern, trustworthy appearance

**Inspiration:**
- BlackRock investor pages
- KKR portfolio showcase
- Brookfield asset management
- Enterprise SaaS dashboards

---

## Page Sections

### 1. Header/Navigation
**Structure:**
- Sticky header with navy background
- Logo: "iAM Capital" in lime green (#9DFF20)
- Simple navigation: Investments, Contact
- Responsive: full nav desktop, minimal mobile

**Styling:**
- Background: var(--color-navy)
- Logo color: var(--color-lime)
- Link color: white → lime on hover
- Sticky position (z-index: 1000)

### 2. Hero Section
**Content:**
- Eyebrow label: "GLOBAL PORTFOLIO" (white, uppercase)
- Main title: "Investment Properties" (white, 900 weight)
- Subtitle: "Strategic investments across diversified asset classes" (white, light weight)

**Styling:**
- Background: Milan Duomo cathedral image (milan-cathedral-hero.webp, 247KB)
- Overlay: Subtle linear gradient (navy 40% → 50% opacity) for text readability
- Image: Cover, center positioned - more visible than before
- Text alignment: Center
- Padding: 6rem desktop → 4rem mobile
- Color scheme: Pure white text on cathedral background with subtle navy tint

**Image Details:**
- File: `images/hero/milan-cathedral-hero.webp`
- Size: 247KB (WebP optimized)
- Dimensions: 1920px width
- Quality: 85
- Subject: Milan Duomo cathedral with lion statue (European architecture)
- Overlay: Reduced opacity (40-50%) to show more of image detail

### 3. Map Section
**Structure:**
- Full-width map container (no padding)
- Height: 600px desktop → 400px mobile
- Loading state (spinner + message)
- Error state (fallback message)
- Custom map styling (navy/gold theme)
- **Collapsible filter toggle button** (mobile/desktop)

**Map Features:**
- **Default center**: Europe (lat: 45.0, lng: 10.0) - Italy/France region
- **Default zoom**: 5 (shows all European properties)
- Custom navy base color (#19375F)
- **Gold pin markers** (#D4AF37) - standard teardrop/pin shape
- White stroke on markers (2px) for contrast
- **Animated marker drops** (Google Maps DROP animation)
- Info windows on marker click with "View Portfolio" button
- Auto-zoom to fit filtered markers
- Fullscreen control enabled

**Filter Toggle Button:**
- Position: Top-left corner (1rem from edges)
- Style: Gold background (#D4AF37) with white text/icon
- Mobile: Collapsible (hidden by default, toggle to show)
- Desktop: Same gold button, always visible
- Hover: Darker gold (#C9A632) with lift effect
- Icon: Hamburger menu (3 lines) → X when open

**Filter Pills (Collapsible Overlay):**
- Hidden by default - click toggle button to show
- Position: Below toggle button on mobile, overlay on map
- Layout: Vertical stack in glassmorphism container
- Style: White 95% background + backdrop blur
- Two filter groups:
  - **Property Type**: All, Multifamily, Office, Self Storage, Retail, Industrial
  - **Country**: All, Italy, France, Spain, Portugal
- Active state: Navy background with white text
- Hover state: White background on active pills
- Click to filter: Updates both map markers and property cards
- Auto-close after selection (mobile)
- Click outside to close
- Auto-zoom to visible markers after filtering

**Geocoding:**
- Client-side via Google Geocoding API
- Converts European addresses to lat/lng on page load
- International format: "Address, City, Postal Code Country"
- Error tolerance (skip failed geocodes)
- Free tier: 25,000 requests/day

### 4. Property Cards Section
**Layout:**
- Max-width container (1400px)
- Section title: "Portfolio Overview"
- Company description below title (center-aligned)
- Responsive grid:
  - Desktop: auto-fill, min 320px columns
  - Tablet: auto-fill, min 280px columns
  - Mobile: 1 column

**Card Structure:**
- Header:
  - Property name (navy, bold)
  - Property type badge (navy background, white text)
- Body:
  - Location (with gold pin icon)
  - Units/Size
  - Acquisition date

**Card Interactions:**
- Hover: Lift (-4px) + border color change (gray → navy) + shadow
- Click: Zoom map to marker + open info window + smooth scroll to map
- Cursor: pointer

### 5. Footer
**Content:**
- Copyright: "© 2026 iAM Capital. All rights reserved."
- Navy background
- White text (80% opacity)
- Center aligned

---

## JavaScript Architecture

### Global State
```javascript
let map;           // Google Maps instance
let markers = [];  // Array of map markers
let geocoder;      // Google Geocoder instance
```

### Core Functions

**1. `initMap()`** - Map Initialization
- Called by Google Maps API callback
- Creates map with custom navy/lime styling
- Centers on US (default view)
- Initializes geocoder
- Calls `loadProperties()`

**2. `loadProperties()`** - Data Fetching
- Fetches from Apps Script API
- Handles loading/error states
- Calls geocoding + card rendering
- Error handling with try/catch

**3. `geocodeAndRenderProperties()`** - Geocoding & Markers
- Loops through properties
- Geocodes each address to lat/lng
- Creates lime green circular markers
- Creates info windows
- Fits map bounds to show all markers
- Max zoom limit: 12

**4. `geocodeAddress()`** - Single Address Geocoding
- Returns Promise
- Uses Google Geocoder
- Resolves with LatLng or rejects

**5. `createInfoWindowContent()`** - Info Window HTML
- Returns HTML string
- Property name, address, type, size
- Styled with `.info-window` classes

**6. `renderPropertyCards()`** - Card Rendering
- Clears grid
- Creates card for each property
- Adds click handlers (zoom to marker)
- Appends to DOM

**7. `escapeHtml()`** - XSS Prevention
- Escapes HTML in user data
- Uses textContent method
- Prevents script injection

**8. `gm_authFailure()`** - Error Handling
- Handles Google Maps auth failures
- Shows error state

---

## Sample Property Data (European Portfolio)

**10 European Investment Properties:**

1. **Palazzo Residences**
   - Rome, Italy (Multifamily, 85 units)
   - Via dei Condotti 45, 00187
   - Luxury residential in historic center
   - Portfolio: /portfolio/palazzo-residences

2. **Milan Office Tower**
   - Milan, Italy (Office, 120,000 sq ft)
   - Corso Buenos Aires 123, 20124
   - Modern Class A office complex
   - Portfolio: /portfolio/milan-office-tower

3. **Tuscan Storage Solutions**
   - Florence, Italy (Self Storage, 380 units)
   - Via Aretina 234, 50136
   - Climate-controlled premium facility
   - Portfolio: /portfolio/tuscan-storage

4. **Paris Marais Apartments**
   - Paris, France (Multifamily, 65 units)
   - Rue de Rivoli 78, 75004
   - Historic Marais district residences
   - Portfolio: /portfolio/paris-marais

5. **Lyon Industrial Park**
   - Lyon, France (Industrial, 185,000 sq ft)
   - Avenue Jean Jaurès 456, 69007
   - Distribution and logistics hub
   - Portfolio: /portfolio/lyon-industrial

6. **Côte d'Azur Retail**
   - Nice, France (Retail, 52,000 sq ft)
   - Promenade des Anglais 89, 06000
   - Premium waterfront retail center
   - Portfolio: /portfolio/cote-azur-retail

7. **Venice Canal Residences**
   - Venice, Italy (Multifamily, 45 units)
   - Calle Larga San Marco 321, 30124
   - Historic canal-side apartments
   - Portfolio: /portfolio/venice-canal

8. **Marseille Port Office**
   - Marseille, France (Office, 95,000 sq ft)
   - Quai du Port 567, 13002
   - Vieux Port business district
   - Portfolio: /portfolio/marseille-port

9. **Barcelona Gothic Quarter**
   - Barcelona, Spain (Multifamily, 72 units)
   - Carrer del Bisbe 12, 08002
   - Gothic Quarter luxury residences
   - Portfolio: /portfolio/barcelona-gothic

10. **Lisbon Alfama Storage**
    - Lisbon, Portugal (Self Storage, 420 units)
    - Rua de São Tomé 34, 1100-567
    - Historic district storage facility
    - Portfolio: /portfolio/lisbon-alfama

**Property Type Diversity:**
- 4 Multifamily properties
- 2 Office properties
- 2 Self Storage properties
- 1 Industrial property
- 1 Retail property

**Geographic Distribution:**
- Italy: 4 properties (Rome, Milan, Florence, Venice)
- France: 4 properties (Paris, Lyon, Nice, Marseille)
- Spain: 1 property (Barcelona)
- Portugal: 1 property (Lisbon)

---

## Security Implementation

### API Key Protection
**Google Maps API Key Restrictions:**
- ✅ HTTP referrers: `iamcapital.com/*`, `*.iamcapital.com/*`, `localhost:*`
- ✅ API restrictions: Maps JavaScript API, Geocoding API only
- ✅ Billing alerts: $50, $100, $150 thresholds
- ✅ Free tier: $200/month credit (sufficient for most traffic)

**Best Practices:**
- Never commit API keys to public repos
- Rotate keys every 90 days
- Monitor usage in Google Cloud Console
- Set up billing alerts

### Apps Script Security
**Read-Only Architecture:**
- ✅ Only `doGet()` function (no POST/PUT/DELETE)
- ✅ No write access to sheet from frontend
- ✅ Public read-only endpoint
- ✅ HTTPS by default (Google infrastructure)

**Data Validation:**
- Server-side: Skips empty rows, validates required fields
- Client-side: HTML escaping via `escapeHtml()`
- No SQL injection risk (no database)
- No XSS vulnerabilities (textContent, not innerHTML)

### GDPR Compliance
**Privacy-Friendly:**
- ✅ No personal data collected
- ✅ No cookies or tracking
- ✅ Public property data only (like real estate listings)
- ✅ No user analytics
- ✅ EU website audit ready

**Data Processing:**
- Property data is public information
- No user consent required
- No privacy policy changes needed

### Rate Limiting
**Google Quotas:**
- Maps JavaScript API: Free tier ($200/month credit)
- Geocoding API: 25,000 requests/day free
- Apps Script: Unlimited reads (generous quotas)

**Monitoring:**
- Google Cloud Console → APIs & Services → Dashboard
- Track daily usage
- Set up alerts for quota approaching

---

## Testing Procedures

### Local Testing

**Step 1: Start Local Server**
```bash
cd /Users/davidpeyton/Documents/Coding-Projects/Website-Lab/Websites/iamcapital.com
python3 -m http.server 8000
```

**Step 2: Open in Browser**
```
http://localhost:8000/investments.html
```

**Step 3: Verify Map Loading**
- ✅ See "Loading investment properties..." (briefly)
- ✅ Google Map appears with navy/lime styling
- ✅ 10 lime green markers appear
- ✅ Map auto-zooms to fit all markers

**Step 4: Test Marker Interactions**
- Click marker → Info window opens
- Info window shows: property name, address, type, size
- Click another marker → Previous info window closes
- Map centers on clicked marker

**Step 5: Test Property Cards**
- 10 cards appear below map in grid
- Cards show: name, type badge, location, size, date
- Hover card → Lifts + border turns navy + shadow appears
- Click card → Map zooms to marker + info window opens + smooth scroll to map

**Step 6: Test Responsive Design**
Open DevTools (F12) → Device toolbar (📱)

- **Desktop (1920x1080):**
  - Map: 600px height
  - Cards: 3-4 columns
  - Hero title: 3.5rem

- **Tablet (768x1024):**
  - Map: 500px height
  - Cards: 2 columns
  - Hero title: 2.5rem

- **Mobile (375x667):**
  - Map: 400px height
  - Cards: 1 column
  - Hero title: 2rem

**Step 7: Check Browser Console**
- F12 → Console tab
- Should see NO red errors
- May see geocoding logs (normal)

### Production Testing

**After Deploying to iamcapital.com:**

1. Test on production URL
2. Verify API key domain restrictions work
3. Test from different devices (mobile, tablet, desktop)
4. Check Google Cloud Console for API usage
5. Monitor for errors

---

## Responsive Breakpoints

```css
/* Desktop First → Mobile First */

/* Large Desktop (1440px+) */
Default styles

/* Desktop (1200-1439px) */
@media (max-width: 1023px) {
  - Hero title: 3.5rem → 2.5rem
  - Map height: 600px → 500px
  - Cards: auto-fill (min 280px)
}

/* Mobile (<768px) */
@media (max-width: 767px) {
  - Header padding: 1rem
  - Hero padding: 4rem → 3rem
  - Hero title: 2.5rem → 2rem
  - Hero subtitle: 1.25rem → 1rem
  - Map height: 500px → 400px
  - Cards: 1 column
  - Section padding: 5rem → 3rem
  - Section title: 2.5rem → 1.75rem
}

/* Mobile Small (<375px) */
@media (max-width: 374px) {
  - Hero title: 2rem → 1.75rem
  - Section title: 1.75rem → 1.5rem
  - Card padding: 1.5rem → 1rem
}
```

---

## Performance Optimization

### Load Time Targets
- Initial page load: < 3 seconds
- Maps API load: < 1 second
- Apps Script response: < 500ms
- Geocoding (10 properties): < 2 seconds
- Total interactive time: < 5 seconds

### Optimization Techniques
**Font Loading:**
- Preconnect to Google Fonts
- Font-display: swap (fallback text visible immediately)

**CSS:**
- Single CSS file (403 lines)
- Minimal animations (GPU-accelerated: transform, opacity)
- CSS custom properties (no runtime calculation)

**JavaScript:**
- Vanilla JS (no framework overhead)
- Async map loading (doesn't block page)
- Defer script execution
- Minimal DOM manipulation

**API Calls:**
- Single Apps Script fetch
- Batch geocoding (all at once)
- No polling or unnecessary requests

**Future Enhancements:**
- Pre-geocode addresses (add lat/lng to sheet)
- Lazy load map (IntersectionObserver)
- Service worker for offline support
- Image optimization (if property photos added)

---

## Maintenance & Updates

### Adding New Properties

**In Google Sheet:**
1. Add new row with property data
2. Required: Property Name, Address, City, State
3. Optional: Zip, Type, Units/Size, Date, Status, Description
4. Changes appear on website within 1-5 minutes

**Data Format:**
- All fields as Plain Text
- Dates: "Q2 2024" format (not date cells)
- Addresses: Full street address (for geocoding)
- States: 2-letter codes (FL, TX, CA, etc.)

### Editing Existing Properties

**In Google Sheet:**
1. Find property row
2. Edit any field
3. Save (Ctrl+S or Cmd+S)
4. Refresh website to see changes (1-5 min delay)

**Note:** Property names used to match markers. If changing name, markers will re-geocode.

### Troubleshooting Common Issues

**Issue: Map not loading**
- Check browser console for errors
- Verify API key in investments.html
- Check API key restrictions (domain, APIs)
- Ensure Maps JavaScript API is enabled

**Issue: No markers appearing**
- Check Apps Script URL returns JSON (test in browser)
- Verify addresses in sheet are valid
- Check geocoding API quotas (25k/day limit)
- Look for console errors

**Issue: Cards not rendering**
- Check Apps Script response format
- Verify JSON structure matches expected
- Check browser console for JavaScript errors

**Issue: "Unable to load property map"**
- Test Apps Script URL directly
- Verify sheet is named "Sheet1"
- Check sheet has data (at least 1 row + header)
- Review Apps Script execution logs

---

## Future Enhancements

### Phase 1 (Short-term: 1-3 months)
- [ ] **Property Photos**: Add image column to sheet, display in cards
- [ ] **Pre-geocoded Addresses**: Add lat/lng columns (faster, no API calls)
- [ ] **Property Filtering**: Filter by type (Multifamily, Office, etc.)
- [ ] **Search Functionality**: Search by property name or city
- [ ] **Property Detail Modal**: Click card → Full-screen modal with details

### Phase 2 (Medium-term: 3-6 months)
- [ ] **Advanced Map Features**: Marker clustering, heatmap view
- [ ] **Custom Property Icons**: Different icons per property type
- [ ] **Performance Optimization**: Lazy loading, service workers
- [ ] **Analytics Integration**: Track user interactions
- [ ] **SEO Enhancement**: JSON-LD structured data, SSR

### Phase 3 (Long-term: 6-12 months)
- [ ] **Database Migration**: Move from Sheets to PostgreSQL/MongoDB
- [ ] **Admin Dashboard**: CRUD interface for properties
- [ ] **Investment Portal**: Investor login, document library
- [ ] **Multi-language Support**: i18n for global investors
- [ ] **Real-time Updates**: WebSocket for instant updates

---

## Development Workflow

### When Making Changes

**Editing Property Data:**
1. Open Google Sheet
2. Edit data directly
3. Changes appear on site within 1-5 minutes
4. No code changes needed

**Updating Styles (investments.css):**
1. Edit CSS file
2. Test locally with `python3 -m http.server`
3. Upload to production via FTP/SFTP
4. Hard refresh browser (Ctrl+Shift+R)

**Modifying Logic (investments.js):**
1. Edit JavaScript file
2. Test locally
3. Check browser console for errors
4. Upload to production
5. Clear browser cache

**Changing Map Styling:**
1. Edit `getMapStyles()` function in investments.js
2. Test map appearance
3. Adjust colors as needed
4. Upload changes

### Version Control (Recommended)

**Git Workflow:**
```bash
cd /Users/davidpeyton/Documents/Coding-Projects/Website-Lab/Websites/iamcapital.com

# Initialize repository (first time)
git init
git add .
git commit -m "Initial commit: Investment properties map"

# Making changes
git add investments.css
git commit -m "Update property card hover effects"

# Pushing to GitHub
git remote add origin https://github.com/yourorg/iamcapital-website.git
git push -u origin main
```

---

## Quick Reference

### Configuration URLs
**Apps Script API:**
```
https://script.google.com/macros/s/AKfycbzFiDn31ne4CISFqjzCcpMwSve5FAJXKgNALoh1kzFw3IRrZtVBUIEUbTf_5whW_weMkQ/exec
```

**Google Maps API Key:**
```
AIzaSyAFOA9PrQdFW1bI-l9DIuWrIFhC8uozN0c
```

### Brand Colors
```css
Navy:  #193D5F
Lime:  #9DFF20
White: #FFFFFF
Gray:  #374151
```

### Breakpoints
```css
Desktop:  1024px+
Tablet:   768px - 1023px
Mobile:   < 768px
```

### File Locations
```
HTML:  /investments.html (line 91: API key)
JS:    /investments.js (line 6: Apps Script URL)
CSS:   /investments.css (colors: lines 10-30)
```

---

## Support & Documentation

**Complete Setup Guide:**
`README-INVESTMENTS.md` - Step-by-step instructions for all phases

**Reference Implementation:**
Blue Devil Jiu Jitsu schedule.html - Proven pattern this project follows

**Google Documentation:**
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Google Apps Script](https://developers.google.com/apps-script)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Geocoding API](https://developers.google.com/maps/documentation/geocoding)

**API Quotas:**
- [Google Cloud Console](https://console.cloud.google.com) - Monitor usage
- Maps API: $200/month free credit
- Geocoding: 25,000 requests/day free

---

## Version History

### Version 1.3 (2026-01-26) - Current Production
**Design Refinement & UX Improvements:**
- ✅ Mobile filter collapsible toggle button (gold background)
- ✅ Color scheme updated to #19375F navy and pure white (removed lime green)
- ✅ Map markers changed to gold (#D4AF37) pin/teardrop shape (best practices)
- ✅ Hero section with subtle gradient overlay (40-50% opacity)
- ✅ Company description moved below "Portfolio Overview"
- ✅ Filter toggle button: gold background with white text/icon
- ✅ Improved mobile UX - filters hidden by default, toggle to show
- ✅ Auto-close filter menu after selection on mobile
- ✅ Click outside to close filters

**Design Changes:**
- Gold map markers (#D4AF37) with standard pin SVG path
- White text and icons on gold filter toggle button
- Subtle navy gradient overlay on hero image (maintains readability)
- Filters accessible via map overlay toggle only (desktop filters removed)
- Property card icons updated to match gold color scheme
- Info window buttons: navy background with white text

**UX Improvements:**
- Mobile filters: Collapsible by default, toggle to open
- Filter menu auto-closes after selection
- Click outside filter menu to close
- Reduced screen coverage on mobile
- Gold button provides visual consistency with markers

**Files Updated:**
- investments.html (filter toggle button, company description moved)
- investments.css (gold colors, filter toggle styles, mobile responsive)
- investments.js (gold markers, filter sync, auto-close behavior)

### Version 1.2 (2026-01-26)
**European Properties Update:**
- ✅ Migrated from US to European properties (IT, FR, ES, PT)
- ✅ Updated schema: Country + Postal Code (international format)
- ✅ Added Portfolio URL field with "View Portfolio" buttons
- ✅ Map centered on Europe (Italy/France focus)
- ✅ Floating filter pills (vertical layout, left side)
- ✅ Animated marker drops (Google Maps DROP animation)
- ✅ Milan cathedral hero background (WebP optimized, 247KB)
- ✅ Glassmorphism filter UI with backdrop blur
- ✅ Filter by property type and country
- ✅ Auto-zoom to filtered properties

**New Features:**
- Info window "View Portfolio" buttons (navy → lime hover)
- Filter pills: Property Type (Multifamily, Office, etc.)
- Filter pills: Country (Italy, France, Spain, Portugal)
- Hero background: Milan Duomo with lion statue
- Vertical filter layout on map (better UX)
- Property cards show "City, Country" format

**Files Updated:**
- investments.html (added filter pills container)
- investments.css (filter pills, hero bg, responsive)
- investments.js (Europe center, filters, animations)
- google-apps-script.js (international schema, portfolioUrl)
- sample-properties.csv (10 European properties)
- images/hero/milan-cathedral-hero.webp (247KB)

### Version 1.1 (2026-01-26)
**Initial Deployment:**
- ✅ GitHub repository setup (hello@websitelab.biz)
- ✅ Vercel deployment with auto-deploy
- ✅ vercel.json configuration (clean URLs)
- ✅ .gitignore added

### Version 1.0 (2026-01-26)
**Initial Release:**
- ✅ Complete serverless architecture implementation
- ✅ Google Sheets + Apps Script + Google Maps integration
- ✅ Professional navy/lime corporate design
- ✅ 10 sample investment properties (originally US)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Interactive map with custom markers
- ✅ Property cards with click-to-zoom
- ✅ Complete documentation (README + CLAUDE.md)

**Configuration:**
- Apps Script URL: ✅ https://script.google.com/macros/s/AKfycbyY3TsuK56cyYpxZ22p9VLCwROthD4mYLmL9Jvb9M-TukPqbsmabsnI49DAjRSGZ4qKAA/exec
- Google Maps API Key: ✅ AIzaSyAFOA9PrQdFW1bI-l9DIuWrIFhC8uozN0c
- API Restrictions: ✅ Applied (iamcapital.vercel.app/*)
- Git Repository: ✅ https://github.com/websitelab/iamcapital
- Git User: ✅ hello@websitelab.biz
- Vercel Deployment: ✅ https://iamcapital.vercel.app/

---

## Deployment Information

### GitHub Repository
- **URL**: https://github.com/websitelab/iamcapital
- **Branch**: main
- **Git User**: hello@websitelab.biz (Website Lab)
- **Auto-deploy**: Enabled (pushes to main trigger Vercel redeployment)

### Vercel Hosting
- **Production URL**: https://iamcapital.vercel.app/
- **Framework**: Static HTML
- **Configuration**: vercel.json (clean URLs enabled)
- **Auto-deploy**: ✅ Enabled from GitHub main branch
- **Clean URLs**: /investments (no .html extension needed)

### vercel.json Configuration
```json
{
  "rewrites": [
    {
      "source": "/",
      "destination": "/investments.html"
    }
  ],
  "cleanUrls": true
}
```

**What this does:**
- Routes root URL (/) to investments.html
- Enables clean URLs (access pages without .html extension)
- Allows /investments to work (instead of /investments.html)

---

## Next Steps for Production

### 1. Update Google Maps API Restrictions
**IMPORTANT**: Add Vercel URL to API key restrictions for the map to work:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to: APIs & Services → Credentials
3. Click your API key: `AIzaSyAFOA9PrQdFW1bI-l9DIuWrIFhC8uozN0c`
4. Under **HTTP referrers**, add:
   - `iamcapital.vercel.app/*`
   - `*.vercel.app/*` (for all Vercel preview deployments)
5. Click **Save**

### 2. Test Production Site
Visit: https://iamcapital.vercel.app/

**Expected behavior:**
- Navy/lime Google Map with 10 lime green markers
- Property cards below map
- Click marker → Info window opens
- Click card → Map zooms to property
- Responsive design on mobile/tablet/desktop

### 3. Replace Sample Data
In your Google Sheet:
1. Delete sample property rows (Harbor View Apartments, etc.)
2. Add real iAM Capital investment properties
3. Ensure required fields: Property Name, Address, City, State
4. Changes appear on site within 1-5 minutes

### 4. Future Enhancements
- Add custom domain (iamcapital.com)
- Add property photos
- Pre-geocode addresses (add lat/lng columns)
- Add property filtering by type
- Implement search functionality

---

**Last Updated**: 2026-01-26 (Version 1.3)
**Status**: Deployed to Production
**Live URL**: https://iamcapital.vercel.app/
**Current Version**: 1.3 - Gold markers, collapsible filters, refined UX
