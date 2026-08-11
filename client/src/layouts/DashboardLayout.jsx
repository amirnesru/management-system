import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}