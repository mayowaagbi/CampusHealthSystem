import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingPage from "./pages/LandingPage";
import EducationPage from "./pages/EducationPage";
import FacilitiesPage from "./pages/FacilitiesPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
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
import HealthcareProviderDashboard from "./pages/HealthCareProvider/HealthcareProviderDashboard";
import AppointmentManagementPage from "./pages/HealthCareProvider/HealthcareAppointmentManagementPage";
import PatientManagementPage from "./pages/HealthCareProvider/HealthcarePatientManagementPage";
import AlertsPage from "./pages/HealthCareProvider/HealthcareAlertsPage";
import HealthRecordsPage from "./pages/HealthCareProvider/HealthcareHealthRecordsPage";
import PrescriptionsPage from "./pages/HealthCareProvider/HealthcarePrescriptionsPage";
import { AmbulanceRequestProvider } from "./context/AmbulanceRequestContext";
import { useState, useEffect } from "react"; // Add this import
// import { io } from "socket.io-client"; // Add this import
import Toast from "./components/toast/Toast";
import { getSocket, connectSocket } from "./hooks/sockets";
const queryClient = new QueryClient();

export default function App() {
  const userRole = localStorage.getItem("Role");
  const [notifications, setNotifications] = useState<any[]>([]);
  // useEffect(() => {
  //   // Add a test notification after 2 seconds
  //   const testTimer = setTimeout(() => {
  //     const testNotification = {
  //       _id: "test-" + Date.now(),
  //       type: "success" as const,
  //       title: "Test Notification",
  //       message: "This is a test notification to verify toast rendering",
  //       data: { timestamp: Date.now() },
  //     };

  //     setNotifications((prev) => [testNotification, ...prev]);
  //     console.log("Added test notification:", testNotification);
  //   }, 2000);

  //   return () => clearTimeout(testTimer);
  // }, []);
  // console.log(import.meta.env.VITE_API_URL);
  useEffect(() => {
    // Connect using your utility
    connectSocket();

    // Get the socket instance
    const socket = getSocket();

    // Set up the notification listener for real-time notifications
    socket.on("notification", (newNotification) => {
      // Map the notification type to one of the allowed types
      let mappedType:
        | "success"
        | "error"
        | "warning"
        | "ambulance-request"
        | "info";

      // Map the backend type to the Toast component type
      switch (newNotification.type) {
        case "alert":
          mappedType = "warning";
          break;
        case "ambulance-request":
          mappedType = "ambulance-request";
          break;
        case "error":
          mappedType = "error";
          break;
        case "success":
          mappedType = "success";
          break;
        default:
          mappedType = "info"; // Default to info for unknown types
      }

      // Transform the notification to match the expected format
      const transformedNotification = {
        _id: newNotification.id,
        type: mappedType,
        title: newNotification.title,
        message: newNotification.content,
        data: {
          timestamp: newNotification.createdAt
            ? new Date(newNotification.createdAt).getTime()
            : Date.now(),
        },
      };

      // Filter notifications based on user role
      if (
        (userRole === "PROVIDER" &&
          transformedNotification.type === "ambulance-request") ||
        (userRole === "STUDENT" &&
          transformedNotification.type !== "ambulance-request")
      ) {
        setNotifications((prev) => [transformedNotification, ...prev]);
      }
    });

    // Handle initial notifications from database
    // socket.on("initialNotifications", (storedNotifications) => {
    //   console.log("Received initial notifications:", storedNotifications);

    //   // Transform stored notifications
    //   interface StoredNotification {
    //     id: string;
    //     userId: string;
    //     type: string;
    //     title: string;
    //     content: string;
    //     createdAt?: string;
    //   }

    //   interface TransformedNotification {
    //     _id: string;
    //     type: "success" | "error" | "warning" | "ambulance-request" | "info";
    //     title: string;
    //     message: string;
    //     data: {
    //       timestamp: number;
    //     };
    //   }

    //   const transformedNotifications: TransformedNotification[] =
    //     storedNotifications.map((notification: StoredNotification) => {
    //       // Map the notification type to one of the allowed types
    //       let mappedType:
    //         | "success"
    //         | "error"
    //         | "warning"
    //         | "ambulance-request"
    //         | "info";

    //       // Map the backend type to the Toast component type
    //       switch (notification.type) {
    //         case "alert":
    //           mappedType =
    //             userRole === "PROVIDER" ? "ambulance-request" : "warning";
    //           break;
    //         case "ambulance-request":
    //           mappedType = "ambulance-request";
    //           break;
    //         case "error":
    //           mappedType = "error";
    //           break;
    //         case "success":
    //           mappedType = "success";
    //           break;
    //         default:
    //           mappedType = "info"; // Default to info for unknown types
    //       }

    //       return {
    //         _id: notification.id,
    //         type: mappedType,
    //         title: notification.title,
    //         message: notification.content,
    //         data: {
    //           timestamp: notification.createdAt
    //             ? new Date(notification.createdAt).getTime()
    //             : Date.now(),
    //         },
    //       };
    //     });
    //   console.log("Transformed Notifications:", transformedNotifications);
    //   // Filter based on user role
    //   const filteredNotifications = transformedNotifications.filter(
    //     (notification) =>
    //       (userRole === "PROVIDER" &&
    //         notification.type === "ambulance-request") ||
    //       notification.type === "warning" ||
    //       (userRole === "STUDENT" && notification.type !== "ambulance-request")
    //   );
    //   console.log("User Role:", userRole);
    //   console.log("Filtered Notifications:", filteredNotifications);
    //   setNotifications(filteredNotifications);
    // });
    socket.on("initialNotifications", (storedNotifications) => {
      console.log("Received initial notifications:", storedNotifications);

      // Transform stored notifications
      interface StoredNotification {
        id: string;
        userId: string;
        type: string; // "alert" or "ambulance-request"
        title: string;
        content: string;
        createdAt?: string;
      }

      interface TransformedNotification {
        _id: string;
        type: "alert" | "ambulance-request" | "success" | "error" | "info"; // Add "alert"
        title: string;
        message: string;
        data: {
          timestamp: number;
        };
      }

      const transformedNotifications: TransformedNotification[] =
        storedNotifications.map((notification: StoredNotification) => {
          // Map the notification type
          let mappedType:
            | "alert"
            | "ambulance-request"
            | "success"
            | "error"
            | "info";

          switch (notification.type) {
            case "alert":
              // For students, map to "alert"; for providers, map to "ambulance-request"
              mappedType =
                userRole === "PROVIDER" ? "ambulance-request" : "alert";
              break;
            case "ambulance-request":
              mappedType = "ambulance-request";
              break;
            case "error":
              mappedType = "error";
              break;
            case "success":
              mappedType = "success";
              break;
            default:
              mappedType = "info";
          }

          return {
            _id: notification.id,
            type: mappedType,
            title: notification.title,
            message: notification.content,
            data: {
              timestamp: notification.createdAt
                ? new Date(notification.createdAt).getTime()
                : Date.now(),
            },
          };
        });

      console.log("Transformed Notifications:", transformedNotifications);

      // Add the original filtering logic here
      transformedNotifications.forEach((notification) => {
        if (notification.type === "alert") {
          console.log("Alert:", notification.title, notification.message);
        } else if (notification.type === "ambulance-request") {
          console.log(
            "Ambulance Request:",
            notification.title,
            notification.message
          );
        }
      });

      // Filter based on user role
      const filteredNotifications = transformedNotifications.filter(
        (notification) =>
          (userRole === "PROVIDER" &&
            (notification.type === "ambulance-request" ||
              notification.type === "alert")) ||
          (userRole === "STUDENT" && notification.type === "alert")
      );

      console.log("User Role:", userRole);
      console.log("Filtered Notifications:", filteredNotifications);
      setNotifications(filteredNotifications);
    });
    // Refresh notifications every 30 seconds
    const refreshInterval = setInterval(() => {
      if (socket.connected) {
        console.log("Refreshing notifications");
        socket.emit("getInitialNotifications");
      }
    }, 30000);

    // Cleanup
    return () => {
      socket.off("notification");
      socket.off("initialNotifications");
      clearInterval(refreshInterval);
    };
  }, [userRole]);
  interface Notification {
    _id: string;
    message: string;
    // Add other properties as needed
  }

  const handleCloseToast = (id: string) => {
    setNotifications((prev: Notification[]) =>
      prev.filter((n) => n._id !== id)
    );
  };
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStateProvider>
        <BrowserRouter>
          <div className="toast-container">
            {notifications.map((notification) => (
              <Toast
                key={notification._id}
                notification={notification}
                onClose={handleCloseToast}
              />
            ))}
          </div>
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

            {/* Healthcare Pages */}
            <Route
              path="/healthcare-provider/*"
              element={
                <AmbulanceRequestProvider>
                  <Routes>
                    <Route
                      path="dashboard"
                      element={<HealthcareProviderDashboard />}
                    />
                    <Route
                      path="appointments"
                      element={<AppointmentManagementPage />}
                    />
                    <Route
                      path="patients"
                      element={<PatientManagementPage />}
                    />
                    <Route path="alerts" element={<AlertsPage />} />
                    <Route
                      path="health-records"
                      element={<HealthRecordsPage />}
                    />
                    <Route
                      path="prescriptions"
                      element={<PrescriptionsPage />}
                    />
                    <Route path="Signup" element={<SignupPage />} />
                  </Routes>
                </AmbulanceRequestProvider>
              }
            />
          </Routes>
        </BrowserRouter>
      </GlobalStateProvider>
    </QueryClientProvider>
  );
}
