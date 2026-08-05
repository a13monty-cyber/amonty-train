/**
 * Store.gs
 * --------
 * שכבת מסד הנתונים מעל Google Sheet. שלושה טאבים:
 *
 *   Whitelist  | Email            | Name          | Active
 *              | dan@company.com  | דן מהעבודה     | TRUE
 *
 *   Sent       | WaMessageId | GmailThreadId | SenderEmail | Subject | Timestamp
 *              (מיפוי: לאיזה שרשור מייל שייכת כל הודעת WhatsApp שנשלחה אליך —
 *               כדי שכשתשיב בוואטסאפ נדע לאיזה מייל לענות)
 *
 *   Processed  | GmailMessageId | Timestamp
 *              (מניעת שליחה כפולה של אותו מייל)
 */

var SHEET_WHITELIST = 'Whitelist';
var SHEET_SENT      = 'Sent';
var SHEET_PROCESSED = 'Processed';

function getSpreadsheet_() {
  return SpreadsheetApp.openById(getConfig_().sheetId);
}

function getOrCreateSheet_(name, headers) {
  var ss = getSpreadsheet_();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

/** מחזיר מערך של כתובות מייל פעילות (lowercase) מטאב ה-Whitelist. */
function getActiveWhitelist_() {
  var sh = getOrCreateSheet_(SHEET_WHITELIST, ['Email', 'Name', 'Active']);
  var last = sh.getLastRow();
  if (last < 2) return [];
  var rows = sh.getRange(2, 1, last - 1, 3).getValues();
  var out = [];
  rows.forEach(function (r) {
    var email = String(r[0] || '').trim().toLowerCase();
    if (!email) return;
    var active = r[2];
    // פעיל אם: תיבת סימון מסומנת, או המילה TRUE, או שהתא ריק (ברירת מחדל = פעיל).
    var isActive = (active === true) ||
                   (String(active).trim().toUpperCase() === 'TRUE') ||
                   (String(active).trim() === '');
    if (isActive) out.push(email);
  });
  return out;
}

/** מחזיר מפת email->name לכל השורות, לצורך הצגת שם ידידותי בהתראה. */
function getWhitelistNames_() {
  var sh = getOrCreateSheet_(SHEET_WHITELIST, ['Email', 'Name', 'Active']);
  var last = sh.getLastRow();
  var map = {};
  if (last < 2) return map;
  var rows = sh.getRange(2, 1, last - 1, 2).getValues();
  rows.forEach(function (r) {
    var email = String(r[0] || '').trim().toLowerCase();
    if (email) map[email] = String(r[1] || '').trim();
  });
  return map;
}

// ---- Processed (dedupe forwards) ------------------------------------------

function loadProcessedIds_() {
  var sh = getOrCreateSheet_(SHEET_PROCESSED, ['GmailMessageId', 'Timestamp']);
  var last = sh.getLastRow();
  var set = {};
  if (last < 2) return set;
  var ids = sh.getRange(2, 1, last - 1, 1).getValues();
  ids.forEach(function (r) { if (r[0]) set[String(r[0])] = true; });
  return set;
}

function markProcessed_(gmailMessageId) {
  var sh = getOrCreateSheet_(SHEET_PROCESSED, ['GmailMessageId', 'Timestamp']);
  sh.appendRow([gmailMessageId, new Date()]);
}

/** ניקוי שורות Processed ישנות מ-14 יום, לשמירה על גיליון רזה. */
function pruneProcessed_() {
  var sh = getOrCreateSheet_(SHEET_PROCESSED, ['GmailMessageId', 'Timestamp']);
  var last = sh.getLastRow();
  if (last < 2) return;
  var data = sh.getRange(2, 1, last - 1, 2).getValues();
  var cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
  var keep = data.filter(function (r) {
    var t = r[1] ? new Date(r[1]).getTime() : Date.now();
    return t >= cutoff;
  });
  sh.getRange(2, 1, last - 1, 2).clearContent();
  if (keep.length) sh.getRange(2, 1, keep.length, 2).setValues(keep);
}

// ---- Sent (WhatsApp msg id -> Gmail thread) -------------------------------

function recordSent_(waMessageId, gmailThreadId, senderEmail, subject) {
  var sh = getOrCreateSheet_(SHEET_SENT, ['WaMessageId', 'GmailThreadId', 'SenderEmail', 'Subject', 'Timestamp']);
  sh.appendRow([waMessageId, gmailThreadId, senderEmail, subject, new Date()]);
}

/** מאתר את שרשור המייל לפי מזהה הודעת WhatsApp שהמשתמש הגיב לה (context.id). */
function lookupThreadByWaMessageId_(waMessageId) {
  if (!waMessageId) return null;
  var sh = getOrCreateSheet_(SHEET_SENT, ['WaMessageId', 'GmailThreadId', 'SenderEmail', 'Subject', 'Timestamp']);
  var last = sh.getLastRow();
  if (last < 2) return null;
  var rows = sh.getRange(2, 1, last - 1, 5).getValues();
  for (var i = rows.length - 1; i >= 0; i--) { // מהחדש לישן
    if (String(rows[i][0]) === String(waMessageId)) {
      return { threadId: String(rows[i][1]), sender: String(rows[i][2]), subject: String(rows[i][3]) };
    }
  }
  return null;
}

/** נפילה-לאחור: השרשור האחרון שנשלח, אם המשתמש הגיב בלי לצטט הודעה מסוימת. */
function lookupMostRecentThread_() {
  var sh = getOrCreateSheet_(SHEET_SENT, ['WaMessageId', 'GmailThreadId', 'SenderEmail', 'Subject', 'Timestamp']);
  var last = sh.getLastRow();
  if (last < 2) return null;
  var r = sh.getRange(last, 1, 1, 5).getValues()[0];
  return { threadId: String(r[1]), sender: String(r[2]), subject: String(r[3]) };
}
