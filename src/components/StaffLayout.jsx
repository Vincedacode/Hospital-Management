import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StaffSidebar from "./StaffSidebar";
import Navbar from "./Navbar"; // Importing your existing Navbar

const StaffLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // Matching the admin dashboard background color (#F5F6FA)
    <div className="min-h-screen bg-[#F5F6FA] flex">
      {/* Redesigned Staff Sidebar */}
      <StaffSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main content wrapper mirroring DashboardLayout spacing */}
      <main className="flex-1 min-w-0 flex flex-col lg:ml-[260px]">
        {/* Navbar hook for mobile menu toggle and page context */}
        <Navbar setOpen={setSidebarOpen} />

        {/* Dynamic page container with consistent structural padding */}
        <div className="p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StaffLayout;