# iAM Capital - Investment Properties Map Setup Guide

This guide will walk you through setting up the investment properties map page with Google Sheets integration.

## Overview

The investment properties page uses a serverless architecture:
- **Google Sheets** - Stores property data (easy updates)
- **Google Apps Script** - Provides JSON API endpoint
- **Google Maps API** - Displays interactive map with markers
- **Static HTML/CSS/JS** - Frontend (no backend server needed)

## Table of Contents
1. [Google Sheets Setup](#1-google-sheets-setup)
2. [Google Apps Script Deployment](#2-google-apps-script-deployment)
3. [Google Maps API Setup](#3-google-maps-api-setup)
4. [Frontend Configuration](#4-frontend-configuration)
5. [Testing](#5-testing)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Google Sheets Setup

### Step 1.1: Create the Spreadsheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"iAM Capital Investment Properties"**

### Step 1.2: Set Up Column Headers

In **Row 1**, add these column headers:

| Column | Header Name |
|--------|-------------|
| A | Property Name |
| B | Address |
| C | City |
| D | State |
| E | Zip Code |
| F | Property Type |
| G | Units/Size |
| H | Acquisition Date |
| I | Status |
| J | Description |

### Step 1.3: Add Sample Data

Import the sample data from `sample-properties.csv` or manually add properties starting in **Row 2**.

**Example:**
```
Harbor View Apartments | 123 Waterfront Drive | Miami | FL | 33132 | Multifamily | 120 units | Q2 2024 | Active | Class A waterfront development
```

### Step 1.4: Format Columns

1. Select all data columns (A-J)
2. Format → Number → Plain text
3. This ensures dates and numbers display exactly as typed

---

## 2. Google Apps Script Deployment

### Step 2.1: Create the Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete any default code
3. Open the file `google-apps-script.js` from this project
4. Copy all the code
5. Paste into the Apps Script editor
6. Click the save icon (💾) or **File → Save**
7. Name the project: **"Investment Properties API"**

### Step 2.2: Test the Script

1. In the Apps Script editor, select the function dropdown (currently shows `doGet`)
2. Ensure `doGet` is selected
3. Click **Run** (▶️ button)
4. You'll see a permissions dialog:
   - Click **Review permissions**
   - Choose your Google account
   - Click **Advanced**
   - Click **Go to Investment Properties API (unsafe)**
   - Click **Allow**
5. Check the **Execution log** at the bottom - should show success

### Step 2.3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ → Select **Web app**
3. Configure the deployment:
   - **Description**: "Investment Properties API v1"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Copy the deployment URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
6. Keep this URL - you'll need it in Step 4

### Step 2.4: Test the API

1. Open the deployment URL in a new browser tab
2. You should see JSON output like:
   ```json
   {
     "properties": [
       {
         "name": "Harbor View Apartments",
         "address": "123 Waterfront Drive",
         "city": "Miami",
         "state": "FL",
         ...
       }
     ],
     "count": 10,
     "timestamp": "2026-01-26T..."
   }
   ```
3. If you see this, the API is working correctly!

---

## 3. Google Maps API Setup

### Step 3.1: Create Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **Select a project** → **New Project**
3. Project name: **"iAM Capital Website"**
4. Click **Create**
5. Wait for the project to be created (30-60 seconds)

### Step 3.2: Enable Required APIs

1. In the Google Cloud Console, go to **APIs & Services → Library**
2. Search for **"Maps JavaScript API"**
3. Click on it → Click **Enable**
4. Go back to Library
5. Search for **"Geocoding API"**
6. Click on it → Click **Enable**

### Step 3.3: Create API Key

1. Go to **APIs & Services → Credentials**
2. Click **Create credentials → API key**
3. A dialog will show your API key - **copy it immediately**
4. Your key will look like: `AIzaSyXXXXXXXXXXXXXXXXXXXX`

### Step 3.4: Restrict the API Key (CRITICAL!)

**⚠️ This step is essential for security!**

1. In the API key dialog, click **Edit API key**
2. Under **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   - Click **Add an item**
   - Add: `iamcapital.com/*`
   - Click **Add an item** again
   - Add: `*.iamcapital.com/*`
   - For local testing, also add: `localhost:*`
3. Under **API restrictions**:
   - Select **Restrict key**
   - Check: **Maps JavaScript API**
   - Check: **Geocoding API**
4. Click **Save**

### Step 3.5: Set Up Billing (Optional but Recommended)

1. Go to **Billing → Link a billing account**
2. Google provides $200/month free credit
3. Set up billing alerts:
   - Budgets & alerts
   - Create budget: $50, $100, $150 thresholds
4. This prevents unexpected charges

---

## 4. Frontend Configuration

### Step 4.1: Update JavaScript Configuration

1. Open `investments.js`
2. Find line 6:
   ```javascript
   const PROPERTIES_API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace with your Apps Script deployment URL from Step 2.3:
   ```javascript
   const PROPERTIES_API_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
   ```

### Step 4.2: Update HTML with API Key

1. Open `investments.html`
2. Find line ~91 (the Google Maps script tag):
   ```html
   <script async defer
       src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&callback=initMap&libraries=marker">
   </script>
   ```
3. Replace `YOUR_API_KEY_HERE` with your Google Maps API key from Step 3.3:
   ```html
   <script async defer
       src="https://maps.googleapis.com/maps/api/js?key=AIzaSyXXXXXXXXXXXXXXXXXXXX&callback=initMap&libraries=marker">
   </script>
   ```

### Step 4.3: Verify File Structure

Ensure all files are in the correct location:
```
iamcapital.com/
├── investments.html
├── investments.css
├── investments.js
├── google-apps-script.js (reference - not deployed)
├── README-INVESTMENTS.md (this file)
└── sample-properties.csv
```

---

## 5. Testing

### Step 5.1: Local Testing

1. Open Terminal/Command Prompt
2. Navigate to the iamcapital.com directory:
   ```bash
   cd /path/to/iamcapital.com
   ```
3. Start a local web server:
   ```bash
   python3 -m http.server 8000
   ```
4. Open browser to: `http://localhost:8000/investments.html`

### Step 5.2: Check Map Loads

You should see:
- ✅ "Loading investment properties..." (briefly)
- ✅ Google Map with custom navy/lime styling
- ✅ Lime green circular markers for each property
- ✅ Property cards displayed below map

### Step 5.3: Test Interactions

1. **Click a marker**:
   - Info window should open
   - Should show property name, address, type, size

2. **Click a property card**:
   - Map should zoom to that property
   - Info window should open
   - Page should scroll to map

3. **Hover over cards**:
   - Card should lift slightly
   - Border should turn navy blue

### Step 5.4: Test Responsive Design

1. Open browser DevTools (F12)
2. Click the device toolbar icon (📱)
3. Test different screen sizes:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)

Verify:
- Map height adjusts (600px → 500px → 400px)
- Cards grid adjusts (3 cols → 2 cols → 1 col)
- Text sizes scale appropriately

### Step 5.5: Check Browser Console

1. Open DevTools → Console tab
2. Should see NO red errors
3. You may see geocoding info logs (normal)

---

## 6. Troubleshooting

### Issue: Map Not Loading

**Symptoms**: Gray box where map should be

**Solutions**:
1. Check browser console for errors
2. Verify API key is correct in `investments.html`
3. Check API key restrictions include `localhost:*` for local testing
4. Ensure Maps JavaScript API is enabled in Google Cloud Console

### Issue: "Google Maps authentication failed"

**Symptoms**: Console error about authentication

**Solutions**:
1. Verify API key is valid
2. Check API restrictions - ensure Maps JavaScript API is allowed
3. Check HTTP referrer restrictions include your domain
4. Try creating a new API key

### Issue: No Markers Appearing

**Symptoms**: Map loads but no property markers

**Solutions**:
1. Check browser console for geocoding errors
2. Verify addresses in Google Sheet are valid US addresses
3. Check that Apps Script URL is correct in `investments.js`
4. Test the Apps Script URL directly in browser - should return JSON

### Issue: "Unable to load property map"

**Symptoms**: Error message displayed on page

**Solutions**:
1. Verify Apps Script deployment URL is correct
2. Test the URL in browser - should return JSON
3. Check Google Sheet has data in correct format
4. Verify sheet is named "Sheet1"

### Issue: Geocoding Quota Exceeded

**Symptoms**: Console errors about quota

**Solutions**:
1. You've exceeded free tier (25,000 requests/day)
2. Enable billing in Google Cloud Console
3. Consider adding lat/lng columns to sheet (future enhancement)

### Issue: Cards Not Rendering

**Symptoms**: Map loads but no property cards below

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify Apps Script response has `properties` array
3. Check the response format matches expected structure
4. Inspect network tab - verify API returns 200 status

---

## Next Steps

### Adding Real Property Data

1. Replace sample data in Google Sheet with actual properties
2. Ensure all required fields are filled: Name, Address, City, State
3. Optional fields can be left empty
4. Sheet updates appear on website within 1-5 minutes

### Deployment to Production

1. Upload all files to web server via FTP/SFTP
2. Ensure domain is configured in API key restrictions
3. Test on production URL
4. Monitor Google Cloud Console for API usage

### Future Enhancements

Consider these improvements:
- Add property photos
- Pre-geocode addresses (add lat/lng columns to sheet)
- Add property filtering by type
- Add search functionality
- Create property detail modals

---

## Support

If you encounter issues not covered here:

1. Check the browser console for detailed error messages
2. Test each component individually:
   - Apps Script API (test URL in browser)
   - Google Maps API (check for console errors)
   - Data format (verify JSON structure)

---

## Security Checklist

Before going live, verify:

- ✅ Google Maps API key is restricted to your domain
- ✅ API key is restricted to only Maps JavaScript API and Geocoding API
- ✅ Apps Script is deployed with "Execute as: Me"
- ✅ Apps Script access is "Anyone" (read-only)
- ✅ No sensitive data in property descriptions
- ✅ HTTPS is enabled on your website

---

**Last Updated**: January 26, 2026
**Version**: 1.0
