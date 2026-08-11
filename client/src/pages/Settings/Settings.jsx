import React, { useState, useEffect } from "react";
import "./Settings.css";

export default function Settings() {
  // 1. Initialize state from localStorage so choices persist across reloads
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app-theme") || "Light";
  });
  const [autoAddEvents, setAutoAddEvents] = useState(true);
  const [phonePublic, setPhonePublic] = useState(true);

  // 2. Add or remove 'dark-theme' class on document.body when theme state changes
  useEffect(() => {
    if (theme === "Dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  return (
    <div className="settings-page">
      <div className="settings-card">
        {/* Appearance Section */}
        <div className="setting-row">
          <div className="setting-info">
            <h3 className="setting-title">Appearance</h3>
            <p className="setting-description">
              Customize how your theme looks on your device
            </p>
          </div>
          <div>
            <select
              className="theme-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
            </select>
          </div>
        </div>

        {/* Automatically Add Events */}
        <div className="setting-row">
          <div className="setting-info">
            <h3 className="setting-title">
              Automatically Add Events to Calendar
            </h3>
            <p className="setting-description">
              Save time by auto-adding events to your calendar, or manually
              enter them for more control.
            </p>
          </div>
          <div>
            <label className="switch">
              <input
                type="checkbox"
                checked={autoAddEvents}
                onChange={(e) => setAutoAddEvents(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Make Phone Public */}
        <div className="setting-row">
          <div className="setting-info">
            <h3 className="setting-title">Make your Phone Public</h3>
            <p className="setting-description">
              Keep your phone private for safety, or share it for convenience.
            </p>
          </div>
          <div>
            <label className="switch">
              <input
                type="checkbox"
                checked={phonePublic}
                onChange={(e) => setPhonePublic(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}