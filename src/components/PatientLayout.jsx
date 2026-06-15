import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import PatientSidebar from "./PatientSidebar";
import Navbar from "./Navbar";

const PatientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex">
      {/* Patient Sidebar */}
      <PatientSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col lg:ml-[260px]">
        {/* Top Navbar */}
        <Navbar setOpen={setSidebarOpen} />

        {/* Page Content */}
        <div className="p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PatientLayout;