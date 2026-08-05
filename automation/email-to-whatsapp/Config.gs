/**
 * Config.gs
 * ---------
 * קריאת הגדרות מתוך Script Properties (Project Settings ▸ Script properties).
 * שום סוד לא נכתב בקוד עצמו — הכול חי ב-Script Properties, כך שאפשר לשתף את הקוד
 * בבטחה בריפו בלי לחשוף טוקנים.
 *
 * מאפיינים נדרשים (keys):
 *   META_TOKEN            - Access Token של אפליקציית ה-WhatsApp ב-Meta (ארוך-טווח / קבוע)
 *   META_PHONE_NUMBER_ID  - Phone Number ID של מספר ה-WhatsApp העסקי (לא המספר עצמו)
 *   OWNER_WA_NUMBER       - מספר ה-WhatsApp שלך ב-E.164 בלי + (למשל 9725XXXXXXXX)
 *   SHEET_ID              - מזהה ה-Google Sheet שמשמש כמסד הנתונים (מה-URL)
 *   WEBHOOK_VERIFY_TOKEN  - מחרוזת שרירותית שתגדיר גם בצד Meta לאימות ה-webhook (GET)
 *   WEBHOOK_SECRET        - מחרוזת סוד שנוסיף ל-URL של ה-webhook כפרמטר ?token=... (הגנת POST)
 *
 * מאפיינים אופציונליים:
 *   GRAPH_VERSION         - ברירת מחדל v21.0
 *   ALERT_TEMPLATE_NAME   - שם תבנית ההודעה המאושרת ב-Meta (למשל new_email_alert).
 *                           אם ריק — נשלח טקסט חופשי (עובד רק בתוך חלון 24 השעות).
 *   ALERT_TEMPLATE_LANG   - קוד שפת התבנית (למשל he או en_US). ברירת מחדל en_US.
 *   PROCESSED_LABEL       - שם תווית Gmail לסימון מיילים שכבר נשלחו. ברירת מחדל: WA-Forwarded
 *   SNIPPET_LEN           - אורך מקסימלי של קטע הגוף שנשלח בהתראה. ברירת מחדל 900.
 *   SEARCH_WINDOW         - חלון חיפוש ב-Gmail. ברירת מחדל newer_than:3d
 */

function getConfig_() {
  var p = PropertiesService.getScriptProperties();
  var props = p.getProperties();

  function req(key) {
    var v = props[key];
    if (!v || String(v).trim() === '') {
      throw new Error('חסר Script Property חובה: ' + key + ' — הגדר אותו ב-Project Settings ▸ Script properties.');
    }
    return String(v).trim();
  }
  function opt(key, def) {
    var v = props[key];
    return (v && String(v).trim() !== '') ? String(v).trim() : def;
  }

  return {
    metaToken:          req('META_TOKEN'),
    phoneNumberId:      req('META_PHONE_NUMBER_ID'),
    ownerNumber:        normalizeNumber_(req('OWNER_WA_NUMBER')),
    sheetId:            req('SHEET_ID'),
    verifyToken:        req('WEBHOOK_VERIFY_TOKEN'),
    webhookSecret:      req('WEBHOOK_SECRET'),

    graphVersion:       opt('GRAPH_VERSION', 'v21.0'),
    templateName:       opt('ALERT_TEMPLATE_NAME', ''),
    templateLang:       opt('ALERT_TEMPLATE_LANG', 'en_US'),
    processedLabel:     opt('PROCESSED_LABEL', 'WA-Forwarded'),
    snippetLen:         parseInt(opt('SNIPPET_LEN', '900'), 10),
    searchWindow:       opt('SEARCH_WINDOW', 'newer_than:3d')
  };
}

/** מוריד + / רווחים / מקפים ממספר טלפון, משאיר ספרות בלבד (E.164 ללא +). */
function normalizeNumber_(n) {
  return String(n).replace(/[^0-9]/g, '');
}
