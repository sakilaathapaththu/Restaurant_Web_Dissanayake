// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Login from "./Pages/Login";

const theme = createTheme({ palette: { mode: "light" } });

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          
          <Route path="/login" element={<Login />} />
          {/* Example protected page placeholder */}
          <Route path="/dashboard" element={<div style={{ padding: 24 }}>Dashboard (protected)</div>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
