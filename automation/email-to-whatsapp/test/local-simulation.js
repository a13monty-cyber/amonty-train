/**
 * local-simulation.js  (Node, לא Apps Script)
 * --------------------------------------------
 * הרצה מקומית שמוכיחה שהלוגיקה עובדת מקצה-לקצה, בלי חשבון גוגל/Meta אמיתי.
 * טוענת את קבצי ה-.gs לתוך sandbox עם מוקים ל-GmailApp / UrlFetchApp / Sheets,
 * ומריצה תרחישים אמיתיים:
 *   1. מייל מאדם ברשימה  -> נשלחת התראת WhatsApp נכונה (תבנית + פרמטרים).
 *   2. ריצה שנייה        -> אין שליחה כפולה (dedupe).
 *   3. מייל מאדם שלא ברשימה -> לא נשלח כלום.
 *   4. תשובה בוואטסאפ (context.id) -> נשלח מייל בשרשור הנכון, עם קובץ מצורף.
 *   5. אימות webhook (doGet) -> מחזיר hub.challenge.
 *   6. מחוץ לחלון 24 שעות -> ההתראה (תבנית) עדיין נשלחת בהצלחה.
 *
 * הרצה:  node automation/email-to-whatsapp/test/local-simulation.js
 */

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ---- תוצאות ותשתית בדיקה --------------------------------------------------
let passed = 0, failed = 0;
function check(name, cond) {
  if (cond) { passed++; console.log('  ✓ ' + name); }
  else { failed++; console.log('  ✗ ' + name); }
}
function section(t) { console.log('\n▶ ' + t); }

// ---- מצב משותף למוקים -----------------------------------------------------
const fetchLog = [];          // כל קריאות UrlFetchApp
let simulateOutsideWindow = false;
let wamidCounter = 0, mediaCounter = 0;
const sentEmails = [];        // תשובות מייל שנשלחו דרך thread.reply

// ---- מוק Sheet בזיכרון ----------------------------------------------------
function makeSheet(name) {
  const rows = [];
  const sheet = {
    _name: name, _rows: rows,
    getLastRow: () => rows.length,
    setFrozenRows: () => sheet,
    appendRow: (arr) => { rows.push(arr.slice()); return sheet; },
    getRange: (r, c, nr = 1, nc = 1) => ({
      setValues: (vals) => {
        for (let i = 0; i < nr; i++) {
          const ri = r - 1 + i;
          while (rows.length <= ri) rows.push([]);
          for (let j = 0; j < nc; j++) rows[ri][c - 1 + j] = vals[i][j];
        }
        return { setFontWeight: () => {} };
      },
      getValues: () => {
        const out = [];
        for (let i = 0; i < nr; i++) {
          const ri = r - 1 + i; const row = rows[ri] || [];
          const line = [];
          for (let j = 0; j < nc; j++) line.push(row[c - 1 + j] !== undefined ? row[c - 1 + j] : '');
          out.push(line);
        }
        return out;
      },
      clearContent: () => { for (let i = 0; i < nr; i++) { const ri = r - 1 + i; if (rows[ri]) for (let j = 0; j < nc; j++) rows[ri][c - 1 + j] = ''; } },
      setFontWeight: () => ({})
    })
  };
  return sheet;
}
const spreadsheet = {
  _sheets: {},
  getSheetByName(n) { return this._sheets[n] || null; },
  insertSheet(n) { const s = makeSheet(n); this._sheets[n] = s; return s; }
};

// ---- מוק Blob -------------------------------------------------------------
function makeBlob(name, type, bytes) {
  let _name = name, _type = type;
  return {
    getName: () => _name, setName: (n) => { _name = n; return this; },
    getContentType: () => _type, getSize: () => (bytes ? bytes.length : 10),
    copyBlob() { return makeBlob(_name, _type, bytes); }
  };
}

// ---- מוק UrlFetchApp ------------------------------------------------------
const UrlFetchApp = {
  fetch(url, params) {
    params = params || {};
    fetchLog.push({ url, method: (params.method || 'get').toLowerCase(), payload: params.payload });
    const resp = (code, obj, blob) => ({
      getResponseCode: () => code,
      getContentText: () => (typeof obj === 'string' ? obj : JSON.stringify(obj)),
      getBlob: () => blob
    });

    // שליחת הודעה
    if (/\/messages$/.test(url) && (params.method || '').toLowerCase() === 'post') {
      const body = JSON.parse(params.payload);
      if (simulateOutsideWindow && body.type === 'text') {
        return resp(400, { error: { message: 'Re-engagement message', code: 131047 } });
      }
      return resp(200, { messages: [{ id: 'wamid.' + (++wamidCounter) }] });
    }
    // העלאת מדיה
    if (/\/media$/.test(url) && (params.method || '').toLowerCase() === 'post') {
      return resp(200, { id: 'media.' + (++mediaCounter) });
    }
    // חיפוש כתובת מדיה (GET graph/<id>)
    if (/graph\.facebook\.com\/[^/]+\/[^/]+$/.test(url) && (params.method || 'get').toLowerCase() === 'get') {
      return resp(200, { url: 'https://lookaside.example/' + url.split('/').pop() });
    }
    // הורדת הקובץ עצמו
    if (/lookaside\.example/.test(url)) {
      return resp(200, 'binary', makeBlob('download.bin', 'image/jpeg', Buffer.from('img')));
    }
    return resp(200, {});
  }
};

