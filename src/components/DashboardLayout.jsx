import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "../styles/DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
