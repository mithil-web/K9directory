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
 *   Timestamp | Name | Email | Phone | Source
 */

function writeRow(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();      // bound to this sheet
  var sheet = ss.getSheetByName('Signups') || ss.insertSheet('Signups');
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
    writeRow(data);
    return json({ ok: true });
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
      writeRow({
        ts: new Date().toISOString(),
        name: e.parameter.name,
        email: e.parameter.email,
        phone: e.parameter.phone,
        source: 'browser-test'
      });
      return json({ ok: true, wrote: true });
    } catch (err) {
      return json({ ok: false, error: String(err) });
    }
  }
  return ContentService.createTextOutput('CCC sign-up collector is running.');
}
