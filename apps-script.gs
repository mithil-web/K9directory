/**
 * Canines Can Care — sign-up collector
 *
 * Paste this into the Apps Script bound to your Google Sheet
 * (open the Sheet → Extensions → Apps Script), then:
 *   Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy.
 * IMPORTANT: after ANY code change you must deploy a NEW VERSION, or the live
 * web app keeps running the old code.
 *
 * Rows are written to a tab called "Signups":
 *   Timestamp | Name | Email | Phone | Trainer | Interest | Courses | Trainer City | Source
 */

// OPTION A (recommended, unambiguous): paste your Sheet's ID here.
// Get it from the sheet URL: docs.google.com/spreadsheets/d/THIS_LONG_ID/edit
var SHEET_ID = "1VIXaNbGqJ6FCgxoTFk9k_2DXlgJdRhY_VwNU9F-JtF4";

function getSpreadsheet() {
  if (SHEET_ID) return SpreadsheetApp.openById(SHEET_ID);
  return SpreadsheetApp.getActiveSpreadsheet();        // only works if script is bound
}

function writeRow(data) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Signups') || ss.insertSheet('Signups');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Trainer', 'Interest', 'Courses', 'Trainer City', 'Source']);
  }
  sheet.appendRow([
    data.ts || new Date().toISOString(),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.trainer || '',
    data.interest || '',
    data.courses || '',
    data.trainerCity || '',
    data.source || 'ccc-directory'
  ]);
  // Return where it wrote, so the browser test reveals the actual target sheet.
  return { spreadsheet: ss.getName(), url: ss.getUrl(), tab: sheet.getName(), rows: sheet.getLastRow() };
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handles the POST sent by the website.
function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;                              // fallback: form-encoded
    }
    var info = writeRow(data);
    return json({ ok: true, wrote: info });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// Visit the /exec URL in a browser.
//   .../exec                      -> shows "running"
//   .../exec?name=Test&email=a@b.com&phone=9999999999  -> writes a TEST row
// This lets you confirm the sheet-writing works, separate from the website.
function doGet(e) {
  if (e && e.parameter && (e.parameter.name || e.parameter.email || e.parameter.phone)) {
    try {
      var info = writeRow({
        ts: new Date().toISOString(),
        name: e.parameter.name,
        email: e.parameter.email,
        phone: e.parameter.phone,
        source: 'browser-test'
      });
      return json({ ok: true, wrote: info });
    } catch (err) {
      return json({ ok: false, error: String(err) });
    }
  }
  return ContentService.createTextOutput('CCC sign-up collector is running.');
}
