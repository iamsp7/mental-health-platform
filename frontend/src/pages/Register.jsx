import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const JAVA_API = "http://localhost:8080/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${JAVA_API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
        }),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text);
      }

      if (!res.ok) {
        throw new Error(data.message || text);
      }

      toast.success("Account created successfully 🎉");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-indigo-900 px-4">
      
      {/* Glass Card */}
      <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 animate-fadeIn">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-wide">
            Create Account
          </h2>
          <p className="text-sm text-gray-300 mt-2">
            Start your mental wellness journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div className="relative group">
            <label className="text-xs text-gray-300 mb-1 block">
              Username
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 
              border border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/50 
              outline-none transition-all"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <span className="absolute right-3 top-9 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">
              Public display name
            </span>
          </div>

          {/* Email */}
          <div className="relative group">
            <label className="text-xs text-gray-300 mb-1 block">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 
              border border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/50 
              outline-none transition-all"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="absolute right-3 top-9 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">
              We’ll never spam you
            </span>
          </div>

          {/* Password */}
          <div className="relative group">
            <label className="text-xs text-gray-300 mb-1 block">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 
              border border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/50 
              outline-none transition-all"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="absolute right-3 top-9 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">
              Min 8 characters recommended
            </span>
          </div>

          {/* Role */}
          <div className="relative group">
            <label className="text-xs text-gray-300 mb-1 block">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white 
              border border-white/20 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/50 
              outline-none transition-all"
            >
              <option className="text-black" value="USER">User</option>
              <option className="text-black" value="ADMIN">Admin</option>
            </select>
            <span className="absolute right-3 top-9 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">
              Access level
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 
            text-white font-semibold tracking-wide
            hover:scale-[1.02] hover:shadow-xl transition-all
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                Creating account...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 transition underline-offset-4 hover:underline"
          >
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
            transform: translateY(20px);
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
