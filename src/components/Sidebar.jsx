import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Pill,
  UserRound,
  X,
  CalendarDays,
  ReceiptText,
} from "lucide-react";

const Sidebar = ({ open, setOpen }) => {
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
      icon: <CalendarDays size={18} />,
    },
    {
      name: "Medicines",
      path: "/admin/medicines",
      icon: <Pill size={18} />,
    },
    {
      name: "Invoices",
      path: "/admin/invoices",
      icon: <ReceiptText size={18} />,
    },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0
          w-[260px]
          h-screen
          z-50
          bg-gradient-to-b from-[#6C63FF] to-[#8B80F9]
          text-white
          p-5
          transition-transform duration-300
          ${
            open ? "translate-x-0" : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold">MediLab</h1>
            <p className="text-sm text-gray-200">Hospital</p>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={28} />
          </button>
        </div>

        <nav className="space-y-3">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `
                flex items-center gap-3
                px-4 py-3
                rounded-xl
                transition-all
                duration-300
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
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;