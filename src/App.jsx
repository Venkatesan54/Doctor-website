import React, { useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import FloatingChatbot from "./components/FloatingChatbot";

// Context
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const About = lazy(() => import("./pages/About"));
const DoctorSearch = lazy(() => import("./pages/DoctorSearch"));
const DoctorProfile = lazy(() => import("./pages/DoctorProfile"));
const FindNearby = lazy(() => import("./pages/FindNearby"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const DoctorDashboard = lazy(() => import("./pages/DoctorDashboard"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const HospitalProfile = lazy(() => import("./pages/HospitalProfile"));
const LabProfile = lazy(() => import("./pages/LabProfile"));
const EmergencyMode = lazy(() => import("./pages/EmergencyMode"));
const Chat = lazy(() => import("./pages/Chat"));
const SymptomChecker = lazy(() => import("./pages/SymptomChecker"));
const DigitalRecords = lazy(() => import("./pages/DigitalRecords"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const MockCheckout = lazy(() => import("./pages/MockCheckout"));

// Placeholder for other pages to be implemented
const Profile = () => <div className="pt-32 text-center h-screen font-bold text-slate-500">Profile Page (Coming Soon)</div>;

// Footer is hidden on full-screen auth pages
const NO_FOOTER_ROUTES = ["/login", "/register"];

function AppLayout() {
  const location = useLocation();
  const showFooter = !NO_FOOTER_ROUTES.includes(location.pathname);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar onEmergencyClick={() => setIsEmergencyOpen(true)} />
      <div className="flex-1">
        <Suspense fallback={<div className="h-screen flex items-center justify-center font-bold text-slate-500">Loading interface...</div>}>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/doctors" element={<DoctorSearch />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/find-nearby" element={<FindNearby />} />
          <Route path="/find-nearby/hospitals" element={<FindNearby />} />
          <Route path="/find-nearby/labs" element={<FindNearby />} />
          <Route path="/hospital/:id" element={<HospitalProfile />} />
          <Route path="/lab/:id" element={<LabProfile />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
<Route path="/mock-checkout" element={<MockCheckout />} />

          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:doctorId"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-records"
            element={
              <ProtectedRoute>
                <DigitalRecords />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute role="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Fallback: Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </div>
      {showFooter && <Footer />}
      <ToastContainer position="bottom-right" theme="colored" />
      <EmergencyMode 
        isOpen={isEmergencyOpen} 
        onClose={() => setIsEmergencyOpen(false)} 
      />
      <FloatingChatbot />
    </div>
  );
}

function App() {
  const basename = import.meta?.env?.BASE_URL || "/";
  // If the server is serving this app under a non-root base (e.g. /DoctorApp/)
  // but the browser is visiting a path without that base, redirect so the
  // react-router basename matches the actual URL and avoid 404/runtime warnings.
  if (typeof window !== 'undefined' && basename && basename !== "/") {
    const path = window.location.pathname || "/";
    if (!path.startsWith(basename)) {
      const target = basename.replace(/\/$/, '') + path;
      window.location.replace(target + window.location.search + window.location.hash);
      return null; // avoid rendering while redirecting
    }
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router basename={basename}>
            <AppLayout />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
