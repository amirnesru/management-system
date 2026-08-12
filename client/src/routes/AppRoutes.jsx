import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Login/Login";
import Signup from "../pages/SignUp/Signup";

import Dashboard from "../pages/Dashboard/Dashboard";
import AllMembers from "../pages/AllMember/AllMembers";
import Attendance from "../pages/Attendance/Attendance";
import Settings from "../pages/Settings/Settings";

import NotFound from "../pages/NotFound/NotFound";
import AccessDenied from "../pages/AccessDenied/AccessDenied";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute permission="canViewDashboard">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/members"
            element={
              <ProtectedRoute permission="canViewMembers">
                <AllMembers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <ProtectedRoute permission="canViewAttendance">
                <Attendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute permission="canAccessSettings">
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>

      <Route path="/access-denied" element={<AccessDenied />} />

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
