"use client"

import { useState, useRef, useEffect } from "react"
import { MONTY_LOGO } from "./montyLogo"

/* =====================================================================
   MONTY · מחולל תוכנית הכנה פיזית
   הזנה היברידית: הדבקה/העלאה של חומר → AI ממפה לשדות (מילה במילה) →
   עריכה ידנית בטופס → תצוגה חיה בפורמט הקבוע → הדפסה / שמירה כ-PDF.
   ===================================================================== */

type Color = "gold" | "navy" | "red"

interface Phase { pill: string; title: string; goal: string; bullets: string[] }
interface Row { day: string; type: string; color: Color; detail: string }
interface Guideline { title: string; body: string }

interface Plan {
  title: string
  athlete: { name: string; age: string; sport: string }
  phasesTitle: string
  phases: Phase[]
  scheduleTitle: string
  schedule: Row[]
  guidelinesTitle: string
  guidelines: Guideline[]
  footer: string
}

const SAMPLE: Plan = {
  title: "תוכנית הכנה פיזית מודרגת",
  athlete: { name: "ליאור קלימי", age: "15", sport: "כדורסל" },
  phasesTitle: "שלבי התפתחות בתוכנית (פגרת הקיץ)",
  phases: [
    {
      pill: "שלב 1 | שבועות 1–2",
      title: "בניית בסיס אירובי",
      goal: "הכנת גידים, מפרקים ומערכת הלב-ריאה לעומס.",
      bullets: [
        "תדירות: 2–3 אימונים בשבוע.",
        'אופי המאמץ: ריצה רציפה בקצב אחיד וקל ("קצב דיבור").',
        "משך אימון: 20–25 דקות בלבד.",
        "משטח מומלץ: דשא או מסלול אתלטיקה.",
      ],
    },
    {
      pill: "שלב 2 | שבועות 3–6",
      title: "אינטרוולים וכושר משחק",
      goal: "סימולציית קצב המשחק, שינויי כיוון והתאוששות.",
      bullets: [
        "פורמט 30/30: 30 שניות ספרינט (85%) / 30 שניות הליכה (2 סטים X 8 חזרות).",
        "אינטרוול מגרש (Shuttle Runs): 4 הלוך-חזור מקו לקו X 5 סטים (מנוחה 90 ש').",
      ],
    },
  ],
  scheduleTitle: "לוח זמנים שבועי מומלץ (שלב האינטרוולים)",
  schedule: [
    { day: "ראשון", type: "אינטרוולים 30/30", color: "gold", detail: "חימום דינמי + 2 סטים של 8 חזרות (30 ש' מאמץ / 30 ש' מנוחה)" },
    { day: "שני", type: "מנוחה פעילה / טכניקה", color: "navy", detail: "עבודת קליעות קלה, טיפול בגמישות ושחרור (ללא ריצות עומס)" },
    { day: "שלישי", type: "ריצת נפח קלה", color: "navy", detail: "20 דקות ריצה בקצב נוח + 10 דקות חיזוק שרירי ליבה וייצוב" },
    { day: "רביעי", type: "מנוחה מלאה", color: "red", detail: "התאוששות גוף, שינה איכותית והזנה מתאימה" },
    { day: "חמישי", type: "אינטרוולים ספציפיים (מגרש)", color: "gold", detail: "ספרינטים מקו לקו מדמי משחק (4–6 סטים) / Shuttle Runs" },
    { day: "שישי", type: "עבודת כדור וקליעות", color: "navy", detail: "אימון כדורסל טכני בלבד / זריקות חופשיות" },
    { day: "שבת", type: "מנוחה מלאה", color: "red", detail: "הטענת אנרגיה והכנה לשבוע הבא" },
  ],
  guidelinesTitle: "דגשים מקצועיים והנחיות מונטי",
  guidelines: [
    { title: "1. חימום דינמי (חובה)", body: "10 דקות לפני כל אימון: הנפות רגליים, מכרעים בתנועה, צעדי רדיפה ודילוגים. אין לבצע מתיחות סטטיות." },
    { title: "2. ציוד והנעלה", body: "ביצוע ריצות הבסיס והאינטרוולים בחוץ ייעשה אך ורק עם נעלי ריצה ייעודיות (ולא נעלי כדורסל)." },
    { title: "3. התאוששות ותזונה", body: "גיל 15 מתאפיין בצמיחה מהירה. דרושות 8–9 שעות שינה, מים וארוחה משולבת פחמימה וחלבון לאחר האימון." },
  ],
  footer: "תוכנית זו מהווה בסיס עבודה מודרג לפגרת הקיץ. יש להקשיב לגוף ולעצור במקרה של כאב חריג באזור השוקיים או אכילס.",
}

