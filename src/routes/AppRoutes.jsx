import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";
import GuardScanPage from "../pages/guard/GuardScanPage";
import ProtectedRoute from "./ProtectedRoute";
import NavigateToDashboard from "./NavigateToDashboard";

// ------------------------ Owner Pages -----------------------
import OwnerSetup from "../pages/owner/OwnerSetup";
import OwnerLayout from "../layouts/OwnerLayout";
import MembersPage from "../pages/owner/MembersPage";
import BookingsPage from "../pages/owner/BookingsPage";
import PaymentsPage from "../pages/owner/PaymentsPage";
import FloorsPage from "../pages/owner/FloorsPage";
import SlotsPage from "../pages/owner/SlotsPage";
import AttendancePage from "../pages/owner/AttendancePage";
import AnnouncementsPage from "../pages/owner/AnnouncementsPage";
import ReportsPage from "../pages/owner/ReportsPage";
import SettingsPage from "../pages/owner/SettingsPage";
import MemberDetailPage from "../pages/owner/members/MemberDetailPage";
import BookingDetailPage from "../pages/owner/bookings/BookingDetailPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NavigateToDashboard />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Route>

        <Route element={<NavigateToDashboard />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
          <Route path="/owner/setup" element={<OwnerSetup />} />
          <Route element={<OwnerLayout />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/members" element={<MembersPage />} />
            <Route
              path="/owner/members/:memberId"
              element={<MemberDetailPage />}
            />
            <Route path="/owner/bookings" element={<BookingsPage />} />
            <Route
              path="/owner/bookings/:bookingId"
              element={<BookingDetailPage />}
            />
            <Route path="/owner/payments" element={<PaymentsPage />} />
            <Route path="/owner/floors" element={<FloorsPage />} />
            <Route path="/owner/slots" element={<SlotsPage />} />
            <Route path="/owner/attendance" element={<AttendancePage />} />
            <Route
              path="/owner/announcements"
              element={<AnnouncementsPage />}
            />
            <Route path="/owner/reports" element={<ReportsPage />} />
            <Route path="/owner/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["guard"]} />}>
          <Route path="/guard/scan" element={<GuardScanPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
