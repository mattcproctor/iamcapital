# iAM Capital - Investment Properties Map

## Project Overview
Professional investment property map page for iAM Capital displaying properties from a Google Sheet with interactive Google Maps integration. Built using the proven Blue Devil Jiu Jitsu schedule.html pattern (serverless architecture with Google Apps Script).

**Project Status:** ✅ Configured & Ready for Testing

**Live Configuration:**
- Google Apps Script URL: `https://script.google.com/macros/s/AKfycbzFiDn31ne4CISFqjzCcpMwSve5FAJXKgNALoh1kzFw3IRrZtVBUIEUbTf_5whW_weMkQ/exec`
- Google Maps API Key: `AIzaSyAFOA9PrQdFW1bI-l9DIuWrIFhC8uozN0c`
- Steps 1-3 Complete: ✅ Google Sheet, ✅ Apps Script, ✅ Google Maps API

**Technology Stack:**
- Pure HTML5/CSS3/Vanilla JavaScript
- Google Sheets (data storage/CMS)
- Google Apps Script (JSON API endpoint)
- Google Maps JavaScript API (map rendering)
- Geocoding API (address to coordinates)
- Serverless architecture (no backend needed)

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
├── investments.html              # Main page (93 lines)
├── investments.css               # Styling (403 lines)
├── investments.js                # Logic (270 lines) - CONFIGURED ✅
├── google-apps-script.js         # Server code reference (88 lines)
├── sample-properties.csv         # Sample data for import (10 properties)
├── README-INVESTMENTS.md         # Setup guide (380 lines)
└── CLAUDE.md                     # This documentation
```

**Total Production Code:** ~766 lines (HTML + CSS + JS)

---

## Setup Status

### ✅ Phase 1: Google Sheets Setup (COMPLETE)
- [x] Created Google Sheet: "iAM Capital Investment Properties"
- [x] Added column headers (10 columns)
- [x] Imported sample property data (10 properties)
- [x] Formatted columns as Plain Text

**Sheet Structure:**
| Column | Name | Example |
|--------|------|---------|
| A | Property Name | "Harbor View Apartments" |
| B | Address | "123 Waterfront Drive" |
| C | City | "Miami" |
| D | State | "FL" |
| E | Zip Code | "33132" |
| F | Property Type | "Multifamily" |
| G | Units/Size | "120 units" |
| H | Acquisition Date | "Q2 2024" |
| I | Status | "Active" |
| J | Description | "Class A waterfront development" |

### ✅ Phase 2: Google Apps Script Deployment (COMPLETE)
- [x] Created Apps Script project
- [x] Deployed `doGet()` function
- [x] Configured as public web app
- [x] Obtained deployment URL
- [x] Tested API endpoint (returns JSON)

**Apps Script URL:**
```
https://script.google.com/macros/s/AKfycbzFiDn31ne4CISFqjzCcpMwSve5FAJXKgNALoh1kzFw3IRrZtVBUIEUbTf_5whW_weMkQ/exec
```

**API Response Format:**
```json
{
  "properties": [
    {
      "name": "Harbor View Apartments",
      "address": "123 Waterfront Drive",
      "city": "Miami",
      "state": "FL",
      "zip": "33132",
      "fullAddress": "123 Waterfront Drive, Miami, FL 33132",
      "propertyType": "Multifamily",
      "unitsSize": "120 units",
      "acquisitionDate": "Q2 2024",
      "status": "Active",
      "description": "Class A waterfront development"
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

### ⏳ Phase 5: Testing (NEXT STEP)
- [ ] Local testing with `python3 -m http.server`
- [ ] Verify map loads with markers
- [ ] Test marker clicks (info windows)
- [ ] Test card clicks (zoom to marker)
- [ ] Test responsive design (mobile, tablet, desktop)

### ⏳ Phase 6: Production Deployment (PENDING)
- [ ] Upload files to web server
- [ ] Test on production domain
- [ ] Monitor API usage
- [ ] Add real property data

---

## Brand Design System

### Color Palette
```css
/* Primary Colors */
--color-navy: #193D5F;        /* Deep navy (primary brand) */
--color-lime: #9DFF20;        /* Lime green (accent) */
--color-white: #FFFFFF;       /* White */
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
- **Navy (#193D5F)**: Header, hero gradient, property card titles, map base color
- **Lime (#9DFF20)**: Logo accent, map markers, property type badges
- **White (#FFFFFF)**: Text on dark backgrounds, card backgrounds
- **Gray**: Body text, borders, secondary elements

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
- Eyebrow label: "GLOBAL PORTFOLIO" (lime, uppercase)
- Main title: "Investment Properties" (white, 900 weight)
- Subtitle: "Strategic investments across diversified asset classes"

**Styling:**
- Background: Linear gradient (navy #193D5F → darker #0F2A3F)
- Text alignment: Center
- Padding: 6rem desktop → 4rem mobile

### 3. Map Section
**Structure:**
- Full-width map container (no padding)
- Height: 600px desktop → 400px mobile
- Loading state (spinner + message)
- Error state (fallback message)
- Custom map styling (navy/lime theme)

**Map Features:**
- Custom navy base color
- Lime green circular markers (scale: 8px)
- White stroke on markers (2px)
- Info windows on marker click
- Auto-zoom to fit all markers
- Fullscreen control enabled

**Geocoding:**
- Client-side via Google Geocoding API
- Converts addresses to lat/lng on page load
- Error tolerance (skip failed geocodes)
- Free tier: 25,000 requests/day

### 4. Property Cards Section
**Layout:**
- Max-width container (1400px)
- Section title: "Portfolio Overview"
- Responsive grid:
  - Desktop: auto-fill, min 320px columns
  - Tablet: auto-fill, min 280px columns
  - Mobile: 1 column

**Card Structure:**
- Header:
  - Property name (navy, bold)
  - Property type badge (lime background, navy text)
- Body:
  - Location (with pin icon)
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

## Sample Property Data

**10 Mock Investment Properties:**

1. **Harbor View Apartments**
   - Miami, FL (Multifamily, 120 units)
   - 123 Waterfront Drive, 33132
   - Class A waterfront development

2. **Sunset Plaza Office**
   - Austin, TX (Office, 85,000 sq ft)
   - 456 Commerce Blvd, 78701
   - Downtown mixed-use complex

3. **Mountain Ridge Storage**
   - Denver, CO (Self Storage, 450 units)
   - 789 Mountain View Rd, 80202
   - Climate-controlled facility

4. **Lakeside Retail Center**
   - Chicago, IL (Retail, 42,000 sq ft)
   - 321 Lake Shore Dr, 60611
   - Anchored shopping center

5. **Tech Park Industrial**
   - San Jose, CA (Industrial, 250,000 sq ft)
   - 654 Innovation Way, 95113
   - Modern logistics hub

6. **Riverside Student Housing**
   - Boston, MA (Multifamily, 200 beds)
   - 987 University Ave, 02215
   - Purpose-built student living

7. **Gateway Business Park**
   - Atlanta, GA (Office, 120,000 sq ft)
   - 159 Enterprise Dr, 30303
   - Suburban office campus

8. **Coastal Self Storage**
   - San Diego, CA (Self Storage, 600 units)
   - 753 Coastal Hwy, 92101
   - Premium climate control

9. **Metro Apartments**
   - Seattle, WA (Multifamily, 180 units)
   - 852 Downtown St, 98101
   - Urban core development

10. **Parkway Industrial**
    - Dallas, TX (Industrial, 180,000 sq ft)
    - 951 Logistics Ln, 75201
    - Distribution center

**Diversity:**
- 3 Multifamily properties
- 2 Office properties
- 2 Self Storage properties
- 2 Industrial properties
- 1 Retail property

**Geographic Distribution:**
- West Coast: 3 (CA, WA)
- Southwest: 2 (TX)
- Midwest: 2 (IL, CO)
- Southeast: 2 (FL, GA)
- Northeast: 1 (MA)

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

### Version 1.0 (2026-01-26) - Current
**Initial Release:**
- ✅ Complete serverless architecture implementation
- ✅ Google Sheets + Apps Script + Google Maps integration
- ✅ Professional navy/lime corporate design
- ✅ 10 sample investment properties
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Interactive map with custom markers
- ✅ Property cards with click-to-zoom
- ✅ Complete documentation (README + CLAUDE.md)
- ✅ Configured with live URLs (Steps 1-3 complete)

**Files Created:**
- investments.html (93 lines)
- investments.css (403 lines)
- investments.js (270 lines, configured)
- google-apps-script.js (88 lines)
- sample-properties.csv (10 properties)
- README-INVESTMENTS.md (380 lines)
- CLAUDE.md (this file)

**Configuration:**
- Apps Script URL: ✅ Configured
- Google Maps API Key: ✅ Configured
- API Restrictions: ✅ Applied
- Sample Data: ✅ Ready for import

---

**Last Updated**: 2026-01-26
**Status**: Ready for Testing
**Next Step**: Local testing with `python3 -m http.server`
