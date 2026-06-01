import {
  User,
  LogOut,
  Menu,
} from "lucide-react";

const Navbar = ({ setOpen }) => {
  return (
    <div className="w-full h-[70px] bg-white border-b border-gray-200 px-4 lg:px-8 flex items-center justify-between shadow-sm">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">

        {/* MOBILE MENU BUTTON */}
        <button
          className="lg:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu size={28} className="text-gray-700" />
        </button>

        {/* USER NAME */}
        <div className="flex items-center gap-2">
          <LogOut size={16} className="text-gray-700" />

          <span className="font-medium text-gray-700 text-sm lg:text-base">
            Madhusha
          </span>
        </div>
      </div>

      {/* CENTER LOGO */}
      <div className="hidden md:flex items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 flex items-center justify-center text-purple-500 font-bold">
          M
        </div>

        <h1 className="font-bold text-gray-800 text-lg">
          MediLab Hospital
        </h1>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">

        {/* USER */}
        <div className="hidden sm:flex items-center gap-2">
          <User size={16} className="text-gray-700" />

          <span className="text-sm font-medium text-purple-600">
            Prasad
          </span>
        </div>

        {/* PROFILE IMAGE */}
        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
        />
      </div>
    </div>
  );
};

export default Navbar;