
import React, { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { IS_DEMO } from "../config";

const JAVA_API = "http://localhost:8080/api";
const TOAST_ID = "login-toast";

/* ---------------- PASSWORD STRENGTH ---------------- */

function getPasswordStrength(pw) {
  if (!pw) return { label: "", width: "0%" };
  if (pw.length < 6) return { label: "Weak", width: "33%" };
  if (pw.length < 8) return { label: "Medium", width: "66%" };
  return { label: "Strong", width: "100%" };
}

export default function Login({ onLogin }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const toastShownRef = useRef(false);
  const strength = getPasswordStrength(password);

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    const err = {};
    if (!username.trim()) err.username = "Username is required";
    if (!IS_DEMO && !password) err.password = "Password is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const isFormValid = useMemo(
    () => username && (IS_DEMO || password),
    [username, password]
  );

  /* ---------------- SUBMIT ---------------- */

  async function handleSubmit(e) {

    e.preventDefault();

    if (loading || toastShownRef.current || !validate()) return;

    toast.dismiss(TOAST_ID);
    toastShownRef.current = true;
    setLoading(true);

    if (IS_DEMO) {

      toast.success("Logged in successfully", {
        id: TOAST_ID,
        style: calmToastStyle,
      });

      onLogin({
        token: "demo",
        username: "Demo User",
        role: "USER"
      });

      setLoading(false);
      toastShownRef.current = false;
      return;
    }

    try {

      const res = await fetch(`${JAVA_API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error();

      toast.success("Welcome back 👋", {
        id: TOAST_ID,
        style: calmToastStyle,
      });

      /* Important: let App.js handle redirect */
      onLogin(data);

    } catch {

      toast.error("Invalid username or password", {
        id: TOAST_ID,
        style: calmToastStyle,
      });

    } finally {

      setLoading(false);
      toastShownRef.current = false;

    }

  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex items-center justify-center px-4
      bg-gradient-to-br
      from-indigo-100 via-white to-purple-100
      dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950">

      <div className="w-full max-w-md rounded-2xl p-8
        bg-white/80 dark:bg-white/10
        backdrop-blur-xl
        border border-gray-200 dark:border-white/20
        shadow-xl">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600 dark:text-slate-300 mt-2">
            Sign in calmly, you’re safe here
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div>
            <label className="text-xs text-gray-600 dark:text-slate-300 mb-1 block">
              Username
            </label>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                className="w-full pl-10 pr-4 py-3 rounded-xl
                  bg-white dark:bg-white/15
                  text-gray-800 dark:text-white
                  border border-gray-300 dark:border-white/20
                  focus:ring-2 focus:ring-indigo-500/40 outline-none"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {errors.username && (
              <p className="text-xs text-rose-500 mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-gray-600 dark:text-slate-300 mb-1 block">
              Password
            </label>

            <div className="relative">

              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-3 rounded-xl
                  bg-white dark:bg-white/15
                  text-gray-800 dark:text-white
                  border border-gray-300 dark:border-white/20
                  focus:ring-2 focus:ring-indigo-500/40 outline-none"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(e) => setCapsOn(e.getModifierState("CapsLock"))}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>

            </div>

            {capsOn && (
              <p className="text-xs text-amber-500 mt-1">Caps Lock is ON</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full py-3 rounded-xl
              bg-indigo-600 hover:bg-indigo-500
              text-white font-medium transition
              disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>

        <div className="text-center mt-6 text-sm text-gray-600 dark:text-slate-300">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}

const calmToastStyle = {
  background: "#0f172a",
  color: "#e5e7eb",
  border: "1px solid rgba(255,255,255,0.12)",
};

