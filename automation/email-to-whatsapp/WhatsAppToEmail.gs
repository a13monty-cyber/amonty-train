/**
 * WhatsAppToEmail.gs
 * ------------------
 * הכיוון: מגיב בוואטסאפ  ->  נשלח מייל בשמך, בתוך אותו שרשור.
 *
 * הקובץ הזה גם מממש את ה-Web App ש-Meta קוראת אליו:
 *   doGet  = אימות ה-webhook (hub.challenge) בעת ההרשמה מול Meta.
 *   doPost = קבלת הודעות WhatsApp נכנסות.
 *
 * הגנה: מכיוון ש-Apps Script לא חושף כותרות HTTP (ולכן אי-אפשר לאמת חתימת
 * X-Hub-Signature-256), אנחנו דורשים פרמטר סוד ב-URL: ...?token=WEBHOOK_SECRET
 * את ה-URL הזה (כולל הפרמטר) רושמים ב-Meta כ-Callback URL.
 */

// ---- אימות ה-webhook (GET) -------------------------------------------------

function doGet(e) {
  var cfg = getConfig_();
  var p = (e && e.parameter) || {};
  if (p['hub.mode'] === 'subscribe' && p['hub.verify_token'] === cfg.verifyToken) {
    return ContentService.createTextOutput(p['hub.challenge'] || '');
  }
  return ContentService.createTextOutput('OK');
}

// ---- קבלת הודעות נכנסות (POST) --------------------------------------------

function doPost(e) {
  var cfg;
  try {
    cfg = getConfig_();
  } catch (err) {
    return jsonOut_({ ok: false, error: 'config' });
  }

  // בדיקת הסוד ב-URL (?token=...).
  var token = (e && e.parameter && e.parameter.token) || '';
  if (token !== cfg.webhookSecret) {
    return jsonOut_({ ok: false, error: 'unauthorized' });
  }

  var update;
  try {
    update = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOut_({ ok: true }); // מחזירים 200 כדי ש-Meta לא תנסה שוב על זבל
  }

  try {
    handleInboundUpdate_(cfg, update);
  } catch (err) {
    Logger.log('שגיאה בטיפול בהודעה נכנסת: ' + err.message);
  }
  // תמיד מחזירים 200 מהר — אחרת Meta תשלח שוב ושוב.
  return jsonOut_({ ok: true });
}

function handleInboundUpdate_(cfg, update) {
  if (!update || update.object !== 'whatsapp_business_account') return;
  (update.entry || []).forEach(function (entry) {
    (entry.changes || []).forEach(function (change) {
      var value = change.value || {};
      var messages = value.messages || [];
      messages.forEach(function (m) {
        // דילוג על עדכוני סטטוס (נמסר/נקרא) — אלה מגיעים ב-value.statuses, לא כאן.
        handleInboundMessage_(cfg, m);
      });
    });
  });
}

function handleInboundMessage_(cfg, m) {
  // רק הבעלים שלך רשאי לנהל שיחות — התעלמות מכל מספר אחר.
  if (normalizeNumber_(m.from) !== cfg.ownerNumber) return;

  // דדופ: Meta עלולה לשלוח את אותה הודעה כמה פעמים.
  var cache = CacheService.getScriptCache();
  if (cache.get('in_' + m.id)) return;
  cache.put('in_' + m.id, '1', 6 * 60 * 60); // 6 שעות

  // לאיזה מייל להשיב? לפי ההודעה שציטטת (swipe-reply) -> context.id.
  var contextId = m.context && m.context.id;
  var target = lookupThreadByWaMessageId_(contextId) || lookupMostRecentThread_();
  if (!target || !target.threadId) {
    Logger.log('הודעה נכנסת ללא שרשור מתאים — מדלגים. context=' + contextId);
    return;
  }

  var thread = GmailApp.getThreadById(target.threadId);
  if (!thread) {
    Logger.log('שרשור לא נמצא: ' + target.threadId);
    return;
  }

  var parsed = extractInboundContent_(cfg, m);
  var bodyText = parsed.text || '(ללא טקסט)';

  var options = { attachments: parsed.attachments };
  // getMessages()[last].reply() שולח בתוך אותו שרשור, לנמען המקורי.
  var msgs = thread.getMessages();
  msgs[msgs.length - 1].reply(bodyText, options);
  Logger.log('נשלחה תשובת מייל בשרשור ' + target.threadId + ' (' + parsed.attachments.length + ' קבצים).');
}

/** מחלץ טקסט + קבצים מצורפים מהודעת WhatsApp נכנסת (text / image / document / audio / video). */
function extractInboundContent_(cfg, m) {
  var out = { text: '', attachments: [] };

  if (m.type === 'text' && m.text) {
    out.text = m.text.body || '';
    return out;
  }

  var mediaTypes = ['image', 'document', 'video', 'audio', 'voice', 'sticker'];
  if (mediaTypes.indexOf(m.type) !== -1 && m[m.type]) {
    var media = m[m.type];
    out.text = media.caption || '';
    try {
      var name = media.filename || defaultFileName_(m.type, media.mime_type);
      var blob = metaDownloadMedia_(cfg, media.id, name);
      out.attachments.push(blob);
    } catch (e) {
      out.text += '\n\n[לא הצלחתי להוריד קובץ מצורף מהוואטסאפ]';
      Logger.log('הורדת מדיה נכשלה: ' + e.message);
    }
    return out;
  }

  // סוגים אחרים (location, contacts וכו') — לפחות נעביר טקסט תיאורי.
  out.text = '[הודעת ' + m.type + ' מוואטסאפ]';
  return out;
}

function defaultFileName_(type, mime) {
  var ext = (mime && mime.split('/')[1]) ? mime.split('/')[1].split(';')[0] : 'bin';
  return type + '-' + Date.now() + '.' + ext;
}

function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
