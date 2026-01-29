import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

/* Lazy pages */
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Journal = lazy(() => import("./pages/Journal"));
const MoodHistory = lazy(() => import("./pages/MoodHistory"));
const Doctors = lazy(() => import("./pages/Doctors"));
const BookAppointment = lazy(() => import("./pages/BookAppointment"));
const MyAppointments = lazy(() => import("./pages/MyAppointments"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SupportChoice = lazy(() => import("./pages/SupportChoice"));
const MusicPage = lazy(() => import("./pages/MusicPage"));
const VideoPage = lazy(() => import("./pages/VideoPage"));
const DoctorPage = lazy(() => import("./pages/DoctorPage"));

function AppRouterWrapper() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    if (!token) {
      localStorage.clear();
      setUsername(null);
    }
  }, [token]);

  function handleLogin(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    setToken(data.token);
    setUsername(data.username);
    navigate("/dashboard");
  }

  function handleLogout() {
    setTimeout(() => {
      localStorage.clear();
      setToken(null);
      setUsername(null);
      navigate("/login");
    }, 300);
  }

  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* THEME-AWARE TOASTER */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style:
            theme === "dark"
              ? {
                  background: "#0f172a",
                  color: "#e5e7eb",
                  border: "1px solid rgba(255,255,255,0.12)",
                }
              : {
                  background: "#ffffff",
                  color: "#1f2937",
                  border: "1px solid #e5e7eb",
                },
        }}
      />

      {!hideNavbar && (
        <Navbar loggedUser={username} onLogout={handleLogout} />
      )}

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[70vh] text-gray-500">
            Loading…
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute token={token}>
                <Dashboard username={username} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/journal"
            element={
              <ProtectedRoute token={token}>
                <Journal token={token} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mood-history"
            element={
              <ProtectedRoute token={token}>
                <MoodHistory token={token} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctors"
            element={
              <ProtectedRoute token={token}>
                <Doctors />
              </ProtectedRoute>
            }
          />

          <Route
            path="/book-appointment"
            element={
              <ProtectedRoute token={token}>
                <BookAppointment token={token} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute token={token}>
                <MyAppointments token={token} />
              </ProtectedRoute>
            }
          />

          <Route path="/support" element={<SupportChoice />} />
          <Route path="/support/music" element={<MusicPage />} />
          <Route path="/support/videos" element={<VideoPage />} />
          <Route path="/support/doctors" element={<DoctorPage />} />

          <Route
            path="*"
            element={<Navigate to={token ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </Suspense>
    </div>
  );
}

/* ROOT */
export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <AppRouterWrapper />
      </HashRouter>
    </ThemeProvider>
  );
}
