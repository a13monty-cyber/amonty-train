import type { Metadata } from "next"
import TaskManager from "../../components/TaskManager"

export const metadata: Metadata = {
  title: "המשימות שלי · AMONTY",
  description: "מנהל משימות אישי — נשמר במכשיר, עובד גם ללא אינטרנט",
}

export default function TasksPage() {
  return <TaskManager />
}
