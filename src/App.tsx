import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./frontend/Home";
import { Dashboard } from "./merchant/Dashboard";
import { Login } from "./frontend/Login";
import { AdminDashboard } from "./admin/AdminDashboard";
import { PublicPayment } from "./frontend/PublicPayment";
import { PublicGenerator } from "./frontend/PublicGenerator";
import { SupportDocs } from "./frontend/SupportDocs";
import { useAuthStore } from "./lib/store";

export default function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/support" element={<SupportDocs />} />
        <Route path="/login" element={isAuthenticated ? (user?.role === 'ADMIN' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <Login />} />
        <Route path="/dashboard/*" element={isAuthenticated ? (user?.role === 'MERCHANT' ? <Dashboard /> : <Navigate to="/admin" />) : <Navigate to="/login" />} />
        <Route path="/admin/*" element={isAuthenticated ? (user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />} />
        <Route path="/generate" element={<PublicGenerator />} />
        <Route path="/pay/:id" element={<PublicPayment />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
