import { Link } from "react-router-dom";

function StudentNavBar() {
  return (
    <>
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
          className="text-sm font-medium hover:underline underline-offset-4"
          to="/student/appointments"
        >
          Appointments
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          to="/student/health-records"
        >
          Health Records
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          to="/student/health-goals"
        >
          Health Goals
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          to="/student/notifications"
        >
          Notifications
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          to="/student/profile"
        >
          Profile
        </Link>
      </nav>
    </>
  );
}

export default StudentNavBar;
