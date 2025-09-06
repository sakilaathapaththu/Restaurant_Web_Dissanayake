// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import Login from "./Pages/Login";
import Dashboard from "./Pages/admin/Dashboard";
import AddAdmin from "./Pages/admin/AddAdmin";
import ProtectedRoute from "./Components/ProtectedRoute";
import RequireRole from "./Components/RequireRole";
import AddCategory from "./Pages/admin/categories/AddCategory";
import CategoriesList from "./Pages/admin/categories/CategoriesList";
import AddItem from "./Pages/admin/items/AddItem";
import ItemsList from "./Pages/admin/items/ItemsList";
import Foods from "./Pages/ItemePage";
import Home from "./Pages/homepage";
import EditItem from "./Pages/admin/items/EditItem";
import ContactBooking from "./Pages/ContactBooking";
import InquiriesList from "./Pages/admin/InquiriesList";
import CheckoutPage from "./Pages/CheckoutPage";
import MyOrdersPage from "./Pages/MyOrdersPage";
import ViewOrders from "./Pages/admin/orders/ViewOrders";
import Settings from "./Pages/admin/Settings";
import ScrollToTopButton from "./Components/ScrollToTopButton";

const theme = createTheme({
  palette: { mode: "light", background: { default: "#F6F9FC" } },
  shape: { borderRadius: 12 },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>

          <Route path="*" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* Default route - redirect to home */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Public routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<ContactBooking />} />
          <Route path="/menu" element={<Foods />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admins/create"
            element={
              <ProtectedRoute>
                <RequireRole roles={["superadmin"]}>
                  <AddAdmin />
                </RequireRole>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <RequireRole roles={["superadmin", "editor"]}>
                  <CategoriesList />
                </RequireRole>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/new"
            element={
              <ProtectedRoute>
                <RequireRole roles={["superadmin", "editor"]}>
                  <AddCategory />
                </RequireRole>
              </ProtectedRoute>
            }
          />
          <Route
            path="/items/new"
            element={
              <ProtectedRoute>
                <RequireRole roles={["superadmin", "editor"]}>
                  <AddItem />
                </RequireRole>
              </ProtectedRoute>
            }
          />
          <Route
            path="/items"
            element={
              <ProtectedRoute>
                <RequireRole roles={["superadmin", "editor"]}>
                  <ItemsList />
                </RequireRole>
              </ProtectedRoute>
            }
          />
          <Route
            path="/items/:id/edit"
            element={
              <ProtectedRoute>
                <RequireRole roles={["superadmin", "editor"]}>
                  <EditItem />
                </RequireRole>
              </ProtectedRoute>
            }
          />
          <Route path="/inquiries" element={
            <ProtectedRoute> <RequireRole> <InquiriesList /> </RequireRole> </ProtectedRoute>
          } />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <RequireRole roles={["superadmin", "editor"]}>
                  <ViewOrders />
                </RequireRole>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <RequireRole roles={["superadmin"]}>
                  <Settings />
                </RequireRole>
              </ProtectedRoute>
            }
          />

        </Routes>
        <ScrollToTopButton />
      </BrowserRouter>
    </ThemeProvider>
  );
}
