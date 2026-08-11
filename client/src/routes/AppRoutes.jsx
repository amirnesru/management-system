import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout & Route Guards
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

// Auth Pages
import Login from "../pages/Login/Login";
import Signup from "../pages/SignUp/Signup";

// Feature Pages
import Dashboard from "../pages/Dashboard/Dashboard";
import AllMembers from "../pages/AllMember/AllMembers";
import Attendance from "../pages/Attendance/Attendance";
import Settings from "../pages/Settings/Settings";
import NotFound from "../pages/NotFound/NotFound";
import AccessDenied from "../pages/AccessDenied/AccessDenied";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* All protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          
          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute permission="canViewDashboard">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Members */}
          <Route
            path="/members"
            element={
              <ProtectedRoute permission="canViewMembers">
                <AllMembers />
              </ProtectedRoute>
            }
          />

          {/* Attendance */}
          <Route
            path="/attendance"
            element={
              <ProtectedRoute permission="canViewAttendance">
                <Attendance />
              </ProtectedRoute>
            }
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute permission="canAccessSettings">
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Access Denied */}
        <Route path="/access-denied" element={<AccessDenied />} />
      </Route>

      {/* Default */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}