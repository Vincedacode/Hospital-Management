import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FlaskConical,
  Building2,
  Pill,
  UserRound,
  Menu,
  X,
  CalendarDays,
  ReceiptText,
} from "lucide-react";
import { useState } from "react";

const Sidebar = ({open, setOpen}) => {
 

const links = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    name: "Staff",
    path: "/admin/staff",
    icon: <Users size={18} />,
  },
  {
    name: "Pharmacy",
    path: "/admin/pharmacy",
    icon: <Pill size={18} />,
  },
  {
    name: "Patient",
    path: "/admin/patient",
    icon: <UserRound size={18} />,
  },
   {
    name: "Appointments",
    path: "/admin/appointments",
    icon: <CalendarDays size={20} />,
  },

  {
    name: "Medicines",
    path: "/admin/medicines",
    icon: <Pill size={20} />,
  },

  {
    name: "Invoices",
    path: "/admin/invoices",
    icon: <ReceiptText size={20} />,
  }
];

  return (
    <>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 z-50
          h-screen w-[260px]
          bg-gradient-to-b from-[#6C63FF] to-[#8B80F9]
          text-white
          p-5
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold">
              MediLab
            </h1>

            <p className="text-sm text-gray-200">
              Hospital
            </p>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={28} />
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="space-y-3">
          {links.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `
                flex items-center gap-3
                px-4 py-3 rounded-xl
                transition-all duration-300
                font-medium
                ${
                  isActive
                    ? "bg-white text-[#6C63FF] shadow-lg"
                    : "hover:bg-white/20"
                }
              `
              }
            >
              {link.icon}

              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;