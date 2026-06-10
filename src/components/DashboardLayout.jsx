import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex">
      <Sidebar open={open} setOpen={setOpen} />

      <main className="flex-1 min-w-0 flex flex-col lg:ml-[260px]">
        <Navbar setOpen={setOpen} />

        <div className="p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;