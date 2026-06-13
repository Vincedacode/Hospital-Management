import React, { useState, useEffect } from "react";
import {
  Users,
  Stethoscope,
  Building2,
  FlaskConical,
  Trash2,
  AlertTriangle,
  RefreshCw
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

// Firebase Service Layer Modules Implementation
import { getMedicines } from "../../services/medicineService";
import { getPatients } from "../../services/patientService";
import { getAppointments, updateAppointment } from "../../services/appointmentService";
import { getStaff, deleteStaff } from "../../services/staffService";

function Dashboard() {
  // --- Core State Registries ---
  const [stats, setStats] = useState([
    { title: "Total Patients", value: 0, icon: Users },
    { title: "Total Doctors", value: 0, icon: Stethoscope },
    { title: "Total Wards", value: 0, icon: Building2 },
    { title: "Total Labs", value: 0, icon: FlaskConical },
  ]);

  const [chartData, setChartData] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [urgentMedicines, setUrgentMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- Process Date Field from Firestore (Handles Native JS Dates & serverTimestamps) ---
  const parseFirestoreTimestamp = (timestampField) => {
    if (!timestampField) return new Date();
    if (timestampField.seconds) {
      return new Date(timestampField.seconds * 1000);
    }
    return new Date(timestampField);
  };

  // --- Real Database Data Fetching and Metrics Compiling ---
  const syncDashboardData = async (showMinimalLoader = false) => {
    try {
      if (showMinimalLoader) setRefreshing(true);
      else setLoading(true);

      // Fetch collections from Firestore concurrently
      const [allMedicines, allPatients, allAppointments, allStaff] = await Promise.all([
        typeof getMedicines === "function" ? getMedicines() : [],
        typeof getPatients === "function" ? getPatients() : [],
        typeof getAppointments === "function" ? getAppointments() : [],
        typeof getStaff === "function" ? getStaff() : [],
      ]);

      // 1. Filter Staff down to Doctors only
      const parsedDoctors = allStaff.filter(
        (member) => 
          member.role?.toLowerCase() === "doctor" || 
          member.title?.toLowerCase() === "doctor" ||
          member.education?.includes("MBBS") ||
          member.charge
      );

      // Sort chronologically and slice down to exactly 5 recent doctor profiles
      const recentDoctors = parsedDoctors
        .map((doc) => ({
          ...doc,
          // Robust checking mechanisms resolving the "Dr. Unspecified" registration bug
          computedName: doc.name || doc.staffName || doc.practitionerName || 
                        (doc.firstName ? `Dr. ${doc.firstName} ${doc.lastName || ''}` : "Dr. Unspecified"),
          resolvedDate: parseFirestoreTimestamp(doc.createdAt || doc.joinedDate)
        }))
        .sort((a, b) => b.resolvedDate - a.resolvedDate)
        .slice(0, 5);

      // 2. Compute KPI Counter Quantities
      setStats([
        { title: "Total Patients", value: allPatients.length, icon: Users },
        { title: "Total Doctors", value: parsedDoctors.length, icon: Stethoscope },
        { title: "Total Wards", value: 12, icon: Building2 }, 
        { title: "Total Labs", value: 8, icon: FlaskConical },
      ]);

      // 3. Render Patient Weekly Volume distributed over chart nodes
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayCounts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

      allPatients.forEach((patient) => {
        const dateSource = parseFirestoreTimestamp(patient.createdAt);
        if (!isNaN(dateSource.getTime())) {
          const dayName = daysOfWeek[dateSource.getDay()];
          dayCounts[dayName] += 1;
        }
      });

      const processedChartData = daysOfWeek.map((day) => ({
        day: day,
        patients: dayCounts[day],
      }));
      setChartData(processedChartData);

      // 4. Sort and Format Latest Appointments Queue (Includes matching fallbacks for name strings)
      const organizedAppointments = allAppointments
        .map((app) => ({
          ...app,
          resolvedDateObject: parseFirestoreTimestamp(app.date || app.createdAt),
        }))
        .sort((a, b) => b.resolvedDateObject - a.resolvedDateObject)
        .slice(0, 6); 

      setAppointments(organizedAppointments);
      setDoctors(recentDoctors);

      // 5. Dynamic combined filtering for Low Stock (< 60 units) OR Expired medicines
      const today = new Date();
      const flagUrgentMedicines = allMedicines.filter((med) => {
        const isLowStock = Number(med.qty || 0) < 60;
        
        let isExpired = false;
        if (med.expire) {
          const expiryDate = new Date(med.expire);
          isExpired = !isNaN(expiryDate.getTime()) && expiryDate < today;
        }
        
        return isLowStock || isExpired;
      });
      setUrgentMedicines(flagUrgentMedicines);

    } catch (error) {
      console.error("Critical database sync failure inside application dashboard layout:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    syncDashboardData();
  }, []);

  // --- Interactive State Modifications ---
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      if (typeof updateAppointment === "function") {
        await updateAppointment(id, { status: newStatus });
        setAppointments((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error("Failed to alter processing status attribute flag:", err);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm("Purge selected clinician credential logs from storage?")) {
      try {
        if (typeof deleteStaff === "function") {
          await deleteStaff(id);
          setDoctors((prev) => prev.filter((doc) => doc.id !== id));
          setStats((prev) =>
            prev.map((s) => (s.title === "Total Doctors" ? { ...s, value: s.value - 1 } : s))
          );
        }
      } catch (err) {
        console.error("Error running practitioner deletion command routine:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-500 tracking-wide">Syncing Clinical Ledger Indices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 space-y-6 text-gray-700 max-w-[1600px] mx-auto overflow-hidden font-sans">
      
      {/* HEADER CONTROLS */}
      <div className="flex justify-between items-center pb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Clinical Operations Command</h1>
          <p className="text-xs text-gray-400 mt-0.5">Real-time telemetry and database ingestion logs.</p>
        </div>
        <button
          onClick={() => syncDashboardData(true)}
          disabled={refreshing}
          className="p-2 bg-white hover:bg-gray-50 text-gray-600 rounded-xl border border-gray-100 shadow-sm transition-all flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin text-purple-600" : ""} />
          {refreshing ? "Refreshing..." : "Sync Database"}
        </button>
      </div>

      {/* STATS TOP BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 border border-gray-100"
            >
              <div className="p-3 bg-purple-50 rounded-lg shrink-0">
                <Icon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-400 truncate">{item.title}</p>
                <h2 className="font-bold text-2xl text-gray-800 mt-0.5">
                  {item.value.toLocaleString()}
                </h2>
              </div>
            </div>
          );
        })}
      </div>

      {/* MID SECTION: CHART + APPOINTMENTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* PATIENTS CHART CARD */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 xl:col-span-2 flex flex-col justify-between overflow-x-auto">
          <div className="min-w-[440px] sm:min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-gray-800 text-base sm:text-lg">Real Patient Registrations</h3>
              <span className="text-purple-600 text-xs bg-purple-50 px-2.5 py-1 rounded-md font-semibold">
                Live Data Feed
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 mb-6 text-right font-mono">
              In-patient Volume Distributed Across Days
            </p>

            <div className="h-[260px] relative w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                  <Line
                    type="monotone"
                    dataKey="patients"
                    stroke="#7C3AED"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#7C3AED", strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* APPOINTMENTS CARD */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col justify-between w-full overflow-hidden">
          <div className="w-full relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-base sm:text-lg">Latest Appointments</h3>
            </div>

            <div className="flex justify-between text-[11px] font-semibold text-gray-400 border-b border-gray-100 pb-2 mb-3 px-1">
              <span>Patient Name</span>
              <span>Schedule Frame</span>
            </div>

            <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-1">
              {appointments.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">No booking appointments found.</p>
              ) : (
                appointments.map((item, index) => (
                  <div key={item.id || index} className="flex justify-between items-center text-sm px-1 gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {item.patientName || item.patient || item.name || "Anonymous Patient"}
                      </h4>
                      <div className="flex gap-2 mt-1">
                        <button 
                          onClick={() => handleUpdateStatus(item.id, "Accept")}
                          className="text-[10px] text-emerald-600 hover:underline font-medium"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(item.id, "Rejected")}
                          className="text-[10px] text-rose-500 hover:underline font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-right">
                      <span className="text-[11px] text-gray-400 font-mono">
                        {item.resolvedDateObject ? item.resolvedDateObject.toLocaleDateString(undefined, {month: '2-digit', day: '2-digit'}) : "N/A"}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 font-bold rounded-md w-16 text-center ${
                        item.status === "Accept" ? "bg-green-50 text-green-600" :
                        item.status === "Rejected" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"
                      }`}>
                        {item.status || "Pending"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RECENT DOCTORS TABLE */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-4">5 Recent Doctors Registered</h3>
        <div className="overflow-x-auto w-full">
          {doctors.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No matching doctor profiles indexed within staff logs.</p>
          ) : (
            <table className="w-full min-w-[700px] text-sm text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 text-gray-400 uppercase text-[11px] tracking-wider font-bold border-b border-gray-100">
                  <th className="p-3 pl-4 w-14">Ref ID</th>
                  <th className="p-3">Practitioner Name</th>
                  <th className="p-3">Mobile Contact</th>
                  <th className="p-3">Degree Profile</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center w-14">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {doctors.map((doctor) => {
                  // Advanced clean status evaluation logic block mapping
                  const rawStatus = typeof doctor.status === 'string' ? doctor.status.toLowerCase() : '';
                  const isAvailable = 
                    doctor.status === true || 
                    rawStatus === "online" || 
                    rawStatus === "active" || 
                    rawStatus === "available" ||
                    doctor.status === undefined;

                  return (
                    <tr key={doctor.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 pl-4 font-mono text-xs text-gray-400">...{String(doctor.id).substring(0, 5)}</td>
                      <td className="p-3 font-semibold text-gray-800">
                        {doctor.computedName}
                      </td>
                      <td className="p-3 font-mono text-xs">{doctor.mobile || doctor.phone || "N/A"}</td>
                      <td className="p-3">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded font-medium text-gray-600">
                          {doctor.education || doctor.degree || "MD / MBBS"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                        }`}>
                          {isAvailable ? "Available" : "On Leave"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button onClick={() => handleDeleteDoctor(doctor.id)} className="text-gray-400 hover:text-red-500 p-1 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* INVENTORY DEPLETION & EXPIRATION LOGS */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4 text-amber-600">
          <AlertTriangle size={20} />
          <h3 className="font-bold text-gray-800 text-base sm:text-lg">Critical Stock Alerts & Expired Inventory</h3>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[750px] text-sm text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 text-gray-400 uppercase text-[11px] tracking-wider font-bold border-b border-gray-100">
                <th className="p-3 pl-4 w-14">Batch ID</th>
                <th className="p-3">Drug Specification Name</th>
                <th className="p-3">Expire Threshold</th>
                <th className="p-3">Price</th>
                <th className="p-3">Available Volume Units</th>
                <th className="p-3 text-right pr-4">Condition Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600">
              {urgentMedicines.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-xs text-gray-400">All medical inventories safe and within standard parameters.</td>
                </tr>
              ) : (
                urgentMedicines.map((item) => {
                  const qtyVal = Number(item.qty || 0);
                  const isLow = qtyVal < 60;
                  
                  let isExpired = false;
                  if (item.expire) {
                    const expiryDate = new Date(item.expire);
                    isExpired = !isNaN(expiryDate.getTime()) && expiryDate < new Date();
                  }

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 pl-4 font-mono text-xs text-gray-400">...{String(item.id).substring(0, 5)}</td>
                      <td className="p-3 font-semibold text-gray-800">{item.name || "Unknown Medicine"}</td>
                      <td className="p-3 font-mono text-xs text-gray-500">{item.expire || "N/A"}</td>
                      <td className="p-3 font-mono font-medium">₦{Number(item.price || 0).toLocaleString()}</td>
                      <td className={`p-3 font-bold ${isLow ? "text-red-500" : "text-gray-700"}`}>
                        {qtyVal} units
                      </td>
                      <td className="p-3 text-right pr-4">
                        {isExpired ? (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 bg-red-100 text-red-700 rounded-md tracking-wide uppercase">
                            Expired
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md tracking-wide uppercase">
                            Low Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;