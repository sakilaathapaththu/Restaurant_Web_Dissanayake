// src/App.jsx (or wherever you define routes)
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/admin/Dashboard";
import AddAdmin from "./Pages/admin/AddAdmin";
import ProtectedRoute from "./Components/ProtectedRoute";
import RequireRole from "./Components/RequireRole";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/admins/create" element={
          <ProtectedRoute>
            <RequireRole roles={["superadmin"]}>
              <AddAdmin />
            </RequireRole>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
