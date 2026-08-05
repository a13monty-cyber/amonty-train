<div dir="rtl">

# 📧 → 💬 מייל לוואטסאפ — שער חכם לאנשים החשובים

אוטומציה שמעבירה מיילים **מאנשים שאתה בוחר** ישירות לוואטסאפ שלך, ומאפשרת
**לענות מהוואטסאפ** — התשובה נשלחת כמייל בשמך, בתוך אותו שרשור, כולל תמונות וקבצים.
כל השאר (ספאם, ניוזלטרים, רעש) נשאר בתיבת המייל ולא מפריע.

- **קריאת המיילים:** Google Apps Script על חשבון ה-Gmail שלך (בלי שרת, חינם).
- **וואטסאפ:** WhatsApp Cloud API הרשמי של Meta.
- **מסד נתונים:** Google Sheet (רשימת האנשים + מיפוי שיחות).
- **דו-כיווני:** מייל ← → וואטסאפ, כולל קבצים ותמונות.

---

## איך זה עובד (בקצרה)

```
  מייל נכנס מ"דן"  ──►  Apps Script בודק אם דן ברשימה  ──►  Meta Cloud API  ──►  וואטסאפ שלך
                                                                                      │
  מייל נשלח לדן   ◄──  Apps Script (GmailApp.reply)  ◄──  webhook  ◄── אתה מגיב בוואטסאפ
     (אותו שרשור, עם קבצים)
```

כדי לענות למייל מסוים — עשה **swipe-reply (החלקה להשבה)** על ההודעה בוואטסאפ ואז כתוב.
כך המערכת יודעת בדיוק לאיזה שרשור מייל לשייך את התשובה שלך (דרך `context.id`).

---

## ⚠️ שתי מגבלות חשובות לפני שמתחילים

1. **חלון 24 השעות של WhatsApp.** לפי כללי Meta, אפשר לשלוח לך הודעת *טקסט חופשי* רק
   בתוך 24 שעות מאז ש**אתה** שלחת הודעה למספר העסקי. מחוץ לחלון — מותר רק **תבנית מאושרת**.
   לכן ההתראה על מייל חדש נשלחת כ**תבנית** (עובדת תמיד), והגוף המלא + הקבצים המצורפים
   נשלחים כטקסט/מדיה חופשיים — כלומר יגיעו כשהשיחה פעילה (אחרי שהגבת לפחות פעם אחת).
   זה בדיוק תרחיש "ניהול שיחה" שרצית. → **מומלץ מאוד להגדיר תבנית** (שלב 4).

2. **Apps Script לא חושף כותרות HTTP**, ולכן אי-אפשר לאמת את חתימת ה-webhook של Meta.
   במקום זאת אנחנו מוסיפים סוד ל-URL (`?token=...`) שרק אתה ו-Meta מכירים. שמור עליו.

---

## שלב 1 — צור את מסד הנתונים (Google Sheet)

