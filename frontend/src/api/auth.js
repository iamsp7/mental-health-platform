// // src/api/auth.js
// const API_BASE = "http://localhost:8080/api";

// export async function register({ username, email, password }) {
//   const res = await fetch(`${API_BASE}/auth/register`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username, email, password }),
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(text || "Register failed");
//   }
//   return res.text();
// }

// export async function login({ usernameOrEmail, password }) {
//   const res = await fetch(`${API_BASE}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ usernameOrEmail, password }),
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(text || "Login failed");
//   }
//   return res.json(); // { token, tokenType, username, role }
// }

// // helper to attach token for protected requests
// export function authFetch(url, options = {}) {
//   const token = localStorage.getItem("token");
//   const headers = {
//     ...(options.headers || {}),
//     "Content-Type": "application/json",
//   };
//   if (token) headers["Authorization"] = `Bearer ${token}`;
//   return fetch(url, { ...options, headers });
// }
