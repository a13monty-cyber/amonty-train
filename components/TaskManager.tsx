"use client"

import { useEffect, useMemo, useRef, useState } from "react"

// ---------------------------------------------------------------------------
// טיפוסים
// ---------------------------------------------------------------------------

type Priority = "low" | "med" | "high"

type Task = {
  id: string
  title: string
  done: boolean
  priority: Priority
  due: string | null // YYYY-MM-DD
  source: string | null // מאיפה הגיעה המשימה (למשל "ישיבה 12/9")
  createdAt: number
}

type FilterKind = "all" | "open" | "done"

const STORAGE_KEY = "amonty.tasks.v1"

const PRIORITY_LABEL: Record<Priority, string> = {
  high: "דחוף",
  med: "רגיל",
  low: "נמוך",
}

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, med: 1, low: 2 }

// ---------------------------------------------------------------------------
// אחסון מקומי
// ---------------------------------------------------------------------------

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as Task[]
  } catch {
    return []
  }
}

function saveTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // אחסון חסום (מצב פרטי / נוקה) — לא מפילים את האפליקציה
  }
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function todayISO(): string {
  const d = new Date()
  const tz = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tz).toISOString().slice(0, 10)
}

// ---------------------------------------------------------------------------
// הקומפוננטה הראשית
// ---------------------------------------------------------------------------

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loaded, setLoaded] = useState(false)
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState<Priority>("med")
  const [due, setDue] = useState("")
  const [filter, setFilter] = useState<FilterKind>("open")
  const inputRef = useRef<HTMLInputElement>(null)

  // טעינה ראשונית מהאחסון המקומי
  useEffect(() => {
    setTasks(loadTasks())
    setLoaded(true)
  }, [])

  // שמירה בכל שינוי (רק אחרי הטעינה הראשונית, כדי לא לדרוס בריק)
  useEffect(() => {
    if (loaded) saveTasks(tasks)
  }, [tasks, loaded])

  function addTask(e?: React.FormEvent) {
    e?.preventDefault()
    const t = title.trim()
    if (!t) return
    const task: Task = {
      id: uid(),
      title: t,
      done: false,
      priority,
      due: due || null,
      source: null,
      createdAt: Date.now(),
    }
    setTasks((prev) => [task, ...prev])
    setTitle("")
    setDue("")
    setPriority("med")
    inputRef.current?.focus()
  }

  function toggle(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }

  function remove(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function cyclePriority(id: string) {
    const next: Record<Priority, Priority> = { low: "med", med: "high", high: "low" }
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority: next[t.priority] } : t))
    )
  }

  function clearDone() {
    setTasks((prev) => prev.filter((t) => !t.done))
  }

  const counts = useMemo(() => {
    const open = tasks.filter((t) => !t.done).length
    return { open, done: tasks.length - open, all: tasks.length }
  }, [tasks])

  const visible = useMemo(() => {
    const filtered = tasks.filter((t) => {
      if (filter === "open") return !t.done
      if (filter === "done") return t.done
      return true
    })
    // פתוחות לפי עדיפות ואז לפי תאריך יעד; שהושלמו יורדות למטה
    return filtered.slice().sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1
      if (a.priority !== b.priority)
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      const ad = a.due ?? "9999-99-99"
      const bd = b.due ?? "9999-99-99"
      if (ad !== bd) return ad < bd ? -1 : 1
      return b.createdAt - a.createdAt
    })
  }, [tasks, filter])

  const today = todayISO()

  return (
    <div className="tm-root" dir="rtl">
      <style>{STYLES}</style>

      <header className="tm-header">
        <div className="tm-header-inner">
          <div className="tm-brand">
            <span className="tm-logo">◆</span>
            <div>
              <h1>המשימות שלי</h1>
              <p>נשמר במכשיר שלך · עובד גם בלי אינטרנט</p>
            </div>
          </div>
          <div className="tm-stat">
            <strong>{counts.open}</strong>
            <span>פתוחות</span>
          </div>
        </div>
      </header>

      <main className="tm-main">
        {/* טופס הוספה */}
        <form className="tm-add" onSubmit={addTask}>
          <input
            ref={inputRef}
            className="tm-input"
            type="text"
            placeholder="מה צריך לעשות?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="כותרת המשימה"
          />
          <div className="tm-add-row">
            <select
              className="tm-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              aria-label="עדיפות"
            >
              <option value="high">דחוף</option>
              <option value="med">רגיל</option>
              <option value="low">נמוך</option>
            </select>
            <input
              className="tm-date"
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              aria-label="תאריך יעד"
            />
            <button className="tm-btn tm-btn-primary" type="submit">
              הוספה
            </button>
          </div>
        </form>

        {/* פילטרים */}
        <div className="tm-filters">
          <div className="tm-tabs">
            <button
              className={filter === "open" ? "on" : ""}
              onClick={() => setFilter("open")}
            >
              פתוחות ({counts.open})
            </button>
            <button
              className={filter === "done" ? "on" : ""}
              onClick={() => setFilter("done")}
            >
              בוצעו ({counts.done})
            </button>
            <button
              className={filter === "all" ? "on" : ""}
              onClick={() => setFilter("all")}
            >
              הכול ({counts.all})
            </button>
          </div>
          {counts.done > 0 && (
            <button className="tm-link" onClick={clearDone}>
              נקה שבוצעו
            </button>
          )}
        </div>

        {/* רשימה */}
        <ul className="tm-list">
          {visible.length === 0 && (
            <li className="tm-empty">
              {filter === "done"
                ? "עדיין לא סימנת משימות כבוצעו."
                : "אין משימות. תוסיף אחת למעלה כדי להתחיל."}
            </li>
          )}
          {visible.map((t) => {
            const overdue = !t.done && t.due && t.due < today
            return (
              <li key={t.id} className={"tm-item" + (t.done ? " done" : "")}>
                <button
                  className={"tm-check" + (t.done ? " on" : "")}
                  onClick={() => toggle(t.id)}
                  aria-label={t.done ? "בטל סימון" : "סמן כבוצע"}
                >
                  {t.done ? "✓" : ""}
                </button>
                <div className="tm-item-body">
                  <span className="tm-item-title">{t.title}</span>
                  <div className="tm-item-meta">
                    <button
                      className={"tm-prio p-" + t.priority}
                      onClick={() => cyclePriority(t.id)}
                      title="לחיצה לשינוי עדיפות"
                    >
                      {PRIORITY_LABEL[t.priority]}
                    </button>
                    {t.due && (
                      <span className={"tm-due" + (overdue ? " over" : "")}>
                        {overdue ? "באיחור · " : ""}
                        {t.due}
                      </span>
                    )}
                    {t.source && <span className="tm-src">{t.source}</span>}
                  </div>
                </div>
                <button
                  className="tm-del"
                  onClick={() => remove(t.id)}
                  aria-label="מחיקה"
                >
                  ×
                </button>
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  )
}

// ---------------------------------------------------------------------------
// עיצוב — מבודד לחלוטין מאפליקציית האימון הקיימת
// ---------------------------------------------------------------------------

const STYLES = `
.tm-root{
  --bg:#0e1116; --panel:#161b22; --panel-2:#1c232d; --line:#2a323d;
  --text:#e6edf3; --muted:#8b98a8; --accent:#4f9dff; --accent-2:#2563eb;
  --high:#ff5c5c; --med:#f2b53a; --low:#5ec98a;
  min-height:100vh; background:var(--bg); color:var(--text);
  font-family:'Heebo',system-ui,-apple-system,Arial,sans-serif;
}
.tm-header{ position:sticky; top:0; z-index:5; background:rgba(14,17,22,.9);
  backdrop-filter:blur(8px); border-bottom:1px solid var(--line); }
.tm-header-inner{ max-width:720px; margin:0 auto; padding:16px 18px;
  display:flex; align-items:center; justify-content:space-between; gap:12px; }
.tm-brand{ display:flex; align-items:center; gap:12px; }
.tm-logo{ color:var(--accent); font-size:22px; }
.tm-brand h1{ margin:0; font-size:20px; font-weight:800; }
.tm-brand p{ margin:2px 0 0; font-size:12px; color:var(--muted); }
.tm-stat{ text-align:center; background:var(--panel); border:1px solid var(--line);
  border-radius:12px; padding:6px 14px; }
.tm-stat strong{ display:block; font-size:22px; color:var(--accent); }
.tm-stat span{ font-size:11px; color:var(--muted); }

.tm-main{ max-width:720px; margin:0 auto; padding:18px; }

.tm-add{ background:var(--panel); border:1px solid var(--line); border-radius:16px;
  padding:14px; margin-bottom:16px; }
.tm-input{ width:100%; box-sizing:border-box; background:var(--panel-2);
  border:1px solid var(--line); border-radius:10px; padding:12px 14px;
  color:var(--text); font-size:16px; outline:none; }
.tm-input:focus{ border-color:var(--accent); }
.tm-add-row{ display:flex; gap:8px; margin-top:10px; flex-wrap:wrap; }
.tm-select,.tm-date{ background:var(--panel-2); border:1px solid var(--line);
  border-radius:10px; padding:10px 12px; color:var(--text); font-size:14px;
  font-family:inherit; }
.tm-select{ flex:0 0 auto; }
.tm-date{ flex:1 1 auto; min-width:120px; color-scheme:dark; }
.tm-btn{ cursor:pointer; border:none; border-radius:10px; padding:10px 18px;
  font-size:15px; font-weight:700; font-family:inherit; }
.tm-btn-primary{ background:var(--accent-2); color:#fff; margin-inline-start:auto; }
.tm-btn-primary:hover{ background:var(--accent); }

.tm-filters{ display:flex; align-items:center; justify-content:space-between;
  gap:10px; margin-bottom:12px; flex-wrap:wrap; }
.tm-tabs{ display:flex; gap:6px; background:var(--panel); border:1px solid var(--line);
  border-radius:12px; padding:4px; }
.tm-tabs button{ cursor:pointer; border:none; background:transparent; color:var(--muted);
  padding:8px 14px; border-radius:9px; font-size:13px; font-weight:600; font-family:inherit; }
.tm-tabs button.on{ background:var(--panel-2); color:var(--text); }
.tm-link{ cursor:pointer; background:none; border:none; color:var(--muted);
  font-size:13px; text-decoration:underline; font-family:inherit; }
.tm-link:hover{ color:var(--high); }

.tm-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:8px; }
.tm-empty{ text-align:center; color:var(--muted); padding:40px 20px;
  border:1px dashed var(--line); border-radius:14px; }
.tm-item{ display:flex; align-items:flex-start; gap:12px; background:var(--panel);
  border:1px solid var(--line); border-radius:14px; padding:12px 14px; }
.tm-item.done{ opacity:.55; }
.tm-check{ flex:0 0 auto; width:26px; height:26px; border-radius:8px; margin-top:2px;
  border:2px solid var(--line); background:transparent; color:#fff; cursor:pointer;
  font-size:15px; line-height:1; display:flex; align-items:center; justify-content:center; }
.tm-check.on{ background:var(--low); border-color:var(--low); }
.tm-item-body{ flex:1 1 auto; min-width:0; }
.tm-item-title{ display:block; font-size:16px; word-break:break-word; }
.tm-item.done .tm-item-title{ text-decoration:line-through; }
.tm-item-meta{ display:flex; align-items:center; gap:8px; margin-top:6px; flex-wrap:wrap; }
.tm-prio{ cursor:pointer; border:none; border-radius:999px; padding:3px 10px;
  font-size:11px; font-weight:700; font-family:inherit; color:#0e1116; }
.tm-prio.p-high{ background:var(--high); }
.tm-prio.p-med{ background:var(--med); }
.tm-prio.p-low{ background:var(--low); }
.tm-due{ font-size:12px; color:var(--muted); }
.tm-due.over{ color:var(--high); font-weight:700; }
.tm-src{ font-size:11px; color:var(--muted); background:var(--panel-2);
  border-radius:6px; padding:2px 8px; }
.tm-del{ flex:0 0 auto; cursor:pointer; background:none; border:none;
  color:var(--muted); font-size:22px; line-height:1; padding:0 4px; }
.tm-del:hover{ color:var(--high); }

@media (max-width:480px){
  .tm-btn-primary{ width:100%; margin-top:4px; }
}
`
