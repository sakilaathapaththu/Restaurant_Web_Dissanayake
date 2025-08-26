// src/App.js
import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Login from "./Pages/Login";
import Dashboard from "./Pages/admin/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import CreateAdmin from "./Pages/admin/CreateAdmin";

const theme = createTheme({
  palette: { mode: "light", background: { default: "#F6F9FC" } },
  shape: { borderRadius: 12 }
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Protected route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route
            path="/admins/create"
            element={
              <ProtectedRoute roles={["superadmin"]}>
                <CreateAdmin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
