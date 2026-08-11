import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../utils/permissions";
import "./Sidebar.css";

export default function Sidebar() {
  const { user } = useAuth();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app-theme") || "Light";
  });

  useEffect(() => {
    if (theme === "Dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }

    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "⊞",
      permission: "canViewDashboard",
    },
    {
      name: "All Members",
      path: "/members",
      icon: "👥",
      permission: "canViewMembers",
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: "📅",
      permission: "canViewAttendance",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "⚙",
      permission: "canAccessSettings",
    },
  ];

  // Only show pages that the current user's role can access
  const visibleNavItems = navItems.filter((item) =>
    hasPermission(user?.role, item.permission)
  );

  return (
    <aside className="sidebar-container">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <span
            className="brand-title"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: "28px",
              fontWeight: 600,
              color: "#110051",
              letterSpacing: "1px",
              background: "#F4F1FF",
              padding: "6px 14px",
              borderRadius: "8px",
              display: "inline-block",
            }}
          >
            𝓜𝓪𝓷𝓪𝓰𝓮𝓧
          </span>
        </div>

        <nav className="sidebar-nav">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <div className="active-indicator" />}

                  <span className="nav-icon">{item.icon}</span>

                  <span className="nav-text">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="theme-toggle-pill">
          <button
            type="button"
            className={`theme-btn ${
              theme === "Light" ? "selected" : ""
            }`}
            onClick={() => setTheme("Light")}
          >
            <span>☼</span> Light
          </button>

          <button
            type="button"
            className={`theme-btn ${
              theme === "Dark" ? "selected" : ""
            }`}
            onClick={() => setTheme("Dark")}
          >
            <span>☾</span> Dark
          </button>
        </div>
      </div>
    </aside>
  );
}