import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { AdminDashboard } from "./pages/AdminDashboard";
import { PublicPayment } from "./pages/PublicPayment";
import { useAuthStore } from "./lib/store";

export default function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard/*" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/*" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/pay/:id" element={<PublicPayment />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
