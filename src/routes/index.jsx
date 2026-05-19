import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";
import GuardScan from "../pages/guard/GuardScan";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/guard/scan" element={<GuardScan />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