const EMPTY: Plan = {
  title: "תוכנית הכנה פיזית מודרגת",
  athlete: { name: "", age: "", sport: "" },
  phasesTitle: "שלבי התפתחות בתוכנית",
  phases: [{ pill: "שלב 1", title: "", goal: "", bullets: [""] }],
  scheduleTitle: "לוח זמנים שבועי מומלץ",
  schedule: [{ day: "ראשון", type: "", color: "navy", detail: "" }],
  guidelinesTitle: "דגשים מקצועיים והנחיות מונטי",
  guidelines: [{ title: "1. ", body: "" }],
  footer: "",
}

const MODEL = "claude-sonnet-4-6"
const getKey = () => { try { return localStorage.getItem("ttb_api_key") || "" } catch { return "" } }

function fileToB64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(String(r.result).split(",")[1] || "")
    r.onerror = rej
    r.readAsDataURL(file)
  })
}

function normalize(raw: any): Plan {
  const p: Plan = JSON.parse(JSON.stringify(SAMPLE))
  if (!raw || typeof raw !== "object") return p
  if (raw.title) p.title = String(raw.title)
  if (raw.athlete) {
    p.athlete = {
      name: String(raw.athlete.name ?? ""),
      age: String(raw.athlete.age ?? ""),
      sport: String(raw.athlete.sport ?? ""),
    }
  }
  if (raw.phasesTitle) p.phasesTitle = String(raw.phasesTitle)
  if (Array.isArray(raw.phases)) {
    p.phases = raw.phases.map((x: any) => ({
      pill: String(x?.pill ?? ""),
      title: String(x?.title ?? ""),
      goal: String(x?.goal ?? ""),
      bullets: Array.isArray(x?.bullets) ? x.bullets.map((b: any) => String(b)) : [],
    }))
  }
  if (raw.scheduleTitle) p.scheduleTitle = String(raw.scheduleTitle)
  if (Array.isArray(raw.schedule)) {
    p.schedule = raw.schedule.map((x: any) => {
      let c: Color = "navy"
      if (x?.color === "gold" || x?.color === "red" || x?.color === "navy") c = x.color
      return { day: String(x?.day ?? ""), type: String(x?.type ?? ""), color: c, detail: String(x?.detail ?? "") }
    })
  }
  if (raw.guidelinesTitle) p.guidelinesTitle = String(raw.guidelinesTitle)
  if (Array.isArray(raw.guidelines)) {
    p.guidelines = raw.guidelines.map((x: any) => ({ title: String(x?.title ?? ""), body: String(x?.body ?? "") }))
  }
  if (raw.footer !== undefined) p.footer = String(raw.footer)
  return p
}

function extractJSON(text: string): any {
  const t = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim()
  try { return JSON.parse(t) } catch {}
  const a = t.indexOf("{"), b = t.lastIndexOf("}")
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)) } catch {} }
  return null
}

