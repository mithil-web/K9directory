/**
 * Canines Can Care — sign-up collector
 * Paste this into a Google Apps Script bound to your Google Sheet, then Deploy
 * as a Web app (Execute as: Me, Who has access: Anyone). Copy the /exec URL and
 * paste it into SIGNUP_ENDPOINT in index.html.
 *
 * Each sign-up from the site is appended as a new row:
 *   Timestamp | Name | Email | Phone | Source
 */

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Signups')
             || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Signups');

    // Add a header row once.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Source']);
    }

    sheet.appendRow([
      data.ts || new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.source || 'ccc-directory'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: lets you open the /exec URL in a browser to confirm it's live.
function doGet() {
  return ContentService.createTextOutput('CCC sign-up collector is running.');
}
