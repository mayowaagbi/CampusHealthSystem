// src/pages/student/StudentHealthGoalsPage.jsx
import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
// import CurrentGoals from "../components/CurrentGoals";

import SetNewGoal from "../../components/s";
import CurrentGoals from "../../components/CurrentGoals";
// import WeeklyProgressGraph from "../../components/WeeklyProgressGraph";

// Sample data for the weekly progress graph
const goalData = [
  { day: "Mon", progress: 60 },
  { day: "Tue", progress: 70 },
  { day: "Wed", progress: 65 },
  { day: "Thu", progress: 80 },
  { day: "Fri", progress: 75 },
  { day: "Sat", progress: 90 },
  { day: "Sun", progress: 85 },
];

export default function StudentHealthGoalsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" to="/">
          <span className="sr-only">Campus Health Management System</span>
          <img
            alt="Logo"
            className="h-6 w-6"
            src="/placeholder.svg?height=24&width=24"
          />
          <span className="ml-2 text-lg font-semibold">CHMS</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline"
            to="/student/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="text-sm font-medium hover:underline"
            to="/student/appointments"
          >
            Appointments
          </Link>
          <Link
            className="text-sm font-medium hover:underline"
            to="/student/health-records"
          >
            Health Records
          </Link>
          <Link
            className="text-sm font-medium hover:underline"
            to="/student/notifications"
          >
            Notifications
          </Link>
          <Link
            className="text-sm font-medium hover:underline"
            to="/student/profile"
          >
            Profile
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-6 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <SetNewGoal />
          <CurrentGoals />
          <WeeklyProgressGraph data={goalData} />
        </motion.div>
        <Outlet />
      </main>
    </div>
  );
}