// ---- שאר מוקי GAS ---------------------------------------------------------
const props = {
  META_TOKEN: 'TESTTOKEN', META_PHONE_NUMBER_ID: '111222333',
  OWNER_WA_NUMBER: '972500000000', SHEET_ID: 'sheet-1',
  WEBHOOK_VERIFY_TOKEN: 'verify-abc', WEBHOOK_SECRET: 'secret-xyz',
  ALERT_TEMPLATE_NAME: 'new_email_alert', ALERT_TEMPLATE_LANG: 'he'
};
const cacheStore = {};
const sandbox = {
  console,
  Logger: { log: () => {} },
  PropertiesService: { getScriptProperties: () => ({ getProperties: () => props, getProperty: (k) => props[k] }) },
  SpreadsheetApp: { openById: () => spreadsheet },
  UrlFetchApp,
  CacheService: { getScriptCache: () => ({ get: (k) => cacheStore[k] || null, put: (k, v) => { cacheStore[k] = v; } }) },
  LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }) },
  ContentService: {
    MimeType: { JSON: 'json' },
    createTextOutput: (s) => ({ _s: s, setMimeType() { return this; }, getContent() { return this._s; } })
  },
  GmailApp: null // מוגדר בכל תרחיש
};

// ---- טעינת קבצי ה-.gs לתוך ה-sandbox --------------------------------------
const dir = path.join(__dirname, '..');
const files = ['Config.gs', 'Store.gs', 'MetaApi.gs', 'EmailToWhatsApp.gs', 'WhatsAppToEmail.gs', 'Setup.gs'];
vm.createContext(sandbox);
for (const f of files) {
  const code = fs.readFileSync(path.join(dir, f), 'utf8');
  vm.runInContext(code, sandbox, { filename: f });
}
const S = sandbox; // גישה לפונקציות הגלובליות שנטענו

// ===========================================================================
// תרחיש 1+2+3: מייל -> וואטסאפ
// ===========================================================================
section('תרחיש 1: מייל מאדם ברשימה -> התראת WhatsApp');

// מכינים רשימת אנשים בגיליון
S.initSheets();
const wl = spreadsheet.getSheetByName('Whitelist');
wl._rows.length = 1; // משאירים כותרת בלבד
wl.appendRow(['dan@company.com', 'דן מהעבודה', 'TRUE']);
wl.appendRow(['spam@ads.com', '', 'FALSE']);

// מוק Gmail עם מייל אחד מדן ואחד מלא-רשומים
function makeMessage(id, from, subject, body, attachments) {
  return {
    getId: () => id, getFrom: () => from, getSubject: () => subject,
    getPlainBody: () => body, getBody: () => body,
    getAttachments: () => attachments || [],
    reply: (text, opts) => { sentEmails.push({ threadFrom: from, text, attachments: (opts && opts.attachments) || [] }); }
  };
}
const danMsg = makeMessage('m1', 'דן כהן <dan@company.com>', 'עדכון דחוף', 'שלום, יש עדכון חשוב בפרויקט. נא לחזור אליי.', []);
const thread1 = { getId: () => 'thread-1', getMessages: () => [danMsg] };
const spamMsg = makeMessage('m2', 'Ads <spam@ads.com>', 'מבצע!!!', 'קנה עכשיו', []);
const thread2 = { getId: () => 'thread-2', getMessages: () => [spamMsg] };

let searchThreads = [thread1];
sandbox.GmailApp = {
  search: () => searchThreads,
  getThreadById: (id) => (id === 'thread-1' ? thread1 : null)
};

fetchLog.length = 0;
S.pollGmailAndForward();

const msgCalls = fetchLog.filter(c => /\/messages$/.test(c.url));
check('נשלחה בדיוק הודעת WhatsApp אחת', msgCalls.length === 1);
const payload1 = JSON.parse(msgCalls[0].payload);
check('סוג ההודעה = template', payload1.type === 'template');
check('הנמען = מספר הבעלים', payload1.to === '972500000000');
check('שם התבנית נכון', payload1.template && payload1.template.name === 'new_email_alert');
const bp = payload1.template.components[0].parameters.map(p => p.text);
check('פרמטר 1 = שם השולח הידידותי', bp[0] === 'דן מהעבודה');
check('פרמטר 2 = נושא המייל', bp[1] === 'עדכון דחוף');
check('פרמטר 3 מכיל את גוף המייל', /עדכון חשוב/.test(bp[2]));

