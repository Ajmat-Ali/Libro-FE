import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((store) => store.auth);

  if (!isAuthenticated) return <Navigate to={"/login"} replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={"/login"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
