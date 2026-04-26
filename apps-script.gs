// Kirality Labs — Form Submission Handler
// Deploy as: Web App → Execute as: Me → Who has access: Anyone

const SPREADSHEET_ID  = '1Frnl0HVolT25jyqWM10D6ki_IoKZChP4GnArFFI2DwY';
const SHEET_NAME_HERO    = 'Strategy Calls';
const SHEET_NAME_CONTACT = 'Specialist Requests';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss   = SpreadsheetApp.openById(SPREADSHEET_ID);

    const sheetName = data._formId === 'hero-form' ? SHEET_NAME_HERO : SHEET_NAME_CONTACT;
    let sheet = ss.getSheetByName(sheetName);

    // Create sheet + header row on first run
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      const headers = data._formId === 'hero-form'
        ? ['Timestamp', 'Full Name', 'Work Email', 'Company Size', 'Goal']
        : ['Timestamp', 'Name', 'Work Email', 'Message'];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight('bold')
        .setBackground('#00FF41');
    }

    // Append the submission row
    const row = data._formId === 'hero-form'
      ? [data._timestamp, data.name, data.email, data.size || '', data.goal || '']
      : [data._timestamp, data.name, data.email, data.message || ''];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handles CORS preflight
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ready' }))
    .setMimeType(ContentService.MimeType.JSON);
}
