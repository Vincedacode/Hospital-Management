import React from "react";
import {
  Search,
  Calendar,
  Clock3,
  Trash2,
  FileText,
  User,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

function AppointmentManagement() {
  return (
    <div className="bg-gray-100 p-3 sm:p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-4 sm:p-5">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
          Appointment Management
        </h1>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-md p-4 sm:p-5 lg:p-8">
        {/* Top Actions */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
          <button className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto shadow-md">
            <FileText size={18} />
            Generate Report
          </button>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <input
              type="text"
              placeholder="ID"
              className="border-2 border-gray-300 rounded-xl px-4 py-3 w-full sm:w-[280px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md">
              <Search size={18} />
              Search
            </button>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
          {/* First Name */}
          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="First Name"
              className="w-full border-2 border-gray-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Last Name */}
          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full border-2 border-gray-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border-2 border-gray-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Mobile */}
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Mobile Number"
              className="w-full border-2 border-gray-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* NIC */}
          <input
            type="text"
            placeholder="NIC"
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* DOB */}
          <div className="relative">
            <input
              type="date"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Calendar
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Gender, Appointment Date, Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-5">
          <select className="border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <div className="relative">
            <input
              type="date"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Calendar
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          <div className="relative">
            <input
              type="time"
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Clock3
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Department & Doctor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 mt-5">
          <div className="relative">
            <select className="w-full border-2 border-gray-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Department Name</option>
              <option>Cardiology</option>
              <option>Neurology</option>
              <option>Dental</option>
              <option>ENT</option>
            </select>
          </div>

          <div className="relative">
            <select className="w-full border-2 border-gray-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Doctor Name</option>
              <option>Dr. John Smith</option>
              <option>Dr. Sarah Wilson</option>
              <option>Dr. Michael Lee</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="relative mt-5">
          <MapPin size={18} className="absolute left-4 top-4 text-gray-400" />

          <textarea
            rows="5"
            placeholder="Address"
            className="w-full border-2 border-gray-300 rounded-xl pl-11 pr-4 pt-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <button className="w-full bg-gradient-to-r from-green-700 to-lime-500 text-white font-semibold py-3 rounded-xl shadow-md hover:scale-[1.02] transition">
            Register
          </button>

          <button className="w-full bg-gradient-to-r from-indigo-700 to-purple-500 text-white font-semibold py-3 rounded-xl shadow-md hover:scale-[1.02] transition">
            Update
          </button>

          <button className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold py-3 rounded-xl shadow-md hover:scale-[1.02] transition">
            Delete
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-md p-4 sm:p-5 lg:p-6 overflow-hidden">
        <h2 className="text-xl font-bold text-gray-800">
          Recent Appointments
        </h2>

        <p className="text-sm text-gray-500 mb-5">
          View recently registered appointments.
        </p>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full min-w-[850px] text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-4">ID</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Gender</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Mobile Number</th>
                <th className="text-left p-4">NIC</th>
                <th className="text-left p-4">DOB</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3, 4].map((item) => (
                <tr
                  key={item}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-4">{item}</td>
                  <td className="p-4">Madhusha</td>
                  <td className="p-4">Doctor</td>
                  <td className="p-4">Male</td>
                  <td className="p-4">madhusha@gmail.com</td>
                  <td className="p-4">078-6662216</td>
                  <td className="p-4">86262626</td>
                  <td className="p-4">1999-04-13</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Online
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="text-red-500 hover:text-red-700 transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AppointmentManagement;