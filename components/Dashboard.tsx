"use client"

import { useEffect, useState, useCallback } from "react"
import { getSupabase, isSupabaseConfigured } from "../lib/supabase"
import PlanBuilder, { Plan, SAMPLE } from "./PlanBuilder"
import { MONTY_LOGO } from "./montyLogo"

/* =====================================================================
   MONTY · דשבורד מאמן
   התחברות (Supabase Auth) → פולדר לכל מתאמן → תוכניות בתוך הפולדר →
   עריכה/יצירה במחולל (PlanBuilder) עם שמירה לענן.
   ===================================================================== */

interface Trainee { id: string; name: string; sport: string; age: string; notes: string; created_at: string }
interface PlanRow { id: string; trainee_id: string; title: string; data: Plan; created_at: string; updated_at: string }

type View =
  | { v: "list" }
  | { v: "trainee"; trainee: Trainee }
  | { v: "editor"; trainee: Trainee; row: PlanRow | null }

export default function Dashboard() {
  if (!isSupabaseConfigured) return <SetupNotice />
  return <DashboardInner />
}

/* ---------- shown until Supabase env vars are set ---------- */
function SetupNotice() {
  return (
    <div className="db-wrap db-center">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="db-card db-setup">
        <img src={MONTY_LOGO} alt="MONTY" className="db-logo-lg" />
        <h2>חיבור לענן — שלב חד־פעמי</h2>
        <p>הדשבורד עובד מול Supabase (התחברות + אחסון בענן). כדי להפעיל אותו:</p>
        <ol>
          <li>נכנסים ל־<b>supabase.com</b> → יוצרים חשבון ופרויקט חדש (חינם).</li>
          <li>ב־<b>Project Settings → API</b> מעתיקים את <b>Project URL</b> ואת מפתח <b>anon public</b>.</li>
          <li>מדביקים אותם בקובץ <code>.env.local</code> (ראו <code>.env.local.example</code>).</li>
          <li>ב־<b>SQL Editor</b> מריצים את התוכן של <code>supabase/schema.sql</code>.</li>
          <li>מריצים מחדש <code>npm run dev</code> — ומרעננים את העמוד.</li>
        </ol>
        <p className="db-muted">עד אז אפשר להשתמש במחולל הבודד בכתובת <code>/plan</code>.</p>
      </div>
    </div>
  )
}

function DashboardInner() {
  const sb = getSupabase()
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [view, setView] = useState<View>({ v: "list" })

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id ?? null)
      setEmail(data.session?.user?.email ?? null)
      setReady(true)
    })
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null)
      setEmail(session?.user?.email ?? null)
      if (!session) setView({ v: "list" })
    })
    return () => sub.subscription.unsubscribe()
  }, [sb])

  if (!ready) return <div className="db-wrap db-center"><style dangerouslySetInnerHTML={{ __html: CSS }} /><div className="db-muted">טוען…</div></div>
  if (!userId) return <AuthScreen />

  if (view.v === "editor") {
    return (
      <PlanEditor
        trainee={view.trainee}
        row={view.row}
        userId={userId}
        onBack={() => setView({ v: "trainee", trainee: view.trainee })}
      />
    )
  }

  return (
    <div className="db-wrap">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="db-topbar">
        <div className="db-brand">
          <img src={MONTY_LOGO} alt="MONTY" />
          <div><b>MONTY · דשבורד מאמן</b><span>Performance &amp; Recovery</span></div>
        </div>
        <div className="db-user">
          <span>{email}</span>
          <button onClick={() => sb.auth.signOut()}>יציאה</button>
        </div>
      </div>

      {view.v === "list"
        ? <TraineeList onOpen={t => setView({ v: "trainee", trainee: t })} userId={userId} />
        : <TraineeDetail
            trainee={view.trainee}
            onBack={() => setView({ v: "list" })}
            onOpenPlan={row => setView({ v: "editor", trainee: view.trainee, row })}
          />}
    </div>
  )
}

