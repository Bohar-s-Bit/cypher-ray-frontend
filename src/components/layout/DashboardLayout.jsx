import React, { Suspense, lazy } from "react";
import { Outlet } from "react-router-dom";
import { DockNavigation } from "./DockNavigation";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen pb-24 relative overflow-hidden bg-neutral-950">
      {/* Subtle Purple Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-neutral-950 to-indigo-950/20"></div>
      
      {/* Noise Texture for Depth */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
      }}></div>

      {/* Content */}
      <main className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
      <DockNavigation />
    </div>
  );
};

export default DashboardLayout;
