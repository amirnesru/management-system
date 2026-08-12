import React from "react";
import { Link } from "react-router-dom";
import "./AccessDenied.css";

export default function AccessDenied() {
  return (
    <div className="access-denied">
      <div className="access-denied-card">
        <div className="access-denied-icon">🔒</div>

        <h1>Access Denied</h1>

        <p>
          You don't have permission to access this page.
        </p>

        <Link to="/login" className="access-denied-button">
          Back to Login
        </Link>
      </div>
    </div>
  );
}