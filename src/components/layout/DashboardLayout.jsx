import React, { Suspense, lazy } from "react";
import { Outlet } from "react-router-dom";
import { DockNavigation } from "./DockNavigation";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#15051F] via-[#1A0827] to-[#1E0A2A]"
        style={{
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite'
        }}
      ></div>
      
      {/* Animated purple orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
          style={{
            top: '-10%',
            left: '-5%',
            animation: 'float 20s ease-in-out infinite'
          }}
        ></div>
        <div 
          className="absolute w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl"
          style={{
            bottom: '-10%',
            right: '-5%',
            animation: 'float 25s ease-in-out infinite reverse'
          }}
        ></div>
        <div 
          className="absolute w-64 h-64 bg-violet-600/10 rounded-full blur-3xl"
          style={{
            top: '50%',
            right: '20%',
            animation: 'float 30s ease-in-out infinite'
          }}
        ></div>
      </div>
      
      {/* Noise Texture for Depth */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
      }}></div>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

      {/* Content */}
      <main className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
      <DockNavigation />
    </div>
  );
};

export default DashboardLayout;
