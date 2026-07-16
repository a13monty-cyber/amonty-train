# יסודות התנועה בכדורסל — Movement Foundation for Basketball

מדריך עבודה מקצועי (עברית, RTL) למאמן ביצועים וספורטתרפיסט, לשחקני כדורסל בגילאי 13–20.
מכסה תנועה, בלימה, הורדת מרכז כובד, שינויי כיוון ומניעת פציעות — ברמת אקדמיית ביצועים בינלאומית.

## התוצרים (Deliverables)

- **`Movement_Foundation_Basketball.pdf`** — הספר המעוצב המלא (A4, RTL, כ-69 עמודים,
  תוכן עניינים אוטומטי, מספרי עמודים, כותרות רצות, איורים, קודי QR וקישורים).
- **`Movement_Foundation_Basketball.docx`** — גרסת Word ניתנת לעריכה (טקסט, טבלאות ותמונות).
- **`index.html`** — מקור HTML עצמאי (נוצר על ידי הבנייה).

## מבנה

```
book/
  style.css                 עיצוב הדפוס (RTL, פונטים, רכיבים)
  assets/fonts/             פונטים (Rubik עברית+לטינית)
  assets/qr/                קודי QR שנוצרים אוטומטית
  build/
    build.py                מרכיב הכול → PDF (+ DOCX)
    components.py            רכיבי HTML (קופסאות, כרטיסי תרגיל, טבלאות, צ'קליסטים)
    frontmatter.py          שער, תוכן עניינים, "כיצד להשתמש"
    svglib.py               איורים סכמטיים (SVG)
    sources.py              רישום מקורות אמיתיים + יצירת QR
    make_docx.py            המרת ה-HTML ל-Word
    chapters/ch01..ch12.py  תוכן הפרקים
```

## בנייה מחדש

```bash
cd book
python3 build/build.py     # יוצר index.html, ה-PDF וה-DOCX
```

תלויות: `weasyprint`, `qrcode[pil]`, `pymupdf`, `beautifulsoup4`, `lxml`, `python-docx`.

## הערה על מקורות ואמינות

כל טענה מקצועית מהותית מלווה בהפניה למקור אמין (PubMed / BJSM / JOSPT / Sports Medicine /
AJSM) או לערוץ הדרכה מקצועי מוכר. קודי ה-QR והקישורים מפנים למקורות אמיתיים ומאומתים.
כאשר לא ניתן לקשר לסרטון בודד ספציפי, הקישור מפנה לערוץ הרשמי של המקור עם חיפוש ממוקד —
כדי שלא לצטט מקור שאינו קיים.
