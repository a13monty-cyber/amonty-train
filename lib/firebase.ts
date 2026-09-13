// ---------------------------------------------------------------------------
// אתחול Firebase (רק בדפדפן, ורק אם יש הגדרות).
//
// אם משתני הסביבה של Firebase לא מוגדרים — האפליקציה ממשיכה לעבוד במצב מקומי
// בלבד (localStorage), בדיוק כמו קודם. הסנכרון נדלק אוטומטית ברגע שמזינים config.
// ---------------------------------------------------------------------------

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore"

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// האם יש מספיק הגדרות כדי להפעיל סנכרון?
export const firebaseEnabled = Boolean(
  config.apiKey && config.projectId && config.appId
)

type FB = { app: FirebaseApp; auth: Auth; db: Firestore }

let cached: FB | null = null

export function getFirebase(): FB | null {
  if (!firebaseEnabled) return null
  if (typeof window === "undefined") return null
  if (cached) return cached

  const app = getApps().length ? getApp() : initializeApp(config)
  const auth = getAuth(app)
  // Firestore עם מטמון מקומי מתמשך -> עובד גם אופליין כשמחוברים
  const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  })
  cached = { app, auth, db }
  return cached
}

export const googleProvider = new GoogleAuthProvider()
