import React from "react";
import { Navigate } from "react-router-dom";

export default function RequireRole({ roles = [], children }) {
  try {
    const admin = JSON.parse(localStorage.getItem("admin") || "{}");
    if (!admin?.role || (roles.length && !roles.includes(admin.role))) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
}