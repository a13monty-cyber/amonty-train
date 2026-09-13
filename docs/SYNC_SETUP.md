# הפעלת סנכרון בין מכשירים (Firebase + Vercel)

מדריך זה מפעיל את הסנכרון של אפליקציית המשימות. **בלי הצעדים האלה האפליקציה
עובדת רגיל במצב מקומי** (הנתונים נשמרים רק על המכשיר). אחרי הצעדים — הנתונים
מסונכרנים בענן וזמינים בכל המכשירים, וזה **~0 ₪ לחודש** לשימוש אישי.

---

## חלק א' — יצירת פרויקט Firebase (חינם)

1. היכנס ל-https://console.firebase.google.com והתחבר עם חשבון Google.
2. **Add project** → תן שם (למשל `amonty-tasks`) → אפשר להשאיר Analytics כבוי.
3. בתפריט הצד: **Build → Authentication → Get started**.
   - בלשונית **Sign-in method** הפעל את **Google** ושמור.
4. בתפריט הצד: **Build → Firestore Database → Create database**.
   - בחר **Production mode** (נגדיר חוקים בהמשך) ואזור קרוב (למשל `eur3`).
5. הגדר את **חוקי האבטחה**: לשונית **Rules** → הדבק את תוכן הקובץ
   `firestore.rules` שבפרויקט → **Publish**.
   (זה מה שמבטיח שרק אתה תיגש לנתונים שלך.)

## חלק ב' — קבלת מפתחות ההגדרה

1. **Project settings** (גלגל השיניים) → **General** → גלול ל-**Your apps**.
2. לחץ על אייקון **Web** (`</>`) → תן כינוי → **Register app**.
3. תקבל אובייקט `firebaseConfig` עם ערכים. העתק אותם.
4. בפרויקט: העתק את `.env.local.example` ל-`.env.local` ומלא:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...            (apiKey)
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...        (authDomain)
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...         (projectId)
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...     (storageBucket)
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...(messagingSenderId)
   NEXT_PUBLIC_FIREBASE_APP_ID=...             (appId)
   ```

5. הרץ מקומית: `npm run dev` ופתח `http://localhost:3000/tasks`.
   אמור להופיע כפתור **"התחבר לסנכרון"**. התחבר עם Google —
   משימות מקומיות קיימות יעלו אוטומטית לענן בהתחברות הראשונה.

## חלק ג' — פריסה לאונליין עם Vercel (חינם)

1. העלה את הריפו ל-GitHub (כבר קיים) והיכנס ל-https://vercel.com עם GitHub.
2. **Add New → Project** → בחר את הריפו `amonty-train` → **Import**.
3. ב-**Environment Variables** הוסף את אותם 6 המשתנים מ-`.env.local`.
4. **Deploy**. בסיום תקבל כתובת (למשל `amonty-tasks.vercel.app`).
5. חשוב: ב-Firebase → **Authentication → Settings → Authorized domains**
   הוסף את דומיין ה-Vercel שקיבלת, אחרת ההתחברות תיחסם באונליין.
6. פתח `<הכתובת>/tasks` בנייד ובמחשב, התחבר באותו חשבון — והמשימות מסונכרנות.

---

## נקודות שכדאי לדעת

- **המפתחות ב-`NEXT_PUBLIC_*` נחשפים בדפדפן** — זה תקין ובכוונה. האבטחה היא
  חוקי Firestore, שמצמידים כל משתמש לנתונים של עצמו בלבד.
- **אופליין עדיין עובד** גם במצב מסונכרן — Firestore שומר מטמון מקומי ומסתנכרן
  כשחוזר אינטרנט.
- **מצב מקומי נשאר כברירת מחדל** אם לא מגדירים כלום. אפשר גם פשוט לא להתחבר.
