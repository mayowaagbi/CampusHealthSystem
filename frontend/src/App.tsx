import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingPage from "./pages/LandingPage";
import EducationPage from "./pages/EducationPage";
import FacilitiesPage from "./pages/FacilitiesPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import TSPage from "./pages/TSpage";
import NotFound from "./pages/NotFound";
import { GlobalStateProvider } from "./context/GlobalState";
import StudentDashboardPage from "./pages/StudentPages/StudentDashboardPage";
import AdminDashboardPage from "./pages/AdminPages/AdminDashboard";
import StudentProfilePage from "./pages/StudentPages/StudentProfilePage";
import StudentAppointmentPage from "./pages/StudentPages/StudentAppointmentsPage";
import StudentHealthGoalsPage from "./pages/StudentPages/HealthGoalsPage";
import StudentHealthRecordsPage from "./pages/StudentPages/HealthRecordsPage";
import StudentNotificationsPage from "./pages/StudentPages/NotificationsPage";
import SettingsPage from "./pages/AdminPages/SettingsPage";
import AdminHealthRecordsPage from "./pages/AdminPages/AdminHealthRecordsPage";
import AdminStudentsPage from "./pages/AdminPages/AdminStudentsPage";
import AdminHealthAlertsPage from "./pages/AdminPages/AdminHealthAlertsPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStateProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/Terms&Services" element={<TSPage />} />
            <Route path="*" element={<NotFound />} />

            {/* Student Pages */}
            <Route
              path="/student/dashboard"
              element={<StudentDashboardPage />}
            />
            <Route path="/student/profile" element={<StudentProfilePage />} />
            <Route
              path="/student/appointments"
              element={<StudentAppointmentPage />}
            />
            <Route
              path="/student/health-goals"
              element={<StudentHealthGoalsPage />}
            />
            <Route
              path="/student/health-records"
              element={<StudentHealthRecordsPage />}
            />
            <Route
              path="/student/notifications"
              element={<StudentNotificationsPage />}
            />

            {/* Admin Pages */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
            <Route
              path="/admin/health-records"
              element={<AdminHealthRecordsPage />}
            />
            <Route path="/admin/students" element={<AdminStudentsPage />} />
            <Route
              path="/admin/health-alerts"
              element={<AdminHealthAlertsPage />}
            />
          </Routes>
        </BrowserRouter>
      </GlobalStateProvider>
    </QueryClientProvider>
  );
}