export default function PlanBuilder() {
  const [plan, setPlan] = useState<Plan>(SAMPLE)
  const [importOpen, setImportOpen] = useState(false)
  const [importText, setImportText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState("")
  const [keyOpen, setKeyOpen] = useState(false)
  const [keyVal, setKeyVal] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setKeyVal(getKey()) }, [])

  const set = (patch: Partial<Plan>) => setPlan(p => ({ ...p, ...patch }))
  const setAthlete = (k: keyof Plan["athlete"], v: string) => setPlan(p => ({ ...p, athlete: { ...p.athlete, [k]: v } }))

  // ---- phases ----
  const setPhase = (i: number, patch: Partial<Phase>) => setPlan(p => { const a = [...p.phases]; a[i] = { ...a[i], ...patch }; return { ...p, phases: a } })
  const setBullet = (i: number, j: number, v: string) => setPlan(p => { const a = [...p.phases]; const b = [...a[i].bullets]; b[j] = v; a[i] = { ...a[i], bullets: b }; return { ...p, phases: a } })
  const addBullet = (i: number) => setPlan(p => { const a = [...p.phases]; a[i] = { ...a[i], bullets: [...a[i].bullets, ""] }; return { ...p, phases: a } })
  const delBullet = (i: number, j: number) => setPlan(p => { const a = [...p.phases]; a[i] = { ...a[i], bullets: a[i].bullets.filter((_, k) => k !== j) }; return { ...p, phases: a } })
  const addPhase = () => setPlan(p => ({ ...p, phases: [...p.phases, { pill: `שלב ${p.phases.length + 1}`, title: "", goal: "", bullets: [""] }] }))
  const delPhase = (i: number) => setPlan(p => ({ ...p, phases: p.phases.filter((_, k) => k !== i) }))

  // ---- schedule ----
  const setRow = (i: number, patch: Partial<Row>) => setPlan(p => { const a = [...p.schedule]; a[i] = { ...a[i], ...patch }; return { ...p, schedule: a } })
  const addRow = () => setPlan(p => ({ ...p, schedule: [...p.schedule, { day: "", type: "", color: "navy", detail: "" }] }))
  const delRow = (i: number) => setPlan(p => ({ ...p, schedule: p.schedule.filter((_, k) => k !== i) }))

  // ---- guidelines ----
  const setGuide = (i: number, patch: Partial<Guideline>) => setPlan(p => { const a = [...p.guidelines]; a[i] = { ...a[i], ...patch }; return { ...p, guidelines: a } })
  const addGuide = () => setPlan(p => ({ ...p, guidelines: [...p.guidelines, { title: `${p.guidelines.length + 1}. `, body: "" }] }))
  const delGuide = (i: number) => setPlan(p => ({ ...p, guidelines: p.guidelines.filter((_, k) => k !== i) }))

  const saveKey = () => { try { localStorage.setItem("ttb_api_key", keyVal.trim()) } catch {}; setKeyOpen(false) }

  async function runImport() {
    const key = getKey()
    if (!key) { setErr("צריך מפתח Anthropic API כדי לפרק את החומר אוטומטית."); setKeyOpen(true); return }
    if (!importText.trim() && !file) { setErr("הדבק טקסט או העלה קובץ."); return }
    setBusy(true); setErr("")
    try {
      const instructions =
        "אתה ממיר חומר אימון גולמי לפורמט JSON קבוע של תוכנית הכנה פיזית של MONTY.\n" +
        "חוקים מחייבים:\n" +
        "1. שמור על הטקסט של המשתמש מילה במילה — אל תתרגם, אל תשכתב, אל תסכם ואל תוסיף תוכן משלך.\n" +
        "2. רק מפה את מה שקיים בחומר לשדות המתאימים. אם שדה חסר בחומר — השאר מחרוזת ריקה או מערך ריק.\n" +
        "3. בעברית שמור עברית. שמור מספרים, סימנים וניסוח בדיוק.\n" +
        "4. schedule.color: השתמש ב-\"red\" ליום מנוחה, \"gold\" ליום אינטרוולים/ספרינט/עצים, אחרת \"navy\".\n" +
        "5. החזר JSON תקין בלבד, בלי טקסט נוסף ובלי גדרות ```.\n\n" +
        "מבנה ה-JSON:\n" +
        '{"title":"","athlete":{"name":"","age":"","sport":""},"phasesTitle":"","phases":[{"pill":"","title":"","goal":"","bullets":[""]}],"scheduleTitle":"","schedule":[{"day":"","type":"","color":"navy","detail":""}],"guidelinesTitle":"","guidelines":[{"title":"","body":""}],"footer":""}'

      const content: any[] = []
      if (file) {
        const b64 = await fileToB64(file)
        if (file.type === "application/pdf") {
          content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: b64 } })
        } else if (file.type.startsWith("image/")) {
          content.push({ type: "image", source: { type: "base64", media_type: file.type, data: b64 } })
        }
      }
      content.push({ type: "text", text: instructions + (importText.trim() ? "\n\nהחומר:\n" + importText.trim() : "\n\nהחומר נמצא בקובץ המצורף.") })

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({ model: MODEL, max_tokens: 4000, messages: [{ role: "user", content }] }),
      })
      if (!res.ok) {
        const t = await res.text()
        throw new Error("שגיאת API (" + res.status + "): " + t.slice(0, 300))
      }
      const data = await res.json()
      const txt = data?.content?.[0]?.text || ""
      const parsed = extractJSON(txt)
      if (!parsed) throw new Error("לא הצלחתי לקרוא JSON מהתשובה. נסה שוב או ערוך ידנית.")
      setPlan(normalize(parsed))
      setImportOpen(false)
      setImportText(""); setFile(null)
      if (fileRef.current) fileRef.current.value = ""
    } catch (e: any) {
      setErr(e?.message || String(e))
    } finally {
      setBusy(false)
    }
  }

  const colorClass = (c: Color) => (c === "gold" ? "mv-gold" : c === "red" ? "mv-red" : "mv-navy")

  return (
    <div className="pb-shell">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ---------- top bar ---------- */}
      <div className="pb-topbar">
        <div className="pb-brand">
          <img src={MONTY_LOGO} alt="MONTY" />
          <div>
            <b>מחולל תוכניות · MONTY</b>
            <span>Performance &amp; Recovery</span>
          </div>
        </div>
        <div className="pb-actions">
          <button className="pb-btn ghost" onClick={() => setPlan(EMPTY)}>📄 חדש</button>
          <button className="pb-btn ghost" onClick={() => setPlan(SAMPLE)}>↺ דוגמה</button>
          <button className="pb-btn key" onClick={() => setKeyOpen(v => !v)}>🔑 מפתח</button>
          <button className="pb-btn import" onClick={() => setImportOpen(true)}>✨ הדבק / העלה חומר</button>
          <button className="pb-btn print" onClick={() => window.print()}>🖨️ הדפס / PDF</button>
        </div>
      </div>

      {keyOpen && (
        <div className="pb-keybar">
          <input type="password" placeholder="sk-ant-..." value={keyVal} onChange={e => setKeyVal(e.target.value)} />
          <button onClick={saveKey}>שמור</button>
          <span>נשמר בדפדפן בלבד (localStorage)</span>
        </div>
      )}

      <div className="pb-main">
        {/* ---------- editor ---------- */}
        <div className="pb-editor">
          <Group title="כותרת ופרטי ספורטאי">
            <Field label="כותרת התוכנית"><input value={plan.title} onChange={e => set({ title: e.target.value })} /></Field>
            <div className="pb-row3">
              <Field label="שם הספורטאי"><input value={plan.athlete.name} onChange={e => setAthlete("name", e.target.value)} /></Field>
              <Field label="גיל"><input value={plan.athlete.age} onChange={e => setAthlete("age", e.target.value)} /></Field>
              <Field label="ענף"><input value={plan.athlete.sport} onChange={e => setAthlete("sport", e.target.value)} /></Field>
            </div>
          </Group>

          <Group title="שלבי התפתחות">
            <Field label="כותרת המקטע"><input value={plan.phasesTitle} onChange={e => set({ phasesTitle: e.target.value })} /></Field>
            {plan.phases.map((ph, i) => (
              <div className="pb-card" key={i}>
                <div className="pb-card-head">
                  <span>כרטיס שלב {i + 1}</span>
                  <button className="pb-x" onClick={() => delPhase(i)} disabled={plan.phases.length <= 1}>מחק</button>
                </div>
                <div className="pb-row2">
                  <Field label="תגית שלב"><input value={ph.pill} onChange={e => setPhase(i, { pill: e.target.value })} /></Field>
                  <Field label="כותרת"><input value={ph.title} onChange={e => setPhase(i, { title: e.target.value })} /></Field>
                </div>
                <Field label="מטרה"><input value={ph.goal} onChange={e => setPhase(i, { goal: e.target.value })} /></Field>
                <label className="pb-lbl">נקודות</label>
                {ph.bullets.map((b, j) => (
                  <div className="pb-bullet" key={j}>
                    <input value={b} onChange={e => setBullet(i, j, e.target.value)} />
                    <button className="pb-x" onClick={() => delBullet(i, j)}>✕</button>
                  </div>
                ))}
                <button className="pb-add sm" onClick={() => addBullet(i)}>+ נקודה</button>
              </div>
            ))}
            <button className="pb-add" onClick={addPhase}>+ הוסף שלב</button>
          </Group>

          <Group title="לוח זמנים שבועי">
            <Field label="כותרת המקטע"><input value={plan.scheduleTitle} onChange={e => set({ scheduleTitle: e.target.value })} /></Field>
            {plan.schedule.map((r, i) => (
              <div className="pb-srow" key={i}>
                <input className="pb-day" placeholder="יום" value={r.day} onChange={e => setRow(i, { day: e.target.value })} />
                <input className="pb-type" placeholder="סוג האימון" value={r.type} onChange={e => setRow(i, { type: e.target.value })} />
                <select value={r.color} onChange={e => setRow(i, { color: e.target.value as Color })}>
                  <option value="gold">כתום</option>
                  <option value="navy">כחול</option>
                  <option value="red">אדום (מנוחה)</option>
                </select>
                <input className="pb-detail" placeholder="פירוט והדגשים" value={r.detail} onChange={e => setRow(i, { detail: e.target.value })} />
                <button className="pb-x" onClick={() => delRow(i)}>✕</button>
              </div>
            ))}
            <button className="pb-add" onClick={addRow}>+ הוסף יום</button>
          </Group>

          <Group title="דגשים מקצועיים">
            <Field label="כותרת המקטע"><input value={plan.guidelinesTitle} onChange={e => set({ guidelinesTitle: e.target.value })} /></Field>
            {plan.guidelines.map((g, i) => (
              <div className="pb-card" key={i}>
                <div className="pb-card-head">
                  <span>כרטיס דגש {i + 1}</span>
                  <button className="pb-x" onClick={() => delGuide(i)} disabled={plan.guidelines.length <= 1}>מחק</button>
                </div>
                <Field label="כותרת"><input value={g.title} onChange={e => setGuide(i, { title: e.target.value })} /></Field>
                <Field label="תוכן"><textarea value={g.body} onChange={e => setGuide(i, { body: e.target.value })} /></Field>
              </div>
            ))}
            <button className="pb-add" onClick={addGuide}>+ הוסף דגש</button>
          </Group>

          <Group title="הערת שוליים">
            <Field label=""><textarea value={plan.footer} onChange={e => set({ footer: e.target.value })} /></Field>
          </Group>
        </div>

        {/* ---------- live preview ---------- */}
        <div className="pb-preview">
          <div className="mv-page" id="montyPrint">
            <div className="mv-head">
              <div className="mv-head-text">
                <h1>{plan.title}</h1>
                <div className="mv-sub">MONTY PERFORMANCE &amp; RECOVERY</div>
              </div>
              <img className="mv-logo" src={MONTY_LOGO} alt="MONTY" />
            </div>

            {(plan.athlete.name || plan.athlete.age || plan.athlete.sport) && (
              <div className="mv-athlete">
                <b>ספורטאי:</b> {plan.athlete.name}
                <span className="mv-sep">|</span>
                <b>גיל:</b> {plan.athlete.age}
                <span className="mv-sep">|</span>
                <b>ענף:</b> {plan.athlete.sport}
              </div>
            )}
            <div className="mv-rule" />

            {plan.phases.length > 0 && <div className="mv-section">{plan.phasesTitle}</div>}
            <div className="mv-cards2">
              {plan.phases.map((ph, i) => (
                <div className="mv-card" key={i}>
                  {ph.pill && <span className="mv-pill">{ph.pill}</span>}
                  {ph.title && <h3>{ph.title}</h3>}
                  {ph.goal && <div className="mv-goal" dangerouslySetInnerHTML={{ __html: boldLead(ph.goal) }} />}
                  <ul>
                    {ph.bullets.filter(Boolean).map((b, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: boldLead(b) }} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {plan.schedule.length > 0 && <div className="mv-section">{plan.scheduleTitle}</div>}
            <table className="mv-table">
              <thead>
                <tr><th style={{ width: "14%" }}>יום</th><th style={{ width: "30%" }}>סוג האימון</th><th style={{ width: "56%" }}>פירוט והדגשים</th></tr>
              </thead>
              <tbody>
                {plan.schedule.map((r, i) => (
                  <tr key={i}>
                    <td className="mv-day">{r.day}</td>
                    <td className={"mv-type " + colorClass(r.color)}>{r.type}</td>
                    <td>{r.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {plan.guidelines.length > 0 && <div className="mv-section">{plan.guidelinesTitle}</div>}
            <div className="mv-cards3">
              {plan.guidelines.map((g, i) => (
                <div className="mv-card" key={i}>
                  {g.title && <h4>{g.title}</h4>}
                  {g.body && <p dangerouslySetInnerHTML={{ __html: boldLead(g.body) }} />}
                </div>
              ))}
            </div>

            {plan.footer && <div className="mv-foot">{plan.footer}</div>}
          </div>
        </div>
      </div>

      {/* ---------- import modal ---------- */}
      {importOpen && (
        <div className="pb-overlay" onClick={() => !busy && setImportOpen(false)}>
          <div className="pb-modal" onClick={e => e.stopPropagation()}>
            <h3>✨ הדבק או העלה חומר</h3>
            <p className="pb-hint">ה-AI ימפה את החומר לפורמט הקבוע — מילה במילה, בלי לשנות את הטקסט שלך. אחר כך אפשר לתקן ידנית.</p>
            <textarea className="pb-import-ta" placeholder="הדבק כאן את התוכן של התוכנית (טקסט חופשי)..." value={importText} onChange={e => setImportText(e.target.value)} />
            <div className="pb-file">
              <button className="pb-btn ghost" onClick={() => fileRef.current?.click()}>📎 בחר קובץ (PDF / תמונה)</button>
              <span>{file ? file.name : "לא נבחר קובץ"}</span>
              <input ref={fileRef} type="file" accept=".pdf,image/*" style={{ display: "none" }} onChange={e => setFile(e.target.files?.[0] || null)} />
            </div>
            {err && <div className="pb-err">{err}</div>}
            <div className="pb-modal-actions">
              <button className="pb-btn import" onClick={runImport} disabled={busy}>{busy ? "מעבד..." : "✨ עצב לי אוטומטית"}</button>
              <button className="pb-btn ghost" onClick={() => setImportOpen(false)} disabled={busy}>ביטול</button>
            </div>
          </div>
        </div>
      )}
      {err && !importOpen && <div className="pb-toast">{err}</div>}
    </div>
  )
}

/* bold the "label:" lead before the first colon, matching the template's <b> style */
function boldLead(s: string): string {
  const esc = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  const idx = esc.indexOf(":")
  if (idx > 0 && idx < 40) return "<b>" + esc.slice(0, idx + 1) + "</b>" + esc.slice(idx + 1)
  return esc
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pb-group">
      <div className="pb-group-title">{title}</div>
      {children}
    </div>
  )
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="pb-field">
      {label && <label className="pb-lbl">{label}</label>}
      {children}
    </div>
  )
}

const CSS = `
.pb-shell{--navy:#1D3A89;--navy-soft:#1D3FAF;--gold:#F49E0A;--cream:#F9F6F2;--ink:#33414F;--muted:#647486;--line:#E7E0D3;--pill:#DBE9FD;--red:#DB2626;
  min-height:100vh;background:#eef0f3;font-family:'Heebo',sans-serif;color:var(--ink)}
.pb-topbar{position:sticky;top:0;z-index:30;display:flex;justify-content:space-between;align-items:center;gap:12px;
  background:var(--navy);color:#fff;padding:10px 18px;flex-wrap:wrap}
.pb-brand{display:flex;align-items:center;gap:10px}
.pb-brand img{width:38px;height:38px;object-fit:contain;background:#fff;border-radius:8px;padding:3px}
.pb-brand b{display:block;font-size:15px;font-weight:800}
.pb-brand span{display:block;font-size:11px;letter-spacing:.6px;opacity:.85}
.pb-actions{display:flex;gap:8px;flex-wrap:wrap}
.pb-btn{font-family:'Heebo',sans-serif;font-size:13.5px;font-weight:600;padding:8px 14px;border:none;border-radius:9px;cursor:pointer}
.pb-btn.ghost{background:rgba(255,255,255,.14);color:#fff}
.pb-btn.key{background:rgba(255,255,255,.14);color:#fff}
.pb-btn.import{background:var(--gold);color:#fff}
.pb-btn.print{background:#fff;color:var(--navy)}
.pb-keybar{position:sticky;top:58px;z-index:29;display:flex;gap:8px;align-items:center;background:#14285f;padding:8px 18px;flex-wrap:wrap}
.pb-keybar input{flex:1;min-width:180px;padding:7px 10px;border:none;border-radius:8px;font-family:'Heebo',sans-serif;font-size:13px}
.pb-keybar button{padding:7px 14px;border:none;border-radius:8px;background:var(--gold);color:#fff;font-family:'Heebo',sans-serif;font-weight:600;cursor:pointer}
.pb-keybar span{color:#cdd7ef;font-size:12px}

.pb-main{display:grid;grid-template-columns:minmax(340px,440px) 1fr;gap:18px;padding:18px;align-items:start}
@media(max-width:1000px){.pb-main{grid-template-columns:1fr}}

.pb-editor{display:flex;flex-direction:column;gap:14px}
.pb-group{background:#fff;border:1px solid #e6e8ee;border-radius:14px;padding:14px 16px}
.pb-group-title{font-weight:800;color:var(--navy);font-size:15px;margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid var(--gold)}
.pb-field{margin-bottom:9px}
.pb-lbl{display:block;font-size:12.5px;color:var(--muted);margin-bottom:4px;font-weight:600}
.pb-editor input,.pb-editor textarea,.pb-editor select{width:100%;font-family:'Heebo',sans-serif;font-size:13.5px;padding:8px 10px;
  border:1.5px solid #e2e4ea;border-radius:8px;background:#fafbfc;color:var(--ink)}
.pb-editor textarea{min-height:58px;resize:vertical}
.pb-editor input:focus,.pb-editor textarea:focus,.pb-editor select:focus{outline:2px solid var(--navy);border-color:transparent}
.pb-row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.pb-row3{display:grid;grid-template-columns:2fr 1fr 1fr;gap:8px}
.pb-card{border:1px solid #eceef3;border-radius:11px;padding:11px;margin:9px 0;background:#fcfcfd}
.pb-card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:12.5px;font-weight:700;color:var(--muted)}
.pb-bullet{display:flex;gap:6px;margin-bottom:6px}
.pb-bullet input{flex:1}
.pb-srow{display:grid;grid-template-columns:80px 1.3fr 96px 2fr 30px;gap:6px;align-items:center;margin-bottom:6px}
@media(max-width:560px){.pb-srow{grid-template-columns:1fr 1fr;}.pb-srow .pb-detail{grid-column:1/3}}
.pb-x{border:1px solid #e6b9b9;background:#fff;color:#b45252;border-radius:7px;padding:5px 8px;font-size:12px;cursor:pointer;font-family:'Heebo',sans-serif}
.pb-x:disabled{opacity:.4;cursor:not-allowed}
.pb-add{border:1.5px dashed var(--navy);background:#fff;color:var(--navy);border-radius:9px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Heebo',sans-serif;width:100%;margin-top:4px}
.pb-add.sm{width:auto;padding:5px 12px;font-size:12px;border-style:solid;border-width:1px}

/* import modal */
.pb-overlay{position:fixed;inset:0;background:rgba(15,25,55,.5);z-index:60;display:flex;align-items:center;justify-content:center;padding:16px}
.pb-modal{background:#fff;border-radius:16px;padding:22px;max-width:560px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3)}
.pb-modal h3{color:var(--navy);font-size:19px;margin-bottom:6px}
.pb-hint{font-size:13px;color:var(--muted);margin-bottom:12px;line-height:1.6}
.pb-import-ta{width:100%;min-height:160px;font-family:'Heebo',sans-serif;font-size:13.5px;padding:11px;border:1.5px solid #e2e4ea;border-radius:10px;resize:vertical}
.pb-file{display:flex;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap}
.pb-file span{font-size:12.5px;color:var(--muted)}
.pb-file .pb-btn.ghost{background:#eef0f5;color:var(--navy)}
.pb-modal-actions{display:flex;gap:8px;margin-top:16px}
.pb-err{margin-top:10px;background:#fdecec;color:#b02020;padding:9px 12px;border-radius:8px;font-size:12.5px;white-space:pre-wrap}
.pb-toast{position:fixed;bottom:16px;right:16px;background:#fdecec;color:#b02020;padding:10px 14px;border-radius:10px;font-size:13px;z-index:60;max-width:420px;box-shadow:0 6px 20px rgba(0,0,0,.15)}

/* ---------------- live preview (matches the fixed MONTY format) ---------------- */
.pb-preview{position:sticky;top:78px;max-height:calc(100vh - 96px);overflow:auto;display:flex;justify-content:center}
.mv-page{width:210mm;min-height:297mm;background:var(--cream);padding:16mm 15mm 12mm;box-shadow:0 6px 28px rgba(0,0,0,.16);
  color:var(--ink);line-height:1.5;flex-shrink:0}
.mv-head{display:flex;align-items:center;gap:18px;justify-content:space-between}
.mv-head-text{flex:1;text-align:center}
.mv-head-text h1{color:var(--navy);font-size:30px;font-weight:800;letter-spacing:.3px}
.mv-sub{color:var(--gold);font-size:16px;font-weight:700;letter-spacing:1.2px;margin-top:2px;direction:ltr}
.mv-logo{width:96px;height:96px;object-fit:contain;flex-shrink:0}
.mv-athlete{margin-top:14px;border:1.5px solid var(--line);border-radius:10px;background:#fff;padding:9px 16px;font-size:15px;text-align:center}
.mv-athlete b{color:var(--navy)}
.mv-sep{color:var(--line);margin:0 8px}
.mv-rule{height:3px;background:var(--gold);border-radius:3px;margin:14px 0 4px}
.mv-section{display:flex;align-items:center;gap:10px;flex-direction:row-reverse;justify-content:flex-start;
  color:var(--navy);font-size:20px;font-weight:800;margin:26px 0 14px}
.mv-section::before{content:'';width:6px;height:26px;background:var(--gold);border-radius:3px;display:inline-block}
.mv-cards2{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.mv-card{background:#fff;border:1px solid var(--line);border-top:3px solid var(--gold);border-radius:12px;padding:16px 18px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
.mv-pill{display:inline-block;background:var(--pill);color:var(--navy-soft);font-weight:700;font-size:12.5px;padding:4px 12px;border-radius:20px;margin-bottom:10px}
.mv-card h3{color:var(--navy);font-size:18px;font-weight:800;margin-bottom:8px}
.mv-goal{font-size:14px;margin-bottom:8px}
.mv-card ul{list-style:none;padding:0;margin:0}
.mv-card li{position:relative;padding-inline-start:16px;font-size:14px;margin:5px 0}
.mv-card li::before{content:'';position:absolute;inset-inline-start:0;top:9px;width:6px;height:6px;border-radius:50%;background:var(--gold)}
.mv-card li b,.mv-goal b{color:var(--navy)}
.mv-table{width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;font-size:14px;box-shadow:0 1px 4px rgba(0,0,0,.05)}
.mv-table thead th{background:var(--navy);color:#fff;font-weight:700;padding:12px 14px;text-align:right}
.mv-table tbody td{padding:11px 14px;background:#fff;border-bottom:1px solid var(--line);vertical-align:top}
.mv-table tbody tr:nth-child(even) td{background:#FBF9F5}
.mv-table tbody tr:last-child td{border-bottom:none}
.mv-day{font-weight:700;white-space:nowrap}
.mv-type{font-weight:800}
.mv-gold{color:var(--gold)}.mv-navy{color:var(--navy)}.mv-red{color:var(--red)}
.mv-cards3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
.mv-cards3 .mv-card h4{color:var(--navy);font-size:15.5px;font-weight:800;margin-bottom:7px}
.mv-cards3 .mv-card p{font-size:13.5px}
.mv-cards3 .mv-card b{color:var(--navy)}
.mv-foot{margin-top:26px;border-top:1px solid var(--line);padding-top:12px;text-align:center;color:var(--muted);font-size:12.5px;font-style:italic}

/* ---------------- print: only the plan page ---------------- */
@media print{
  .pb-topbar,.pb-keybar,.pb-editor,.pb-overlay,.pb-toast{display:none !important}
  .pb-shell{background:#fff}
  .pb-main{display:block;padding:0}
  .pb-preview{position:static;max-height:none;overflow:visible;display:block}
  .mv-page{width:auto;min-height:auto;margin:0;box-shadow:none;padding:10mm 9mm}
  .mv-card,.mv-table tbody tr,.mv-athlete{break-inside:avoid}
  .mv-section{break-after:avoid}
  @page{size:A4;margin:0}
}
`
