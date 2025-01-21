import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Authentication Routes
// import ProtectedRoute from "./router/protected";
// import PublicRoute from "./router/public";
import LandingPage from "./pages/LandingPage";
import "./App.css";
import EducationPage from "./pages/EducationPage";
import FacilitiesPage from "./pages/FacilitiesPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import TSPage from "./pages/TSpage";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/Terms&Services" element={<TSPage />} />
          <Route path="*" element={<NotFound />} />
          {/* <Route path="/" element={<Navigate to="/dashbo" />} /> */}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
