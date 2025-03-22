import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/button";
import { disconnectSocket } from "../../../hooks/sockets";
import { Heart } from "lucide-react";
function StudentNavBar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    disconnectSocket(); // Disconnect the socket
    toast.success("Logged out successfully!"); // Display success toast
    navigate("/login"); // Redirect to the login page
  };
  return (
    <>
      <Link className="flex items-center justify-center" to="student/dashboard">
        <span className="sr-only">Campus Health Management System</span>
        <Heart className="h-6 w-6 text-primary" />
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
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </nav>
    </>
  );
}

export default StudentNavBar;
