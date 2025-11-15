import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)' }}>
      <Navbar />
      <div className="flex pt-20">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
