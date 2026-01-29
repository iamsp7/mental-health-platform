import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

/* ================= LAZY LOAD ================= */

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import MoodHistory from "./pages/MoodHistory";
import Doctors from "./pages/Doctors";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import SupportChoice from "./pages/SupportChoice";
import MusicPage from "./pages/MusicPage";
import VideoPage from "./pages/VideoPage";
import DoctorPage from "./pages/DoctorPage";

export default function AppRouterWrapper() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  const navigate = useNavigate();
  const location = useLocation();

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
    localStorage.clear();
    setToken(null);
    setUsername(null);
    navigate("/login");
  }

  const showNavbar =
    token && !["/login", "/register"].includes(location.pathname);

  return (
    /* 🌗 GLOBAL THEME-AWARE WRAPPER */
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-indigo-100 via-white to-purple-100
        dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950
        text-gray-800 dark:text-slate-200
        transition-colors duration-300
      "
    >
      {/* TOASTER */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "14px",
            background: "#0f172a",
            color: "#f8fafc",
          },
        }}
      />

      {showNavbar && (
        <Navbar loggedUser={username} onLogout={handleLogout} />
      )}

      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED */}
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

        {/* SUPPORT */}
        <Route path="/support" element={<SupportChoice />} />
        <Route path="/support/music" element={<MusicPage />} />
        <Route path="/support/videos" element={<VideoPage />} />
        <Route path="/support/doctors" element={<DoctorPage />} />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to={token ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </div>
  );
}
