import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/permissions";

export default function ProtectedRoute({ permission, children }) {
  const { user, loading } = useAuth();

  // Wait until AuthContext checks localStorage
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Permission required but user doesn't have it
  if (permission && !hasPermission(user.role, permission)) {
    return <Navigate to="/access-denied" replace />;
  }

  // Used as a wrapper around another component
  if (children) {
    return children;
  }

  // Used as a route layout wrapper
  return <Outlet />;
}