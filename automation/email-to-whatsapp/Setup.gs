/**
 * Setup.gs
 * --------
 * פונקציות עזר להקמה, בדיקה ותחזוקה. הרץ אותן ידנית מעורך Apps Script
 * (בחר את שם הפונקציה ולחץ Run) לפי ההוראות ב-README.
 */

/**
 * הרץ אותי פעם אחת אחרי שהגדרת את כל ה-Script Properties.
 * יוצר את הטאבים בגיליון, מתקין טריגר כל דקה, ומדפיס בדיקת שפיות.
 */
function setupAll() {
  initSheets();
  installTrigger();
  Logger.log('--- בדיקת הגדרות ---');
  var cfg = getConfig_();
  Logger.log('Phone Number ID: ' + cfg.phoneNumberId);
  Logger.log('מספר הבעלים: ' + cfg.ownerNumber);
  Logger.log('תבנית התראה: ' + (cfg.templateName || '(ללא — טקסט חופשי בלבד)'));
  Logger.log('אנשים ברשימה: ' + getActiveWhitelist_().length);
  Logger.log('הכול מוכן. פרוס עכשיו כ-Web App ורשום את ה-Callback URL ב-Meta.');
}

/** יוצר/מוודא את שלושת הטאבים בגיליון, ומכניס דוגמה לרשימת האנשים. */
function initSheets() {
  var wl = getOrCreateSheet_(SHEET_WHITELIST, ['Email', 'Name', 'Active']);
  if (wl.getLastRow() < 2) {
    wl.getRange(2, 1, 1, 3).setValues([['example@company.com', 'דוגמה — מחק אותי', 'TRUE']]);
  }
  getOrCreateSheet_(SHEET_SENT, ['WaMessageId', 'GmailThreadId', 'SenderEmail', 'Subject', 'Timestamp']);
  getOrCreateSheet_(SHEET_PROCESSED, ['GmailMessageId', 'Timestamp']);
  Logger.log('הטאבים מוכנים בגיליון.');
}

/** מתקין טריגר מבוסס-זמן שמריץ את pollGmailAndForward כל דקה. */
function installTrigger() {
  removeTriggers();
  ScriptApp.newTrigger('pollGmailAndForward')
    .timeBased()
    .everyMinutes(1)
    .create();
  Logger.log('טריגר הותקן — בדיקת מיילים כל דקה.');
}

/** מסיר את כל הטריגרים של הפרויקט (למשל לפני התקנה מחדש). */
function removeTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    ScriptApp.deleteTrigger(t);
  });
  Logger.log('טריגרים קיימים הוסרו.');
}

/**
 * בדיקה: שולח הודעת WhatsApp אחת אליך ("בדיקה מהאוטומציה").
 * שים לב — אם הגדרת תבנית, הבדיקה תשתמש בטקסט חופשי, שיעבוד רק אם
 * שלחת הודעה כלשהי למספר העסקי ב-24 השעות האחרונות (חלון פתוח).
 */
function testSendWhatsApp() {
  var cfg = getConfig_();
  try {
    var id = metaSendText_(cfg, cfg.ownerNumber, '✅ בדיקה: האוטומציה מייל→וואטסאפ מחוברת.');
    Logger.log('נשלח. wamid=' + id);
  } catch (e) {
    if (isOutsideWindowError_(e)) {
      Logger.log('החלון סגור (זה תקין). שלח "היי" למספר העסקי בוואטסאפ ואז הרץ שוב.');
    } else {
      Logger.log('שגיאה: ' + e.message);
    }
  }
}

/** בדיקה: מריץ סבב אחד של בדיקת מיילים עכשיו (בלי לחכות לטריגר). */
function testPollNow() {
  pollGmailAndForward();
  Logger.log('סבב בדיקת מיילים הסתיים. בדוק את היומן ואת הוואטסאפ.');
}
