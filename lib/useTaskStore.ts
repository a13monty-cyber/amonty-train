"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from "firebase/auth"
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore"
import { firebaseEnabled, getFirebase, googleProvider } from "./firebase"

// ---------------------------------------------------------------------------
// טיפוס המשימה (מקור אמת יחיד, משותף לכל האפליקציה)
// ---------------------------------------------------------------------------

export type Priority = "low" | "med" | "high"

export type Task = {
  id: string
  title: string
  done: boolean
  priority: Priority
  due: string | null
  source: string | null
  createdAt: number
}

const STORAGE_KEY = "amonty.tasks.v1"

// --- אחסון מקומי ---------------------------------------------------------

function loadLocal(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Task[]) : []
  } catch {
    return []
  }
}

function saveLocal(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // אחסון חסום — לא מפילים
  }
}

// ---------------------------------------------------------------------------
// ה-hook: מציג ממשק אחיד, ומחליף מתחת לפני השטח בין מקומי לענן
// ---------------------------------------------------------------------------

export type TaskStore = {
  tasks: Task[]
  user: User | null
  authReady: boolean
  syncEnabled: boolean // האם Firebase מוגדר בכלל
  cloud: boolean // האם כרגע מסונכרן לענן (מחובר)
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  addTask: (t: Task) => void
  toggle: (id: string, done: boolean) => void
  remove: (id: string) => void
  setPriority: (id: string, priority: Priority) => void
  clearDone: (doneIds: string[]) => void
  importTasks: (tasks: Task[]) => void
}

export function useTaskStore(): TaskStore {
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(!firebaseEnabled)
  const [tasks, setTasks] = useState<Task[]>([])
  const [localLoaded, setLocalLoaded] = useState(false)
  const migratedRef = useRef(false)

  const cloud = firebaseEnabled && !!user

  // מעקב אחרי מצב ההתחברות
  useEffect(() => {
    const fb = getFirebase()
    if (!fb) {
      setAuthReady(true)
      return
    }
    return onAuthStateChanged(fb.auth, (u) => {
      setUser(u)
      setAuthReady(true)
      migratedRef.current = false
    })
  }, [])

  // מצב מקומי: טעינה
  useEffect(() => {
    if (cloud) return
    setTasks(loadLocal())
    setLocalLoaded(true)
  }, [cloud])

  // מצב מקומי: שמירה בכל שינוי
  useEffect(() => {
    if (cloud || !localLoaded) return
    saveLocal(tasks)
  }, [tasks, cloud, localLoaded])

  // מצב ענן: מנוי בזמן אמת + הגירה חד-פעמית של משימות מקומיות
  useEffect(() => {
    if (!cloud) return
    const fb = getFirebase()
    if (!fb || !user) return
    const col = collection(fb.db, "users", user.uid, "tasks")
    return onSnapshot(col, (snap) => {
      const arr = snap.docs.map((d) => d.data() as Task)
      setTasks(arr)
      // הגירה: אם הענן ריק (מאושר מהשרת, לא ממטמון) ויש משימות מקומיות — נעלה אותן
      if (
        !migratedRef.current &&
        !snap.metadata.fromCache &&
        arr.length === 0
      ) {
        migratedRef.current = true
        const local = loadLocal()
        if (local.length > 0) {
          const batch = writeBatch(fb.db)
          for (const t of local) batch.set(doc(col, t.id), t)
          batch.commit().catch(() => {})
        }
      }
    })
  }, [cloud, user])

  const colRef = useCallback(() => {
    const fb = getFirebase()
    if (!fb || !user) return null
    return collection(fb.db, "users", user.uid, "tasks")
  }, [user])

  const signIn = useCallback(async () => {
    const fb = getFirebase()
    if (!fb) return
    try {
      await signInWithPopup(fb.auth, googleProvider)
    } catch {
      // המשתמש ביטל / חלון נחסם — נשארים במצב הנוכחי
    }
  }, [])

  const signOut = useCallback(async () => {
    const fb = getFirebase()
    if (!fb) return
    await fbSignOut(fb.auth)
  }, [])

  const addTask = useCallback(
    (t: Task) => {
      if (cloud) {
        const col = colRef()
        if (col) setDoc(doc(col, t.id), t).catch(() => {})
      } else {
        setTasks((prev) => [t, ...prev])
      }
    },
    [cloud, colRef]
  )

  const toggle = useCallback(
    (id: string, done: boolean) => {
      if (cloud) {
        const col = colRef()
        if (col) updateDoc(doc(col, id), { done }).catch(() => {})
      } else {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done } : t)))
      }
    },
    [cloud, colRef]
  )

  const remove = useCallback(
    (id: string) => {
      if (cloud) {
        const col = colRef()
        if (col) deleteDoc(doc(col, id)).catch(() => {})
      } else {
        setTasks((prev) => prev.filter((t) => t.id !== id))
      }
    },
    [cloud, colRef]
  )

  const setPriority = useCallback(
    (id: string, priority: Priority) => {
      if (cloud) {
        const col = colRef()
        if (col) updateDoc(doc(col, id), { priority }).catch(() => {})
      } else {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, priority } : t))
        )
      }
    },
    [cloud, colRef]
  )

  const clearDone = useCallback(
    (doneIds: string[]) => {
      if (cloud) {
        const fb = getFirebase()
        const col = colRef()
        if (fb && col && doneIds.length) {
          const batch = writeBatch(fb.db)
          for (const id of doneIds) batch.delete(doc(col, id))
          batch.commit().catch(() => {})
        }
      } else {
        setTasks((prev) => prev.filter((t) => !t.done))
      }
    },
    [cloud, colRef]
  )

  const importTasks = useCallback(
    (list: Task[]) => {
      if (list.length === 0) return
      if (cloud) {
        const fb = getFirebase()
        const col = colRef()
        if (fb && col) {
          const batch = writeBatch(fb.db)
          for (const t of list) batch.set(doc(col, t.id), t)
          batch.commit().catch(() => {})
        }
      } else {
        setTasks((prev) => [...list, ...prev])
      }
    },
    [cloud, colRef]
  )

  return {
    tasks,
    user,
    authReady,
    syncEnabled: firebaseEnabled,
    cloud,
    signIn,
    signOut,
    addTask,
    toggle,
    remove,
    setPriority,
    clearDone,
    importTasks,
  }
}
