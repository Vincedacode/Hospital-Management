import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Receipt,
  User,
  LogOut,
  X,
} from "lucide-react";

const PatientSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("patient_uid");
    localStorage.removeItem("patient_name");

    navigate("/login");
  };

  const menuItems = [
    {
      title: "Dashboard",
      path: "/patient/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      title: "Appointments",
      path: "/patient/appointments",
      icon: <CalendarDays size={18} />,
    },
    {
      title: "Invoices",
      path: "/patient/invoices",
      icon: <Receipt size={18} />,
    },
    {
      title: "Profile",
      path: "/patient/profile",
      icon: <User size={18} />,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0
          w-[260px]
          h-screen
          z-50
          bg-gradient-to-b from-[#6C63FF] to-[#8B80F9]
          text-white
          p-5
          flex flex-col justify-between
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header & Navigation */}
        <div>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-2xl font-bold">Patient Portal</h1>
              <p className="text-sm text-gray-200">MediLab Hospital</p>
            </div>

            <button
              className="lg:hidden"
              onClick={() => setOpen(false)}
            >
              <X size={28} />
            </button>
          </div>

          <nav className="space-y-3">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-white text-[#6C63FF] shadow-lg"
                      : "hover:bg-white/20"
                  }`
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="w-full pb-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white border border-red-400/30 py-3 rounded-xl transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default PatientSidebar;