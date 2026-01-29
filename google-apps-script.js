/**
 * iAM Capital - Investment Properties API
 * Google Apps Script for Google Sheets Integration
 *
 * Deploy this script as a web app:
 * 1. In Google Sheets: Extensions → Apps Script
 * 2. Paste this code
 * 3. Deploy → New deployment → Web app
 * 4. Execute as: Me
 * 5. Who has access: Anyone
 * 6. Copy deployment URL
 */

function doGet() {
  try {
    // Get the active spreadsheet and first sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');

    // Validate sheet exists
    if (!sheet) {
      return createErrorResponse('Sheet not found. Please ensure the sheet is named "Sheet1".');
    }

    // Get all data using getDisplayValues() for formatted text
    const data = sheet.getDataRange().getDisplayValues();

    // Validate data exists (at least header row + 1 data row)
    if (data.length < 2) {
      return createSuccessResponse([]);
    }

    const properties = [];

    // Skip header row (row 0), process data rows
    for (let i = 1; i < data.length; i++) {
      const [name, address, city, country, postalCode, category, propertyType, sizeSqm, imageUrl, acquisitionDate, status, description, portfolioUrl] = data[i];

      // Skip empty rows (require name, address, city, country at minimum)
      if (!name || !address || !city || !country) continue;

      // Build full address for geocoding (international format)
      const fullAddress = `${address}, ${city}, ${postalCode || ''} ${country}`.trim();

      // Build property object
      properties.push({
        name: name,
        address: address,
        city: city,
        country: country,
        postalCode: postalCode || '',
        fullAddress: fullAddress,
        category: category || '',
        propertyType: propertyType || '',
        sizeSqm: sizeSqm || '',
        imageUrl: imageUrl || '',
        acquisitionDate: acquisitionDate || '',
        status: status || 'Active',
        description: description || '',
        portfolioUrl: portfolioUrl || ''
      });
    }

    return createSuccessResponse(properties);

  } catch (error) {
    return createErrorResponse(`Server error: ${error.toString()}`);
  }
}

/**
 * Create success response with properties data
 */
function createSuccessResponse(properties) {
  const response = {
    properties: properties,
    count: properties.length,
    timestamp: new Date().toISOString()
  };

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Create error response
 */
function createErrorResponse(errorMessage) {
  const response = {
    error: true,
    message: errorMessage,
    timestamp: new Date().toISOString()
  };

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
