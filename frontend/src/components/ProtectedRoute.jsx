// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Decode JWT safely
 */
function decodeJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Validate JWT expiry
 */
function isTokenValid(token) {
  if (!token) return false;

  const claims = decodeJwt(token);
  if (!claims || !claims.exp) return false;

  // exp is in seconds → convert to ms
  return Date.now() < claims.exp * 1000;
}

/**
 * Protect routes that REQUIRE authentication
 * (Do NOT use for mental health / support pages)
 */
export default function ProtectedRoute({ token, children }) {
  if (!isTokenValid(token)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
