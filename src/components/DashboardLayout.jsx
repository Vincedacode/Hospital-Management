import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex bg-[#F5F6FA] min-h-screen">

      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <Navbar setOpen={setOpen} />

        {/* PAGE CONTENT */}
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;