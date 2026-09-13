"use client"

import { useEffect } from "react"

// רושם את ה-service worker כדי לאפשר עבודה ללא אינטרנט והתקנה כאפליקציה.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator)) return
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // רישום נכשל (למשל ב-http לא מאובטח) — האפליקציה עדיין עובדת, פשוט בלי אופליין
      })
    }
    if (document.readyState === "complete") register()
    else window.addEventListener("load", register, { once: true })
  }, [])

  return null
}