/* ---------- login / signup ---------- */
function AuthScreen() {
  const sb = getSupabase()
  const [mode, setMode] = useState<"in" | "up">("in")
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState("")
  const [err, setErr] = useState("")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setErr(""); setMsg("")
    try {
      if (mode === "in") {
        const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password: pw })
        if (error) throw error
      } else {
        const { data, error } = await sb.auth.signUp({ email: email.trim(), password: pw })
        if (error) throw error
        if (!data.session) setMsg("נשלח אימייל אימות — אשרו אותו ואז התחברו.")
      }
    } catch (e: any) {
      setErr(translateAuthError(e?.message || String(e)))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="db-wrap db-center">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <form className="db-card db-auth" onSubmit={submit}>
        <img src={MONTY_LOGO} alt="MONTY" className="db-logo-lg" />
        <h2>{mode === "in" ? "כניסת מאמן" : "הרשמת מאמן"}</h2>
        <label>אימייל</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
        <label>סיסמה</label>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} required minLength={6} autoComplete={mode === "in" ? "current-password" : "new-password"} />
        {err && <div className="db-err">{err}</div>}
        {msg && <div className="db-ok">{msg}</div>}
        <button className="db-primary" disabled={busy}>{busy ? "…" : mode === "in" ? "התחברות" : "הרשמה"}</button>
        <button type="button" className="db-link" onClick={() => { setMode(mode === "in" ? "up" : "in"); setErr(""); setMsg("") }}>
          {mode === "in" ? "אין לך חשבון? הרשמה" : "כבר יש חשבון? התחברות"}
        </button>
      </form>
    </div>
  )
}

/* ---------- trainees (folders) ---------- */
function TraineeList({ onOpen, userId }: { onOpen: (t: Trainee) => void; userId: string }) {
  const sb = getSupabase()
  const [items, setItems] = useState<Trainee[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState("")
  const [name, setName] = useState("")
  const [sport, setSport] = useState("")
  const [age, setAge] = useState("")
  const [adding, setAdding] = useState(false)

  const load = useCallback(async () => {
    setLoading(true); setErr("")
    const { data, error } = await sb.from("trainees").select("*").order("created_at", { ascending: true })
    if (error) setErr(error.message); else setItems((data as Trainee[]) || [])
    setLoading(false)
  }, [sb])

  useEffect(() => { load() }, [load])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setAdding(true); setErr("")
    const { error } = await sb.from("trainees").insert({ coach_id: userId, name: name.trim(), sport: sport.trim(), age: age.trim() })
    if (error) setErr(error.message)
    else { setName(""); setSport(""); setAge(""); await load() }
    setAdding(false)
  }

  async function remove(t: Trainee) {
    if (!confirm(`למחוק את "${t.name}" וכל התוכניות שלו?`)) return
    const { error } = await sb.from("trainees").delete().eq("id", t.id)
    if (error) setErr(error.message); else load()
  }

  return (
    <div className="db-main">
      <form className="db-addbar" onSubmit={add}>
        <input placeholder="שם המתאמן *" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="ענף" value={sport} onChange={e => setSport(e.target.value)} />
        <input placeholder="גיל" value={age} onChange={e => setAge(e.target.value)} style={{ maxWidth: 90 }} />
        <button className="db-primary" disabled={adding}>+ מתאמן חדש</button>
      </form>
      {err && <div className="db-err">{err}</div>}
      {loading ? <div className="db-muted">טוען…</div>
        : items.length === 0 ? <div className="db-empty">עדיין אין מתאמנים. הוסיפו את הראשון למעלה 👆</div>
        : <div className="db-grid">
            {items.map(t => (
              <div className="db-folder" key={t.id} onClick={() => onOpen(t)}>
                <div className="db-folder-icon">📁</div>
                <div className="db-folder-name">{t.name}</div>
                <div className="db-folder-meta">{[t.sport, t.age && `גיל ${t.age}`].filter(Boolean).join(" · ") || "—"}</div>
                <button className="db-del" onClick={e => { e.stopPropagation(); remove(t) }} title="מחק">🗑</button>
              </div>
            ))}
          </div>}
    </div>
  )
}

