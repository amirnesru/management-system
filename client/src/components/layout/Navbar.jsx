import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();

  // Dynamic user details with fallbacks
  const userName = user?.name || user?.fullName || "User";
  const userFirstName = userName.split(" ")[0];
  const userRole = user?.role || "Member";
  const userAvatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userName
    )}&background=110051&color=ffffff`;

  const getHeaderContent = (pathname) => {
    switch (pathname) {
      case "/dashboard":
        return {
          title: `Hello ${userFirstName} 👋`,
          subtitle: "Good Morning",
        };
      case "/members":
        return {
          title: "All Members",
          subtitle: "All Members Information",
        };
      case "/attendance":
        return {
          title: "Attendance",
          subtitle: "All Attendance > Attendance > Group 1",
        };
      case "/settings":
        return {
          title: "Settings",
          subtitle: "Manage your account preferences",
        };
      default:
        return {
          title: "Dashboard",
          subtitle: "Welcome back",
        };
    }
  };

  const content = getHeaderContent(location.pathname);

  return (
    <header className="header-container">
      <div className="header-titles">
        <h1 className="header-main-title">{content.title}</h1>
        <p className="header-subtitle">{content.subtitle}</p>
      </div>

      <div className="header-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search" className="search-input" />
        </div>

        <button type="button" className="icon-btn" aria-label="Notifications">
          🔔
        </button>

        <div className="user-profile">
          <img
            src={userAvatar}
            alt={userName}
            className="profile-avatar"
          />
          <div className="profile-info">
            <span className="profile-name">{userName}</span>
            <span className="profile-role" style={{ textTransform: "uppercase" }}>
              {userRole}
            </span>
          </div>
          <span className="dropdown-arrow">▼</span>
        </div>
      </div>
    </header>
  );
}