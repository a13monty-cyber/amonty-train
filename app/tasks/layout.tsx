import type { Metadata, Viewport } from "next"
import ServiceWorkerRegister from "../../components/ServiceWorkerRegister"

export const metadata: Metadata = {
  title: "המשימות שלי · AMONTY",
  description: "מנהל משימות אישי — נשמר במכשיר, עובד גם ללא אינטרנט",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "המשימות שלי",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
}

export const viewport: Viewport = {
  themeColor: "#0e1116",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <ServiceWorkerRegister />
    </>
  )
}
