// ---------------------------------------------------------------------------
// מנתח טקסט חופשי -> טיוטות משימות
//
// הרעיון (מסלול א', אפס עלות): המשתמש מבקש מהצ'אט שלו למצות משימות מתמלול/סיכום,
// מעתיק את הרשימה, ומדביק אותה כאן. כל שורה הופכת למשימה, עם ניחוש של עדיפות
// ותאריך יעד מתוך הטקסט עצמו. שום קריאת רשת, שום מפתח, שום עלות.
// ---------------------------------------------------------------------------

export type Priority = "low" | "med" | "high"

export type TaskDraft = {
  title: string
  priority: Priority
  due: string | null // YYYY-MM-DD
}

// --- עוזרי תאריך ---------------------------------------------------------

function toISO(d: Date): string {
  const tz = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tz).toISOString().slice(0, 10)
}

function addDays(base: Date, n: number): Date {
  const d = new Date(base)
  d.setDate(d.getDate() + n)
  return d
}

// ימי השבוע בעברית -> אינדקס (0=ראשון ... 6=שבת), כמו getDay()
const WEEKDAYS: Record<string, number> = {
  ראשון: 0,
  שני: 1,
  שלישי: 2,
  רביעי: 3,
  חמישי: 4,
  שישי: 5,
  שבת: 6,
}

// המופע הקרוב של יום בשבוע (לא כולל היום עצמו)
function nextWeekday(base: Date, target: number): Date {
  let diff = (target - base.getDay() + 7) % 7
  if (diff === 0) diff = 7
  return addDays(base, diff)
}

// --- זיהוי עדיפות --------------------------------------------------------

const HIGH_WORDS = ["דחוף", "בהול", "חשוב מאוד", "קריטי", "urgent", "asap"]
const LOW_WORDS = ["לא דחוף", "כשיהיה זמן", "מתישהו", "נמוך", "low"]

function detectPriority(text: string): Priority {
  const t = text.toLowerCase()
  if (t.includes("!!!") || HIGH_WORDS.some((w) => t.includes(w))) return "high"
  if (LOW_WORDS.some((w) => t.includes(w))) return "low"
  return "med"
}

// --- ניקוי תחילית של שורה (בוליטים / מספור / תיבות סימון) -----------------

const BULLET_RE = /^\s*(?:[-*•‣◦·▪]|\d+[.)]|\[[ xX]?\]|☐|☑|✅)\s+/

// --- זיהוי תאריך יעד -----------------------------------------------------
// מחזיר את התאריך שזוהה ואת הטקסט לאחר הסרת ביטוי התאריך, כדי שהכותרת תישאר נקייה.

function detectDue(
  text: string,
  base: Date
): { due: string | null; rest: string } {
  let rest = text

  // הערה: \b של JS מבוסס על תווי ASCII ולא עובד סביב אותיות עבריות.
  // לכן משתמשים בגבולות מפורשים: תחילת/סוף מחרוזת, רווח או סימן פיסוק.

  // 1) מילים יחסיות ("מחרתיים" לפני "מחר" כדי שלא ייחתך חלקית)
  const rel: Array<[string, number]> = [
    ["מחרתיים", 2],
    ["היום", 0],
    ["מחר", 1],
  ]
  for (const [word, n] of rel) {
    const re = new RegExp(`(^|[\\s.,;:!])${word}(?=$|[\\s.,;:!])`)
    if (re.test(rest)) {
      rest = rest.replace(re, "$1 ")
      return { due: toISO(addDays(base, n)), rest: cleanRest(rest) }
    }
  }

  // 2) יום בשבוע: "יום ראשון" / "ביום שני" / "ליום שלישי" / "לרביעי"
  const wdMatch = rest.match(
    /(?:^|[\s.,;:!])(?:ל?ב?יום\s+|ל)?(ראשון|שני|שלישי|רביעי|חמישי|שישי|שבת)(?=$|[\s.,;:!])/
  )
  if (wdMatch && wdMatch[1] in WEEKDAYS) {
    rest = rest.replace(wdMatch[0], " ")
    return {
      due: toISO(nextWeekday(base, WEEKDAYS[wdMatch[1]])),
      rest: cleanRest(rest),
    }
  }

  // 3) תאריך מספרי: dd/mm, dd.mm, dd-mm, עם שנה אופציונלית
  const dm = rest.match(/\b(\d{1,2})[./-](\d{1,2})(?:[./-](\d{2,4}))?\b/)
  if (dm) {
    const day = parseInt(dm[1], 10)
    const month = parseInt(dm[2], 10)
    let year = dm[3] ? parseInt(dm[3], 10) : base.getFullYear()
    if (year < 100) year += 2000
    if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
      const d = new Date(year, month - 1, day)
      // אם התאריך (בלי שנה מפורשת) כבר עבר השנה — נניח שנה הבאה
      if (!dm[3] && d < new Date(base.getFullYear(), base.getMonth(), base.getDate())) {
        d.setFullYear(year + 1)
      }
      rest = rest.replace(dm[0], " ")
      return { due: toISO(d), rest: cleanRest(rest) }
    }
  }

  return { due: null, rest }
}

// הסרת מילות קישור שנשארו מיותמות אחרי חיתוך התאריך ("עד", "דדליין", וכו')
function cleanRest(text: string): string {
  return text
    .replace(
      /(^|[\s.,;:!])(?:עד(?:\s+ל)?|דדליין|תאריך יעד|בתאריך|ל?תאריך)(?=$|[\s.,;:!])\s*[:\-]?/g,
      "$1 "
    )
    .replace(/[(){}\[\]]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
}

// --- הפונקציה הראשית -----------------------------------------------------

export function parseTasks(input: string, now: Date = new Date()): TaskDraft[] {
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const drafts: TaskDraft[] = []

  for (const rawLine of input.split(/\r?\n/)) {
    let line = rawLine.replace(BULLET_RE, "").trim()
    if (!line) continue

    // דלג על כותרות מובנות כמו "משימות:" בשורה נפרדת
    if (/^[^\s]{1,20}:$/.test(line)) continue

    const priority = detectPriority(line)
    const { due, rest } = detectDue(line, base)

    let title = rest || line
    // הסרת שאריות סימני עדיפות מהכותרת
    title = title.replace(/!{2,}/g, "").replace(/\s{2,}/g, " ").trim()
    if (!title) continue

    drafts.push({ title, priority, due })
  }

  return drafts
}
