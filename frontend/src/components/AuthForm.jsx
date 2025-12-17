// src/components/AuthForm.jsx
import React, { useState } from "react";
import { register, login } from "../api/auth";

export default function AuthForm({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [form, setForm] = useState({ username: "", email: "", password: "", usernameOrEmail: "" });
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    try {
      if (mode === "register") {
        await register({ username: form.username, email: form.email, password: form.password });
        setMsg("Registered — now login");
        setMode("login");
      } else {
        const data = await login({ usernameOrEmail: form.usernameOrEmail, password: form.password });
        // store token
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);
        setMsg("Logged in");
        if (onLogin) onLogin(data);
      }
    } catch (err) {
      setMsg(err.message || String(err));
    }
  }

  return (
    <div style={{padding:16, maxWidth:420}}>
      <h3>{mode === "login" ? "Login" : "Register"}</h3>
      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <>
            <input placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} /><br/>
            <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /><br/>
          </>
        )}

        {mode === "login" && (
          <>
            <input placeholder="Username or Email" value={form.usernameOrEmail} onChange={e => setForm({...form, usernameOrEmail: e.target.value})} /><br/>
          </>
        )}

        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /><br/>
        <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
      </form>

      <div style={{marginTop:8}}>
        <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setMsg(""); }}>
          {mode === "login" ? "Switch to register" : "Switch to login"}
        </button>
      </div>

      <div style={{marginTop:12, color: "tomato"}}>{msg}</div>
    </div>
  );
}
