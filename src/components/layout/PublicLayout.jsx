import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const PublicLayout = () => {
  const location = useLocation();
  const showNavbar = location.pathname === "/";

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #060010 0%, #0a0015 50%, #060010 100%)' }}>
      {showNavbar && <Navbar />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
