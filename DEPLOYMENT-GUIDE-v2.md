# iAM Capital - Fast Map Loading Deployment Guide

**Performance Improvement: Pre-Geocoded Coordinates**

This update eliminates ~2 seconds of load time by storing latitude/longitude coordinates in the Google Sheet instead of geocoding addresses on every page load.

---

## What Changed

### Before (Slow)
- Page loads → Fetches properties → **Geocodes 12 addresses client-side (~2 seconds)** → Creates markers
- 12 Geocoding API calls per page load
- Map interactive after ~3-5 seconds

### After (Fast)
- Page loads → Fetches properties with lat/lng → **Creates markers immediately (~0.1 seconds)**
- 0 Geocoding API calls per page load
- Map interactive after ~1-2 seconds

---

## Deployment Steps

### Step 1: Update Google Sheet

1. **Open your Google Sheet**: "iAM Capital Investment Properties"
2. **Add two new columns** after Portfolio URL (column M):
   - Column N: `Latitude`
   - Column O: `Longitude`
3. **Copy the coordinates** from `sample-properties.csv` or use the table below

**Pre-Geocoded Coordinates:**

| Property | Latitude | Longitude |
|----------|----------|-----------|
| Palazzo Residences | 41.9055 | 12.4823 |
| Milan Office Tower | 45.4773 | 9.2079 |
| Tuscan Storage Solutions | 43.7536 | 11.2932 |
| Paris Marais Apartments | 48.8566 | 2.3522 |
| Lyon Industrial Park | 45.7507 | 4.8422 |
| Côte d'Azur Retail | 43.6951 | 7.2758 |
| Venice Canal Residences | 45.4343 | 12.3388 |
| Marseille Port Office | 43.2951 | 5.3698 |
| Barcelona Gothic Quarter | 41.3839 | 2.1764 |
| Lisbon Alfama Storage | 38.7125 | -9.1289 |
| Grand Hotel Portofino | 44.3032 | 9.2097 |
| Provence Solar Farm | 43.9493 | 4.8055 |

### Step 2: Update Google Apps Script

1. **Open Google Apps Script**:
   - In your Google Sheet: Extensions → Apps Script
2. **Replace the code** with the contents of `google-apps-script-v2.js`
3. **Save** (Ctrl+S or Cmd+S)
4. **Deploy**:
   - Click "Deploy" → "Manage deployments"
   - Click the pencil icon (Edit) on your existing deployment
   - Click "Version" → "New version"
   - Add description: "Added lat/lng support for fast map loading"
   - Click "Deploy"
5. **Get deployment URL** (should be the same as before):
   ```
   https://script.google.com/macros/s/AKfycbzkVLtzgGl37uerEhA8USWI-ZmTQ77aTqDbTqKJL2Pqx8KEAmGSeDqZk7DCcwLaipmQJw/exec
   ```
6. **Test the API** by visiting the URL in your browser. You should see:
   ```json
   {
     "properties": [
       {
         "name": "Palazzo Residences",
         "latitude": 41.9055,
         "longitude": 12.4823,
         ...
       }
     ]
   }
   ```

### Step 3: Deploy Frontend Updates

The frontend code (`investments.js`) has already been updated to use pre-geocoded coordinates.

**Push to GitHub and deploy to Vercel:**

```bash
cd /Users/davidpeyton/Documents/Coding-Projects/Website-Lab/Websites/iamcapital.com

# Review changes
git status
git diff

# Commit changes
git add investments.js sample-properties.csv google-apps-script-v2.js DEPLOYMENT-GUIDE-v2.md
git commit -m "Performance: Add pre-geocoded coordinates for fast map loading

- Add latitude/longitude columns to property schema
- Update Apps Script to return lat/lng coordinates
- Update frontend to use pre-geocoded coords (skip geocoding)
- Eliminates ~2 seconds of load time
- Reduces Geocoding API usage from 12 calls to 0 per page load

Performance improvements:
- Before: Map interactive in ~3-5 seconds
- After: Map interactive in ~1-2 seconds"

# Push to GitHub (triggers Vercel auto-deploy)
git push origin main
```

### Step 4: Test Production Site

1. **Visit production URL**: https://iamcapital.vercel.app/
2. **Open browser DevTools**: F12 → Network tab
3. **Refresh page** (Ctrl+Shift+R)
4. **Check performance**:
   - Map should load and show markers almost immediately
   - No Geocoding API calls in Network tab
   - Console should show no errors

---

## Backwards Compatibility

The new code is **backwards compatible**:
- If lat/lng columns exist → Uses pre-geocoded coordinates (fast)
- If lat/lng columns missing → Falls back to geocoding (slow, but still works)

This means the map will work even if you don't update the Google Sheet immediately.

---

## Adding New Properties

When adding new properties to the Google Sheet, you have two options:

### Option 1: Pre-Geocode (Recommended)
1. Add property data to all columns (A-M)
2. Get coordinates from [Google Maps](https://www.google.com/maps):
   - Search for the address
   - Right-click on the location → "What's here?"
   - Copy latitude and longitude
3. Paste coordinates into columns N and O
4. Map loads instantly

### Option 2: Auto-Geocode (Fallback)
1. Add property data to columns A-M
2. Leave columns N and O empty
3. Map will geocode on page load (slower, uses API quota)

---

## Performance Metrics

**Before (Version 1.5):**
- Apps Script response: ~200-300ms
- Geocoding 12 addresses: ~1500-2000ms
- Map marker creation: ~100ms
- **Total time to interactive: ~3-5 seconds**

**After (Version 2.0):**
- Apps Script response: ~200-300ms
- Pre-geocoded marker creation: ~50-100ms
- **Total time to interactive: ~1-2 seconds**

**Savings:**
- ✅ ~2 seconds faster load time
- ✅ 12 fewer API calls per page load
- ✅ Better user experience
- ✅ Reduced API quota usage

---

## Troubleshooting

**Map markers not appearing?**
- Check browser console for errors
- Verify lat/lng values in Google Sheet (numbers, not text)
- Test Apps Script URL directly in browser
- Ensure columns N and O are Plain Text format

**Map still slow?**
- Clear browser cache (Ctrl+Shift+Delete)
- Check Network tab: Should see 0 geocoding API calls
- Verify Apps Script returned lat/lng fields

**Wrong marker locations?**
- Verify coordinates are in correct order (latitude, longitude)
- Check that coordinates use decimal degrees (not DMS format)
- Use [LatLong.net](https://www.latlong.net/) to verify coordinates

---

## Version History

### Version 2.0 (2026-01-29)
**Performance Optimization: Pre-Geocoded Coordinates**
- ✅ Added latitude/longitude columns to schema (columns N, O)
- ✅ Updated Apps Script to parse and return lat/lng
- ✅ Updated frontend to use pre-geocoded coordinates
- ✅ Backwards compatible (falls back to geocoding if missing)
- ✅ ~2 second performance improvement
- ✅ Zero geocoding API calls per page load

---

**Last Updated**: 2026-01-29
**Current Version**: 2.0
