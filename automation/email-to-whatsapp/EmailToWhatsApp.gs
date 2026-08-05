/**
 * EmailToWhatsApp.gs
 * ------------------
 * הכיוון: מייל נכנס מאדם ברשימה  ->  התראה בוואטסאפ.
 * רץ אוטומטית כל דקה דרך טריגר מבוסס-זמן (ראה Setup.gs ▸ installTrigger).
 */

function pollGmailAndForward() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return; // מונע חפיפה בין ריצות
  try {
    var cfg = getConfig_();
    var senders = getActiveWhitelist_();
    if (!senders.length) {
      Logger.log('רשימת האנשים ריקה — אין את מי להעביר.');
      return;
    }

    var names = getWhitelistNames_();
    var processed = loadProcessedIds_();
    var query = buildGmailQuery_(senders, cfg);
    var threads = GmailApp.search(query, 0, 30);

    threads.forEach(function (thread) {
      var messages = thread.getMessages();
      var threadId = thread.getId();
      messages.forEach(function (msg) {
        var msgId = msg.getId();
        if (processed[msgId]) return;                       // כבר טופל
        var fromEmail = parseEmailAddress_(msg.getFrom());
        if (senders.indexOf(fromEmail) === -1) {            // לא מאדם ברשימה (למשל תשובה שלך)
          return;
        }
        try {
          forwardEmailToWhatsApp_(cfg, msg, threadId, names);
          markProcessed_(msgId);
          processed[msgId] = true;
        } catch (err) {
          Logger.log('כשל בהעברת מייל ' + msgId + ': ' + err.message);
          // לא מסמנים כמטופל -> ננסה שוב בריצה הבאה.
        }
      });
    });

    pruneProcessed_();
  } finally {
    lock.releaseLock();
  }
}

/** בונה שאילתת חיפוש Gmail: מהאנשים ברשימה, בחלון הזמן שהוגדר, לא צ'אטים. */
function buildGmailQuery_(senders, cfg) {
  var fromClause = 'from:(' + senders.join(' OR ') + ')';
  return fromClause + ' ' + cfg.searchWindow + ' -in:chats';
}

/** מעביר מייל בודד לוואטסאפ: התראה (תבנית) + אם החלון פתוח, גם גוף מלא וקבצים. */
function forwardEmailToWhatsApp_(cfg, msg, threadId, names) {
  var fromEmail = parseEmailAddress_(msg.getFrom());
  var displayName = names[fromEmail] || parseDisplayName_(msg.getFrom()) || fromEmail;
  var subject = msg.getSubject() || '(ללא נושא)';
  var bodyText = htmlToPlain_(msg.getPlainBody() || msg.getBody() || '');
  var snippet = truncate_(bodyText, cfg.snippetLen);

  // 1) הודעת ההתראה הראשית — תבנית מאושרת (עובדת תמיד) או טקסט חופשי (בתוך חלון בלבד).
  var waMessageId;
  if (cfg.templateName) {
    waMessageId = metaSendTemplate_(cfg, cfg.ownerNumber, cfg.templateName, cfg.templateLang,
      [displayName, subject, snippet]);
  } else {
    var text = '📧 מייל חדש מ-' + displayName + '\nנושא: ' + subject + '\n\n' + snippet;
    waMessageId = metaSendText_(cfg, cfg.ownerNumber, text);
  }

  // חשוב: שומרים את המיפוי wamid -> שרשור, כדי שתשובה בוואטסאפ תדע לאיזה מייל לענות.
  if (waMessageId) {
    recordSent_(waMessageId, threadId, fromEmail, subject);
  }

  // 2) ניסיון "מיטבי" לשלוח גם גוף מלא + קבצים מצורפים כטקסט/מדיה חופשיים.
  //    זה יצליח רק אם חלון 24 השעות פתוח (כלומר כבר הגבת בשיחה הזו לאחרונה).
  //    אם לא — נדלג בשקט; ההתראה הראשית כבר הגיעה.
  trySendFullBodyAndAttachments_(cfg, msg, bodyText, subject);
}

function trySendFullBodyAndAttachments_(cfg, msg, bodyText, subject) {
  // גוף מלא (אם ארוך מהקטע שכבר נשלח).
  if (bodyText && bodyText.length > cfg.snippetLen) {
    try {
      metaSendText_(cfg, cfg.ownerNumber, '📄 המשך התוכן:\n\n' + bodyText);
    } catch (e) {
      if (!isOutsideWindowError_(e)) Logger.log('שליחת גוף מלא נכשלה: ' + e.message);
      return; // אם החלון סגור, גם הקבצים ייכשלו — נעצור כאן.
    }
  }

  var attachments = msg.getAttachments({ includeInlineImages: false, includeAttachments: true });
  attachments.forEach(function (att) {
    if (att.getSize() > 90 * 1024 * 1024) return; // מגבלת Meta ~100MB
    try {
      var mediaId = metaUploadMedia_(cfg, att.copyBlob());
      var type = att.getContentType().indexOf('image/') === 0 ? 'image' : 'document';
      metaSendMediaById_(cfg, cfg.ownerNumber, type, mediaId,
        att.getName(), att.getName());
    } catch (e) {
      if (!isOutsideWindowError_(e)) Logger.log('שליחת קובץ נכשלה (' + att.getName() + '): ' + e.message);
    }
  });
}

// ---- עזרי פרסינג ----------------------------------------------------------

/** "דן כהן <dan@x.com>" -> "dan@x.com" (lowercase). */
function parseEmailAddress_(from) {
  var m = String(from).match(/<([^>]+)>/);
  var email = m ? m[1] : String(from);
  return email.trim().toLowerCase();
}

/** "דן כהן <dan@x.com>" -> "דן כהן". */
function parseDisplayName_(from) {
  var s = String(from).trim();
  var m = s.match(/^"?([^"<]+?)"?\s*<[^>]+>$/);
  return m ? m[1].trim() : '';
}

/** ניקוי גס של HTML לטקסט קריא, אם אין גוף טקסט. */
function htmlToPlain_(s) {
  return String(s)
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
