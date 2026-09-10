/**
 * Devigners admissions -> Google Sheets bridge.
 *
 * 1. Create a Google Sheet and open Extensions -> Apps Script.
 * 2. Paste this file into Code.gs.
 * 3. Set SHEET_NAME and WEBHOOK_SECRET below.
 * 4. Deploy as a Web app: Execute as you, access for anyone.
 * 5. Put the deployed /exec URL and the same secret in Railway environment variables.
 */

const SHEET_NAME = 'Admissions';
const WEBHOOK_SECRET = 'hdvigfierifbreigierrhjbnkjnkj';

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'Missing request body' });
    }

    const data = JSON.parse(e.postData.contents);
    if (data.secret !== WEBHOOK_SECRET) {
      return jsonResponse({ ok: false, error: 'Unauthorized' });
    }

    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const program = String(data.program || '').trim();
    const classMode = String(data.class_mode || '').trim();

    if (!name || !email || !program || !classMode) {
      return jsonResponse({ ok: false, error: 'Missing admissions fields' });
    }

    const sheet = getAdmissionsSheet();
    sheet.appendRow([new Date(), name, email, program, classMode]);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function getAdmissionsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(['Submitted At', 'Full Name', 'Email', 'Program', 'Class Mode']);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