/* ---------- plans inside a trainee folder ---------- */
function TraineeDetail({ trainee, onBack, onOpenPlan }: { trainee: Trainee; onBack: () => void; onOpenPlan: (row: PlanRow | null) => void }) {
  const sb = getSupabase()
  const [rows, setRows] = useState<PlanRow[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState("")

  const load = useCallback(async () => {
    setLoading(true); setErr("")
    const { data, error } = await sb.from("plans").select("*").eq("trainee_id", trainee.id).order("updated_at", { ascending: false })
    if (error) setErr(error.message); else setRows((data as PlanRow[]) || [])
    setLoading(false)
  }, [sb, trainee.id])

  useEffect(() => { load() }, [load])

  async function remove(r: PlanRow) {
    if (!confirm("למחוק את התוכנית?")) return
    const { error } = await sb.from("plans").delete().eq("id", r.id)
    if (error) setErr(error.message); else load()
  }

  return (
    <div className="db-main">
      <div className="db-crumb">
        <button className="db-back" onClick={onBack}>→ כל המתאמנים</button>
        <h2>📁 {trainee.name} <span className="db-muted">{[trainee.sport, trainee.age && `גיל ${trainee.age}`].filter(Boolean).join(" · ")}</span></h2>
        <button className="db-primary" onClick={() => onOpenPlan(null)}>+ תוכנית חדשה</button>
      </div>
      {err && <div className="db-err">{err}</div>}
      {loading ? <div className="db-muted">טוען…</div>
        : rows.length === 0 ? <div className="db-empty">אין עדיין תוכניות למתאמן זה. צרו תוכנית חדשה 👆</div>
        : <div className="db-plans">
            {rows.map(r => (
              <div className="db-plan" key={r.id} onClick={() => onOpenPlan(r)}>
                <div className="db-plan-title">{r.title || "תוכנית ללא שם"}</div>
                <div className="db-plan-date">{new Date(r.updated_at).toLocaleDateString("he-IL")}</div>
                <button className="db-del" onClick={e => { e.stopPropagation(); remove(r) }} title="מחק">🗑</button>
              </div>
            ))}
          </div>}
    </div>
  )
}

/* ---------- editor wrapper: loads the generator, saves to the cloud ---------- */
function PlanEditor({ trainee, row, userId, onBack }: { trainee: Trainee; row: PlanRow | null; userId: string; onBack: () => void }) {
  const sb = getSupabase()
  const [planId, setPlanId] = useState<string | null>(row?.id ?? null)

  const initial: Plan = row?.data
    ? row.data
    : { ...JSON.parse(JSON.stringify(SAMPLE)), athlete: { name: trainee.name, age: trainee.age, sport: trainee.sport } }

  async function onSave(plan: Plan) {
    const title = plan.athlete?.name ? `${plan.athlete.name} — ${plan.title}` : plan.title
    if (planId) {
      const { error } = await sb.from("plans").update({ title, data: plan, updated_at: new Date().toISOString() }).eq("id", planId)
      if (error) throw new Error(error.message)
    } else {
      const { data, error } = await sb.from("plans")
        .insert({ coach_id: userId, trainee_id: trainee.id, title, data: plan })
        .select("id").single()
      if (error) throw new Error(error.message)
      setPlanId((data as { id: string }).id)
    }
  }

  return (
    <PlanBuilder
      key={row?.id ?? "new"}
      initialPlan={initial}
      onSave={onSave}
      onBack={onBack}
      contextLabel={`📁 ${trainee.name}`}
    />
  )
}

function translateAuthError(m: string): string {
  if (/invalid login credentials/i.test(m)) return "אימייל או סיסמה שגויים."
  if (/user already registered/i.test(m)) return "המשתמש כבר רשום — נסו להתחבר."
  if (/password should be at least/i.test(m)) return "הסיסמה צריכה להיות באורך 6 תווים לפחות."
  if (/email not confirmed/i.test(m)) return "יש לאשר את אימייל האימות לפני הכניסה."
  return m
}

const CSS = `
.db-wrap{--navy:#1D3A89;--gold:#F49E0A;--cream:#F9F6F2;--ink:#33414F;--muted:#647486;--line:#E7E0D3;--red:#DB2626;
  min-height:100vh;background:#eef0f3;font-family:'Heebo',sans-serif;color:var(--ink)}
.db-center{display:flex;align-items:center;justify-content:center;padding:24px}
.db-topbar{position:sticky;top:0;z-index:20;display:flex;justify-content:space-between;align-items:center;gap:12px;background:var(--navy);color:#fff;padding:10px 18px;flex-wrap:wrap}
.db-brand{display:flex;align-items:center;gap:10px}
.db-brand img{width:38px;height:38px;object-fit:contain;background:#fff;border-radius:8px;padding:3px}
.db-brand b{display:block;font-size:15px;font-weight:800}
.db-brand span{display:block;font-size:11px;letter-spacing:.6px;opacity:.85}
.db-user{display:flex;align-items:center;gap:10px;font-size:13px}
.db-user button{background:rgba(255,255,255,.16);color:#fff;border:none;border-radius:8px;padding:7px 12px;cursor:pointer;font-family:inherit;font-size:13px}
.db-main{max-width:980px;margin:0 auto;padding:20px 18px}
.db-muted{color:var(--muted)}
.db-empty{background:#fff;border:1px dashed var(--line);border-radius:14px;padding:34px;text-align:center;color:var(--muted);margin-top:16px}
.db-err{background:#fdecec;color:#b02020;padding:9px 12px;border-radius:8px;font-size:13px;margin:10px 0}
.db-ok{background:#eaf7ee;color:#1f7a3d;padding:9px 12px;border-radius:8px;font-size:13px;margin:10px 0}

.db-addbar{display:flex;gap:8px;flex-wrap:wrap;background:#fff;border:1px solid #e6e8ee;border-radius:14px;padding:12px}
.db-addbar input{flex:1;min-width:120px;font-family:inherit;font-size:14px;padding:9px 11px;border:1.5px solid #e2e4ea;border-radius:9px;background:#fafbfc}
.db-primary{background:var(--gold);color:#fff;border:none;border-radius:9px;padding:9px 16px;font-family:inherit;font-weight:700;font-size:14px;cursor:pointer;white-space:nowrap}
.db-primary:disabled{opacity:.6}

.db-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;margin-top:16px}
.db-folder{position:relative;background:#fff;border:1px solid #e6e8ee;border-top:3px solid var(--gold);border-radius:14px;padding:18px;cursor:pointer;transition:.15s;text-align:center}
.db-folder:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.08)}
.db-folder-icon{font-size:34px}
.db-folder-name{font-weight:800;color:var(--navy);font-size:16px;margin-top:6px}
.db-folder-meta{color:var(--muted);font-size:12.5px;margin-top:2px}
.db-del{position:absolute;top:8px;left:8px;background:none;border:none;cursor:pointer;font-size:15px;opacity:.5}
.db-del:hover{opacity:1}

.db-crumb{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.db-crumb h2{flex:1;color:var(--navy);font-size:20px}
.db-crumb h2 .db-muted{font-size:14px;font-weight:400}
.db-back,.db-link{background:none;border:none;color:var(--navy);cursor:pointer;font-family:inherit;font-size:14px;font-weight:600}
.db-plans{display:flex;flex-direction:column;gap:10px;margin-top:16px}
.db-plan{position:relative;background:#fff;border:1px solid #e6e8ee;border-radius:12px;padding:14px 44px 14px 16px;cursor:pointer;transition:.15s;display:flex;justify-content:space-between;align-items:center}
.db-plan:hover{box-shadow:0 4px 14px rgba(0,0,0,.07)}
.db-plan-title{font-weight:700;color:var(--navy)}
.db-plan-date{color:var(--muted);font-size:12.5px}

.db-card{background:#fff;border-radius:18px;box-shadow:0 12px 40px rgba(0,0,0,.12);padding:28px;width:100%}
.db-logo-lg{width:88px;height:88px;object-fit:contain;display:block;margin:0 auto 8px}
.db-auth{max-width:380px;display:flex;flex-direction:column;gap:8px;text-align:center}
.db-auth h2{color:var(--navy);margin-bottom:6px}
.db-auth label{text-align:right;font-size:13px;color:var(--muted);font-weight:600;margin-top:6px}
.db-auth input{font-family:inherit;font-size:15px;padding:11px 12px;border:1.5px solid #e2e4ea;border-radius:10px;background:#fafbfc}
.db-auth .db-primary{margin-top:12px;padding:12px}
.db-setup{max-width:520px}
.db-setup h2{color:var(--navy);text-align:center;margin-bottom:10px}
.db-setup ol{margin:12px 20px;line-height:2}
.db-setup code{background:#eef0f5;padding:2px 6px;border-radius:5px;font-size:13px}
.db-setup p{line-height:1.7}
`
