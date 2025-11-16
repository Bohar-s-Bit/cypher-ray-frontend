import React from "react";
import { Outlet } from "react-router-dom";
import { DockNavigation } from "./DockNavigation";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)' }}>
      <main className="p-6 md:p-8">
        <Outlet />
      </main>
      <DockNavigation />
    </div>
  );
};

export default DashboardLayout;
