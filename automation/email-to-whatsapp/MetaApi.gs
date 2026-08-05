/**
 * MetaApi.gs
 * ----------
 * עטיפה דקה מעל WhatsApp Cloud API (Meta Graph API).
 * מטפל בשליחת טקסט/תבנית/מדיה, והורדה/העלאה של קבצים.
 */

function graphBase_(cfg) {
  return 'https://graph.facebook.com/' + cfg.graphVersion;
}

/** POST כללי ל-endpoint של ההודעות. מחזיר את גוף התשובה כאובייקט. */
function metaPostMessage_(cfg, payload) {
  var url = graphBase_(cfg) + '/' + cfg.phoneNumberId + '/messages';
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + cfg.metaToken },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  var code = res.getResponseCode();
  var body = res.getContentText();
  var json = {};
  try { json = JSON.parse(body); } catch (e) {}
  if (code >= 300) {
    var err = json.error || {};
    var e = new Error('Meta API error ' + code + ': ' + (err.message || body));
    e.metaCode = err.code;              // למשל 131047 = מחוץ לחלון 24 השעות
    e.metaSubcode = err.error_subcode;
    e.httpCode = code;
    throw e;
  }
  return json;
}

/** האם שגיאה נובעת מכך שאנחנו מחוץ לחלון 24 השעות (חובה תבנית). */
function isOutsideWindowError_(e) {
  // 131047 = Re-engagement message, 131051 = unsupported, 470/131026 = מחוץ לחלון.
  return e && (e.metaCode === 131047 || e.metaCode === 470 || e.metaCode === 131026 || e.metaCode === 131051);
}

/** שליחת הודעת טקסט חופשי (עובד רק בתוך חלון 24 השעות). מחזיר wamid. */
function metaSendText_(cfg, to, text) {
  var json = metaPostMessage_(cfg, {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to,
    type: 'text',
    text: { preview_url: false, body: truncate_(text, 4000) }
  });
  return (json.messages && json.messages[0] && json.messages[0].id) || null;
}

/**
 * שליחת הודעת תבנית מאושרת (עובד תמיד, גם מחוץ לחלון).
 * bodyParams = מערך מחרוזות שממלאות את {{1}}, {{2}}, ... בגוף התבנית.
 */
function metaSendTemplate_(cfg, to, templateName, lang, bodyParams) {
  var components = [];
  if (bodyParams && bodyParams.length) {
    components.push({
      type: 'body',
      parameters: bodyParams.map(function (p) {
        return { type: 'text', text: truncate_(String(p == null ? '' : p), 1000) };
      })
    });
  }
  var json = metaPostMessage_(cfg, {
    messaging_product: 'whatsapp',
    to: to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: lang },
      components: components
    }
  });
  return (json.messages && json.messages[0] && json.messages[0].id) || null;
}

/** שליחת מדיה שכבר הועלתה (image / document) לפי media id. */
function metaSendMediaById_(cfg, to, type, mediaId, caption, filename) {
  var media = { id: mediaId };
  if (caption) media.caption = truncate_(caption, 1000);
  if (type === 'document' && filename) media.filename = filename;
  var payload = { messaging_product: 'whatsapp', to: to, type: type };
  payload[type] = media;
  var json = metaPostMessage_(cfg, payload);
  return (json.messages && json.messages[0] && json.messages[0].id) || null;
}

/** העלאת Blob ל-Meta ומחזיר media id (לשליחה כקובץ ל-WhatsApp). */
function metaUploadMedia_(cfg, blob) {
  var url = graphBase_(cfg) + '/' + cfg.phoneNumberId + '/media';
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    headers: { Authorization: 'Bearer ' + cfg.metaToken },
    payload: {
      messaging_product: 'whatsapp',
      type: blob.getContentType(),
      file: blob
    },
    muteHttpExceptions: true
  });
  var json = JSON.parse(res.getContentText());
  if (res.getResponseCode() >= 300) {
    throw new Error('Meta media upload error: ' + res.getContentText());
  }
  return json.id;
}

/** מקבל media id שהתקבל בהודעה נכנסת ומחזיר Blob של הקובץ. */
function metaDownloadMedia_(cfg, mediaId, fallbackName) {
  // שלב 1: מקבלים את כתובת ההורדה הזמנית.
  var metaUrl = graphBase_(cfg) + '/' + mediaId;
  var metaRes = UrlFetchApp.fetch(metaUrl, {
    headers: { Authorization: 'Bearer ' + cfg.metaToken },
    muteHttpExceptions: true
  });
  if (metaRes.getResponseCode() >= 300) {
    throw new Error('Meta media lookup error: ' + metaRes.getContentText());
  }
  var meta = JSON.parse(metaRes.getContentText());
  // שלב 2: מורידים את הקובץ עצמו (דורש Authorization).
  var fileRes = UrlFetchApp.fetch(meta.url, {
    headers: { Authorization: 'Bearer ' + cfg.metaToken },
    muteHttpExceptions: true
  });
  if (fileRes.getResponseCode() >= 300) {
    throw new Error('Meta media download error: ' + fileRes.getResponseCode());
  }
  var blob = fileRes.getBlob();
  if (fallbackName) blob.setName(fallbackName);
  return blob;
}

function truncate_(s, n) {
  s = String(s == null ? '' : s);
  return s.length > n ? s.substring(0, n - 1) + '…' : s;
}
