import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-text">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="notfound-btn">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}