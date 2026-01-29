import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Mail, Lock, Shield } from "lucide-react";

const JAVA_API = "http://localhost:8080/api";
const TOAST_ID = "register-toast";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const toastLock = useRef(false);

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    const err = {};
    if (!username.trim()) err.username = "Username is required";
    if (!email.trim()) err.email = "Email is required";
    if (!password) err.password = "Password is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading || toastLock.current) return;
    if (!validate()) return;

    toast.dismiss(TOAST_ID);
    toastLock.current = true;
    setLoading(true);

    try {
      const res = await fetch(`${JAVA_API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      const text = await res.text();
      let data = {};

      try {
        data = text ? JSON.parse(text) : {};
      } catch {}

      if (!res.ok) {
        throw new Error(data.message || text || "Registration failed");
      }

      toast.success("Account created successfully 🎉", {
        id: TOAST_ID,
        style: calmToastStyle,
      });

      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Registration failed", {
        id: TOAST_ID,
        style: calmToastStyle,
      });
    } finally {
      setLoading(false);
      toastLock.current = false;
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div
      className="
        min-h-screen flex items-center justify-center px-4
        bg-gradient-to-br
        from-indigo-100 via-white to-purple-100
        dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950
        transition-colors duration-500
      "
    >
      <div
        className="
          w-full max-w-md rounded-2xl p-8
          bg-white/80 dark:bg-white/10
          backdrop-blur-xl
          border border-gray-200 dark:border-white/20
          shadow-xl
          animate-fadeIn
        "
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
            Create Account
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-300 mt-2">
            Start your journey calmly
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div>
            <label className="text-xs text-gray-600 dark:text-slate-300 mb-1 block">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                className="
                  w-full pl-10 pr-4 py-3 rounded-xl
                  bg-white dark:bg-white/15
                  text-gray-800 dark:text-white
                  placeholder-gray-400
                  border border-gray-300 dark:border-white/20
                  focus:ring-2 focus:ring-indigo-500/40 outline-none
                "
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {errors.username && (
              <p className="text-xs text-rose-500 mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-gray-600 dark:text-slate-300 mb-1 block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                className="
                  w-full pl-10 pr-4 py-3 rounded-xl
                  bg-white dark:bg-white/15
                  text-gray-800 dark:text-white
                  placeholder-gray-400
                  border border-gray-300 dark:border-white/20
                  focus:ring-2 focus:ring-indigo-500/40 outline-none
                "
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-gray-600 dark:text-slate-300 mb-1 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                className="
                  w-full pl-10 pr-4 py-3 rounded-xl
                  bg-white dark:bg-white/15
                  text-gray-800 dark:text-white
                  placeholder-gray-400
                  border border-gray-300 dark:border-white/20
                  focus:ring-2 focus:ring-indigo-500/40 outline-none
                "
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-rose-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="text-xs text-gray-600 dark:text-slate-300 mb-1 block">
              Role
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="
                  w-full pl-10 pr-4 py-3 rounded-xl
                  bg-white dark:bg-white/15
                  text-gray-800 dark:text-white
                  border border-gray-300 dark:border-white/20
                  focus:ring-2 focus:ring-indigo-500/40 outline-none
                "
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-xl
              bg-indigo-600 hover:bg-indigo-500
              text-white font-medium transition
              disabled:opacity-50
            "
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Login
          </Link>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

/* ---------------- TOAST STYLE (CALM) ---------------- */

const calmToastStyle = {
  background: "#0f172a",
  color: "#e5e7eb",
  border: "1px solid rgba(255,255,255,0.12)",
};