1. פתח [sheets.new](https://sheets.new) וקרא לגיליון למשל `Email→WhatsApp DB`.
2. העתק את ה-**ID** מה-URL:
   `https://docs.google.com/spreadsheets/d/`**`<זה_ה-ID>`**`/edit`
3. שמור אותו — נשתמש בו כ-`SHEET_ID`. (הטאבים ייווצרו אוטומטית בשלב 6.)

---

## שלב 2 — הקם WhatsApp ב-Meta

1. היכנס ל-[developers.facebook.com](https://developers.facebook.com/) → **My Apps** →
   **Create App** → סוג **Business**.
2. בתוך האפליקציה הוסף את המוצר **WhatsApp** → **Set up**.
3. במסך **API Setup** תמצא:
   - **Phone number ID** → זה `META_PHONE_NUMBER_ID` (לא המספר עצמו!).
   - **Temporary access token** — טוב לבדיקות (תקף 24ש'). לפעולה קבועה צור טוקן ארוך-טווח:
     צור **System User** ב-[Business Settings](https://business.facebook.com/settings) →
     תן לו הרשאה לאפליקציה → **Generate token** עם ההרשאות
     `whatsapp_business_messaging` ו-`whatsapp_business_management` → זה `META_TOKEN`.
4. תחת **To** הוסף את מספר הוואטסאפ **שלך** כ-Recipient ואשר את הקוד שיישלח.
   המספר הזה (בפורמט בינלאומי בלי `+`, למשל `9725XXXXXXXX`) הוא `OWNER_WA_NUMBER`.

> בזמן הפיתוח משתמשים במספר הבדיקה של Meta. למעבר לפרודקשן — צרף מספר עסקי אמיתי
> תחת **WhatsApp → Phone numbers**.

---

## שלב 3 — צור את פרויקט ה-Apps Script והכנס את הקוד

**דרך א' (הכי פשוט):**
1. פתח [script.new](https://script.new).
2. לכל קובץ `.gs` בתיקייה הזאת — צור קובץ מקביל בעורך (➕ → Script) והדבק את התוכן:
   `Config.gs`, `Store.gs`, `MetaApi.gs`, `EmailToWhatsApp.gs`, `WhatsAppToEmail.gs`, `Setup.gs`.
3. בעורך: ⚙️ **Project Settings** → סמן **"Show appsscript.json manifest file in editor"**,
   ואז הדבק לתוך `appsscript.json` את התוכן מהקובץ כאן (מגדיר הרשאות + Web App).

**דרך ב' (עם clasp, למתקדמים):**
```bash
npm i -g @google/clasp
clasp login
cp .clasp.json.example .clasp.json   # הדבק את ה-scriptId שלך
clasp push
```

---

## שלב 4 — (מומלץ) צור תבנית התראה מאושרת

כדי שהתראות יגיעו **תמיד** (גם מחוץ לחלון 24 השעות):

1. ב-[business.facebook.com](https://business.facebook.com/) → **WhatsApp Manager** →
   **Message Templates** → **Create template**.
2. הגדר:
   - **Category:** `Utility`
   - **Name:** `new_email_alert` (או כל שם — תכניס אותו ל-`ALERT_TEMPLATE_NAME`)
   - **Language:** בחר שפה (למשל `Hebrew` → קוד `he`, או `English (US)` → `en_US`).
     הקוד הזה נכנס ל-`ALERT_TEMPLATE_LANG`.
   - **Body:** הדבק בדיוק את זה (שלושה משתנים):

     ```
     📧 מייל חדש מ-{{1}}
     נושא: {{2}}

     {{3}}
     ```

   - ב-**Sample content** תן דוגמה לכל משתנה (שם, נושא, קטע טקסט).
3. שלח לאישור. אישור של תבנית Utility לרוב לוקח דקות עד שעות.

> אם תשאיר את `ALERT_TEMPLATE_NAME` ריק — ההתראות יישלחו כטקסט חופשי, שיעבוד רק בתוך
> חלון 24 השעות. שימושי לבדיקות, פחות לשימוש יומיומי.

---

## שלב 5 — הגדר Script Properties

בעורך Apps Script: ⚙️ **Project Settings** → גלול ל-**Script Properties** →
**Add script property** לכל שורה:

| Property | ערך | חובה |
|---|---|---|
| `META_TOKEN` | הטוקן מ-Meta (ארוך-טווח) | ✅ |
| `META_PHONE_NUMBER_ID` | Phone Number ID | ✅ |
| `OWNER_WA_NUMBER` | מספר הוואטסאפ שלך, בלי `+` (למשל `9725...`) | ✅ |
| `SHEET_ID` | ה-ID של הגיליון משלב 1 | ✅ |
| `WEBHOOK_VERIFY_TOKEN` | מחרוזת שתמציא (למשל `amonty-verify-8213`) | ✅ |
| `WEBHOOK_SECRET` | מחרוזת סוד שתמציא (למשל `s3cr3t-9f2a`) | ✅ |
| `ALERT_TEMPLATE_NAME` | `new_email_alert` (אם יצרת תבנית) | מומלץ |
| `ALERT_TEMPLATE_LANG` | `he` או `en_US` — תואם לתבנית | מומלץ |
| `GRAPH_VERSION` | `v21.0` (ברירת מחדל אם משאירים ריק) | ➖ |
| `PROCESSED_LABEL` | ברירת מחדל `WA-Forwarded` | ➖ |
| `SNIPPET_LEN` | אורך קטע הגוף בהתראה, ברירת מחדל `900` | ➖ |
| `SEARCH_WINDOW` | ברירת מחדל `newer_than:3d` | ➖ |

---

## שלב 6 — הרץ את ההקמה ואשר הרשאות

1. בעורך, בחר בתפריט הפונקציות את `setupAll` → **Run**.
2. בפעם הראשונה Google תבקש **הרשאות** (Gmail, Sheets, קריאות רשת) — אשר.
   (אם מופיע "Google hasn't verified this app" — **Advanced** → **Go to … (unsafe)**.
   זו האפליקציה הפרטית *שלך*, זה תקין.)
3. בדוק ב-**Execution log**: אמורות להופיע כתובות הגיליון, מספר הבעלים, ומספר האנשים ברשימה.
   `setupAll` גם יצר את הטאבים בגיליון ותקין טריגר שרץ **כל דקה**.

---

## שלב 7 — פרוס כ-Web App וחבר את ה-webhook ל-Meta

1. בעורך: **Deploy** → **New deployment** → גלגל שיניים → **Web app**.
   - **Execute as:** *Me*
   - **Who has access:** *Anyone*
   - **Deploy** → העתק את ה-**Web app URL** (מסתיים ב-`/exec`).
2. ה-Callback URL שתרשום ב-Meta הוא ה-URL הזה **פלוס הסוד**:
   ```
   https://script.google.com/macros/s/XXXXX/exec?token=<WEBHOOK_SECRET>
   ```
3. ב-Meta (App Dashboard → **WhatsApp** → **Configuration** → **Webhook** → **Edit**):
   - **Callback URL:** הכתובת המלאה עם `?token=...` מלמעלה.
   - **Verify token:** בדיוק הערך של `WEBHOOK_VERIFY_TOKEN`.
   - **Verify and save** — אמור להצליח (זה מפעיל את `doGet`).
4. תחת **Webhook fields** לחץ **Manage** → **Subscribe** לשדה **messages**.

> שים לב: בכל פעם שתשנה קוד ותרצה שהשינוי יחול על ה-webhook — **Deploy → Manage
> deployments → עריכה → New version**. ה-URL נשאר קבוע.

---

## שלב 8 — הוסף אנשים ובדוק

1. פתח את הגיליון → טאב **Whitelist**. מחק את שורת הדוגמה והוסף אנשים:

   | Email | Name | Active |
   |---|---|---|
   | dan@company.com | דן מהעבודה | TRUE |
   | boss@corp.com | המנהלת | TRUE |

   (עמודת `Active` ריקה = פעיל. `FALSE` = מושהה בלי למחוק.)

2. **בדיקת כיוון מייל→וואטסאפ:** בקש ממישהו ברשימה לשלוח לך מייל (או שלח לעצמך
   מכתובת אחרת שהוספת), והרץ ידנית את `testPollNow`. אמורה להגיע התראה בוואטסאפ תוך דקה.
3. **בדיקת כיוון וואטסאפ→מייל:** עשה swipe-reply על ההתראה בוואטסאפ וכתוב תשובה
   (אפשר לצרף תמונה/קובץ). התשובה תגיע כמייל לשולח המקורי, באותו שרשור.

---

## שימוש יומיומי

- **להוסיף/להסיר אנשים:** פשוט ערוך את טאב `Whitelist` בגיליון. אין צורך לגעת בקוד.
- **להשהות זמנית:** שנה `Active` ל-`FALSE`.
- **לענות למייל:** swipe-reply על ההודעה הרלוונטית בוואטסאפ. תשובה בלי ציטוט
  תשויך אוטומטית לשרשור האחרון שקיבלת.
- **לשלוח קבצים/תמונות בתשובה:** צרף אותם רגיל בוואטסאפ — הם יצורפו למייל.

---

## פתרון תקלות

| תופעה | סיבה סבירה | פתרון |
|---|---|---|
| לא מגיעות התראות | הטריגר לא רץ / הרשאות | הרץ `testPollNow` וקרא את ה-Execution log |
| ההתראה נכשלת עם קוד 131047/470 | מחוץ לחלון 24 שעות ואין תבנית | הגדר `ALERT_TEMPLATE_NAME` (שלב 4) |
| גוף מלא/קבצים לא מגיעים בהתראה | החלון סגור | שלח הודעה למספר העסקי כדי לפתוח חלון; זה תקין לפי מדיניות Meta |
| `Verify and save` נכשל ב-Meta | verify token לא תואם / לא פרוס | ודא `WEBHOOK_VERIFY_TOKEN` וש-New deployment בוצע |
| תשובות מהוואטסאפ לא הופכות למייל | webhook לא מנוי ל-messages / חסר `?token` | בדוק Subscribe ל-messages ואת ה-Callback URL |
| שני עותקים של אותו מייל | — | יש דדופ מובנה; אם קרה, בדוק את טאב `Processed` |

---

## הערת פרטיות ואבטחה

- כל הסודות חיים ב-**Script Properties** בלבד — **לא** בקוד שבריפו. בטוח לשתף/לשמור בגיט.
- הקוד רץ על חשבון הגוגל **שלך** ופועל רק על המיילים שלך. שום צד ג' לא מעורב מלבד Meta.
- ה-webhook מוגן בסוד `?token=`. אם אתה חושד שדלף — שנה את `WEBHOOK_SECRET`,
  עדכן את ה-Callback URL ב-Meta, ופרוס גרסה חדשה.

</div>