// המיפוי נשמר ב-Sent לצורך תשובה עתידית
const sent = spreadsheet.getSheetByName('Sent');
check('נשמר מיפוי wamid->thread ב-Sent', sent.getLastRow() === 2 && sent._rows[1][1] === 'thread-1');

section('תרחיש 2: ריצה שנייה על אותו מייל -> אין כפילות');
fetchLog.length = 0;
S.pollGmailAndForward();
check('לא נשלחה הודעה נוספת (dedupe עובד)', fetchLog.filter(c => /\/messages$/.test(c.url)).length === 0);

section('תרחיש 3: מייל מאדם שלא ברשימה -> מתעלמים');
searchThreads = [thread2]; // spam@ads.com מסומן FALSE, וגם החיפוש לא היה מחזיר אותו בפועל
fetchLog.length = 0;
S.pollGmailAndForward();
check('לא נשלחה הודעה עבור שולח לא-מורשה', fetchLog.filter(c => /\/messages$/.test(c.url)).length === 0);

// ===========================================================================
// תרחיש 4: וואטסאפ -> מייל (עם קובץ)
// ===========================================================================
section('תרחיש 4: תשובה בוואטסאפ -> מייל בשרשור הנכון + קובץ מצורף');
const recordedWamid = sent._rows[1][0]; // ה-wamid שנשלח בתרחיש 1
sentEmails.length = 0;

// המשתמש עונה עם תמונה + כיתוב, תוך ציטוט (context.id) של ההתראה על המייל של דן
const inbound = {
  object: 'whatsapp_business_account',
  entry: [{ changes: [{ value: { messages: [{
    from: '972500000000', id: 'in-1', type: 'image',
    context: { id: recordedWamid },
    image: { id: 'imgid-1', mime_type: 'image/jpeg', caption: 'קיבלתי, שולח את הצילום שביקשת' }
  }] } }] }]
};
const postEvent = {
  parameter: { token: 'secret-xyz' },
  postData: { contents: JSON.stringify(inbound) }
};
const postRes = S.doPost(postEvent);
check('doPost החזיר 200/ok', /"ok":true/.test(postRes.getContent()));
check('נשלח בדיוק מייל אחד', sentEmails.length === 1);
check('המייל נשלח בשרשור הנכון (של דן)', /dan@company.com/.test(sentEmails[0].threadFrom));
check('גוף המייל = הכיתוב מהוואטסאפ', /קיבלתי, שולח/.test(sentEmails[0].text));
check('הקובץ מהוואטסאפ צורף למייל', sentEmails[0].attachments.length === 1);

section('תרחיש 4ב: POST עם token שגוי -> נדחה');
const badRes = S.doPost({ parameter: { token: 'wrong' }, postData: { contents: '{}' } });
check('token שגוי מסומן unauthorized', /unauthorized/.test(badRes.getContent()));

// ===========================================================================
// תרחיש 5: אימות webhook (doGet)
// ===========================================================================
section('תרחיש 5: אימות webhook של Meta (doGet)');
const getRes = S.doGet({ parameter: { 'hub.mode': 'subscribe', 'hub.verify_token': 'verify-abc', 'hub.challenge': 'CHAL123' } });
check('מוחזר hub.challenge בעת verify_token נכון', getRes.getContent() === 'CHAL123');
const getBad = S.doGet({ parameter: { 'hub.mode': 'subscribe', 'hub.verify_token': 'nope', 'hub.challenge': 'X' } });
check('verify_token שגוי לא מחזיר את ה-challenge', getBad.getContent() !== 'X');

// ===========================================================================
// תרחיש 6: מחוץ לחלון 24 שעות -> התבנית עדיין עוברת
// ===========================================================================
section('תרחיש 6: מחוץ לחלון 24 שעות -> ההתראה (תבנית) נשלחת בכל זאת');
// מייל חדש מדן (id חדש כדי לא להיחסם ע"י dedupe)
const danMsg2 = makeMessage('m3', 'דן כהן <dan@company.com>', 'עוד עדכון', 'תוכן נוסף', []);
const thread3 = { getId: () => 'thread-3', getMessages: () => [danMsg2] };
searchThreads = [thread3];
sandbox.GmailApp.getThreadById = (id) => (id === 'thread-3' ? thread3 : null);
simulateOutsideWindow = true; // טקסט חופשי ייכשל, תבנית תעבור
fetchLog.length = 0;
S.pollGmailAndForward();
const tmplCall = fetchLog.filter(c => /\/messages$/.test(c.url)).map(c => JSON.parse(c.payload)).find(p => p.type === 'template');
check('ההתראה נשלחה כתבנית למרות חלון סגור', !!tmplCall);

// ---- סיכום ----------------------------------------------------------------
console.log('\n' + '='.repeat(50));
console.log(`תוצאה: ${passed} עברו, ${failed} נכשלו`);
console.log('='.repeat(50));
process.exit(failed === 0 ? 0 : 1);
