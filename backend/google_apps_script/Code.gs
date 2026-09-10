/**
 * Devigners admissions -> Google Sheets + email bridge.
 *
 * 1. Create/open the Google Sheet that should receive admissions.
 * 2. Extensions -> Apps Script.
 * 3. Replace Code.gs with this file.
 * 4. Set SHEET_NAME and WEBHOOK_SECRET below.
 * 5. Deploy as a Web app: Execute as you, access for anyone.
 * 6. Put the deployed /exec URL and the same secret in Railway.
 *
 * The web app receives the admission from FastAPI, stores it in the
 * Admissions sheet, then sends a confirmation email to the student and
 * a notification email to the HR/admin address supplied by FastAPI.
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
    const message = String(data.message || '').trim();
    const notifyEmail = String(data.notify_email || '').trim();

    if (!name || !email || !program || !classMode || !notifyEmail) {
      return jsonResponse({ ok: false, error: 'Missing admissions fields' });
    }

    const sheet = getAdmissionsSheet();
    sheet.appendRow([new Date(), name, email, program, classMode, message]);

    sendStudentConfirmation(name, email, program, classMode, message);
    sendAdminNotification(name, email, program, classMode, message, notifyEmail);

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
    sheet.appendRow([
      'Submitted At',
      'Full Name',
      'Email',
      'Program',
      'Class Mode',
      'Message'
    ]);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastColumn() < 6) {
    sheet.getRange(1, 6).setValue('Message');
  }

  return sheet;
}

function sendStudentConfirmation(name, email, program, classMode, message) {
  const subject = 'Your Devigners admission form has been received';
  const body =
    'Hi ' + name + ',\n\n' +
    'Thank you for submitting your admission form to Devigners Learning Institute.\n\n' +
    'Your form has been successfully submitted and received by our team. ' +
    'Our HR/admissions team will review your information and contact you regarding the next steps.\n\n' +
    'Submission details:\n' +
    'Program: ' + program + '\n' +
    'Class format: ' + classMode + '\n' +
    'Message: ' + message + '\n\n' +
    'Please keep this email for your records. There is no need to submit the form again.\n\n' +
    'Regards,\n' +
    'Devigners Team\n' +
    'Devigners Learning Institute';

  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: body,
    name: 'Devigners Learning Institute'
  });
}

function sendAdminNotification(name, email, program, classMode, message, notifyEmail) {
  const subject = 'New admission form — ' + name;
  const body =
    'A new admission form has been submitted on the Devigners website.\n\n' +
    'Student name: ' + name + '\n' +
    'Student email: ' + email + '\n' +
    'Program: ' + program + '\n' +
    'Class format: ' + classMode + '\n\n' +
    'Message:\n' + message + '\n\n' +
    'Please review the submission and contact the student if follow-up is required.';

  MailApp.sendEmail({
    to: notifyEmail,
    replyTo: email,
    subject: subject,
    body: body,
    name: 'Devigners Admissions'
  });
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
