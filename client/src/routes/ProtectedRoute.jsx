import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/permissions";

export default function ProtectedRoute({ permission, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(user.role, permission)) {
    return <Navigate to="/access-denied" replace />;
  }

  if (children) {
    return children;
  }

  return <Outlet />;
}