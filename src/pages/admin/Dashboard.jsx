import {
  Users,
  Stethoscope,
  Building2,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Check,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function Dashboard() {
  const stats = [
    {
      title: "Total Patient",
      value: 20,
      icon: Users,
    },
    {
      title: "Total Doctors",
      value: 20,
      icon: Stethoscope,
    },
    {
      title: "Total Wards",
      value: 20,
      icon: Building2,
    },
    {
      title: "Total Labs",
      value: 20,
      icon: FlaskConical,
    },
  ];

  const chartData = [
    { day: "Mon - 14", patients: 1400 },
    { day: "Tue - 15", patients: 2212 },
    { day: "Wed - 16", patients: 950 },
    { day: "Thu - 17", patients: 2200 },
    { day: "Fri - 18", patients: 1800 },
    { day: "Sat - 19", patients: 1250 },
    { day: "Sen - 20", patients: 1350 },
  ];

  const appointments = [
    {
      name: "Chance Vaccaro",
      date: "10.01.2003 12:54",
      status: "Pending",
    },
    {
      name: "Desirae Kanter",
      date: "04.12.2003 03:21",
      status: "Rejected",
    },
    {
      name: "Paiton Lubin",
      date: "10.01.2003 12:54",
      status: "Pending",
    },
    {
      name: "Phillip Bator",
      date: "04.12.2003 03:21",
      status: "Pending",
    },
    {
      name: "Emerson Stanton",
      date: "10.01.2003 12:54",
      status: "Accept",
    },
    {
      name: "Alfredo Rhiel Madsen",
      date: "03.08.2019 12:54",
      status: "Rejected",
    },
  ];

  const doctors = [
    {
      id: 1,
      name: "Sam",
      mobile: "0785553321",
      address: "Kalutara",
      charge: "2500.00",
      education: "MBBS",
      dob: "1984-04-13",
      status: "Online",
    },
    {
      id: 2,
      name: "John",
      mobile: "0724725839",
      address: "Kandy",
      charge: "2500.00",
      education: "Phd",
      dob: "1978-05-13",
      status: "Offline",
    },
    {
      id: 3,
      name: "David",
      mobile: "0764924539",
      address: "Galle",
      charge: "2500.00",
      education: "MBBS",
      dob: "1987-04-18",
      status: "Offline",
    },
    {
      id: 4,
      name: "Cristiano",
      mobile: "0764767839",
      address: "Matara",
      charge: "2500.00",
      education: "MBBS",
      dob: "1989-06-13",
      status: "Offline",
    },
  ];

  const medicines = [
    {
      id: 1,
      name: "Vitamin C",
      expire: "2025-04-13",
      manufacture: "2021-12-12",
      price: "1500.00",
      qty: 150,
    },
    {
      id: 2,
      name: "Paracetamol",
      expire: "2025-05-13",
      manufacture: "2022-04-04",
      price: "650.00",
      qty: 235,
    },
    {
      id: 3,
      name: "Actos",
      expire: "2026-01-15",
      manufacture: "2020-05-05",
      price: "5000.00",
      qty: 55,
    },
    {
      id: 4,
      name: "Amoxicillin",
      expire: "2024-12-13",
      manufacture: "2021-01-13",
      price: "1200.00",
      qty: 275,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 space-y-6 text-gray-700 max-w-[1600px] mx-auto overflow-hidden">
      
      {/* STATS TOP BAR: Safe container that horizontal scrolls if content overflows grid boundaries */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="grid grid-cols-4 gap-4 min-w-[640px] lg:min-w-0">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 border border-gray-100"
              >
                <div className="p-3 bg-gray-50 rounded-lg shrink-0">
                  <Icon className="w-6 h-6 text-gray-800" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 truncate">
                    {item.title}
                  </p>
                  <h2 className="font-bold text-xl text-gray-800 mt-0.5">
                    {item.value}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MID SECTION: CHART + APPOINTMENTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* PATIENTS CHART CARD */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 xl:col-span-2 flex flex-col justify-between overflow-x-auto">
          <div className="min-w-[450px]">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-gray-800 text-base sm:text-lg">paitents</h3>
              <select className="text-blue-500 text-xs sm:text-sm bg-transparent font-medium border-none outline-none cursor-pointer">
                <option>7 days</option>
              </select>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 mb-6 text-right font-mono">
              14.10.2021 - 20.10.2021
            </p>

            <div className="h-[240px] sm:h-[260px] relative w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} domain={[0, 3000]} ticks={[0, 1000, 1500, 2000, 2500, 3000]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="patients"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ r: 3, fill: "#3B82F6" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Aggregated Totals Footer */}
            <div className="grid grid-cols-3 text-left border-t border-gray-100 pt-4 mt-4">
              <div>
                <p className="text-xs text-gray-400 font-medium">All time</p>
                <p className="text-sm font-bold text-gray-700 mt-0.5">41 234</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">30 days</p>
                <p className="text-sm font-bold text-gray-700 mt-0.5">41 234</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">7 days</p>
                <p className="text-sm font-bold text-gray-700 mt-0.5">41 234</p>
              </div>
            </div>
          </div>
        </div>

        {/* APPOINTMENTS CARD */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-between overflow-x-auto">
          <div className="min-w-[340px] relative">
            
            {/* Popover actions */}
            <div className="absolute right-2 top-10 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-10 w-40 space-y-0.5">
              <button className="flex items-center gap-2.5 w-full px-2.5 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={14} /> Reject
              </button>
              <button className="flex items-center gap-2.5 w-full px-2.5 py-1.5 text-xs font-semibold text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Check size={14} /> Accept
              </button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-baseline gap-1.5">
                <h3 className="font-bold text-gray-800 text-base sm:text-lg">Appointments</h3>
                <span className="text-[10px] text-gray-400 font-normal">Two tab</span>
              </div>
            </div>

            {/* Simulated Table Header */}
            <div className="flex justify-between text-[11px] font-semibold text-gray-400 border-b border-gray-100 pb-2 mb-3 px-1">
              <span>First Name Last Name ▲▼</span>
              <span>Date 📅</span>
            </div>

            <div className="space-y-3.5">
              {appointments.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm px-1 gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-800 truncate">
                      {item.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <span className="text-xs text-gray-400 font-mono whitespace-nowrap">
                      {item.date}
                    </span>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 font-medium rounded-md w-16 text-center inline-block shrink-0 ${
                        item.status === "Accept"
                          ? "bg-green-100 text-green-600"
                          : item.status === "Rejected"
                          ? "bg-red-100 text-red-500"
                          : "bg-blue-100 text-blue-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-1.5 pt-6 mt-4 border-t border-gray-50 min-w-[340px]">
            <button className="p-1.5 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200">
              <ChevronLeft size={14} />
            </button>
            <button className="w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold shadow-sm">
              1
            </button>
            <button className="w-7 h-7 rounded-full text-gray-500 hover:bg-gray-100 text-xs font-semibold">
              2
            </button>
            <button className="w-7 h-7 rounded-full text-gray-500 hover:bg-gray-100 text-xs font-semibold">
              3
            </button>
            <span className="text-xs text-gray-400 px-0.5">...</span>
            <button className="w-7 h-7 rounded-full text-gray-500 hover:bg-gray-100 text-xs font-semibold">
              13
            </button>
            <button className="p-1.5 rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* RECENT DOCTORS TABLE */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 text-base sm:text-lg">Recent Doctors</h3>
          <p className="text-xs text-gray-400 mt-0.5">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[900px] text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-[11px] tracking-wider font-bold border-b border-gray-100">
                <th className="p-3 pl-4 w-14">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Address</th>
                <th className="p-3">Consultancy Charge</th>
                <th className="p-3">Education</th>
                <th className="p-3">DOB</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center w-14">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-600">
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 pl-4 font-semibold text-gray-400">{doctor.id}</td>
                  <td className="p-3 font-semibold text-gray-800">{doctor.name}</td>
                  <td className="p-3 font-mono text-xs">{doctor.mobile}</td>
                  <td className="p-3 text-gray-500">{doctor.address}</td>
                  <td className="p-3 font-mono font-medium">{doctor.charge}</td>
                  <td className="p-3">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">
                      {doctor.education}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-xs text-gray-400">{doctor.dob}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-semibold inline-block w-16 ${
                        doctor.status === "Online"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-400"
                      }`}
                    >
                      {doctor.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OUT OF STOCK MEDICINES TABLE */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 text-base sm:text-lg">Out of Stock</h3>
          <p className="text-xs text-gray-400 mt-0.5">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[750px] text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-[11px] tracking-wider font-bold border-b border-gray-100">
                <th className="p-3 pl-4 w-14">ID</th>
                <th className="p-3">Drug Name</th>
                <th className="p-3">Expire Date</th>
                <th className="p-3">Manufacture Date</th>
                <th className="p-3">Price</th>
                <th className="p-3">QTY</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-600">
              {medicines.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 pl-4 font-semibold text-gray-400">{item.id}</td>
                  <td className="p-3 font-semibold text-gray-800">{item.name}</td>
                  <td className="p-3 font-mono text-xs text-gray-500">{item.expire}</td>
                  <td className="p-3 font-mono text-xs text-gray-400">{item.manufacture}</td>
                  <td className="p-3 font-mono font-medium">{item.price}</td>
                  <td className="p-3 font-semibold text-gray-700">{item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;