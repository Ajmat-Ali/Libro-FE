import React from "react";
import { useSelector } from "react-redux";
import { ROLES } from "../constant";
import { Navigate, Outlet } from "react-router-dom";

const NavigateToDashboard = () => {
  const { isAuthenticated, user } = useSelector((store) => store.auth);

  if (isAuthenticated) {
    if (user.role === ROLES.OWNER) {
      return <Navigate to={"/owner/dashboard"} replace />;
    } else if (user.role === ROLES.STUDENT) {
      return <Navigate to={"/student/dashboard"} replace />;
    } else if (user.role === ROLES.GUARD) {
      return <Navigate to={"/guard/scan"} replace />;
    }
  }
  return <Outlet />;
};

export default NavigateToDashboard;
