import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  FileText,
  Clock3,
  Activity,
  Bell,
  Loader2,
  Sparkles,
  ChevronRight,
  Stethoscope
} from "lucide-react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

function Dashboard() {
  const [data, setData] = useState({
    appointments: [],
    invoices: [],
    loading: true,
  });

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const patientName = localStorage.getItem("patient_name");

    // Query 1: Appointments
    const apptQuery = query(
      collection(db, "appointments"),
      where("patientId", "==", currentUser.uid)
    );

    // Query 2: Invoices
    const invQuery = query(
      collection(db, "invoices"),
      where("patientName", "==", patientName)
    );

    const unsubscribeAppt = onSnapshot(apptQuery, (snap) => {
      const appts = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData((prev) => ({ ...prev, appointments: appts, loading: false }));
    });

    const unsubscribeInv = onSnapshot(invQuery, (snap) => {
      const invs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData((prev) => ({ ...prev, invoices: invs }));
    });

    return () => {
      unsubscribeAppt();
      unsubscribeInv();
    };
  }, []);

  if (data.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-16 h-16 bg-indigo-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <Loader2 className="relative animate-spin text-indigo-600 z-10" size={48} />
        </div>
        <p className="text-indigo-600 font-medium animate-pulse">Fetching your records...</p>
      </div>
    );
  }

  const completedVisits = data.appointments.filter(
    (a) => a.status === "Completed"
  ).length;
  
  const pendingInvoices = data.invoices.filter(
    (i) => (i.paymentStatus || "").toLowerCase() === "pending"
  ).length;

  return (
    <div className="space-y-8 p-4 md:p-6 bg-slate-50/50 min-h-screen">
      
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-8 md:p-10 text-white shadow-2xl shadow-indigo-500/20 transition-all duration-500 hover:shadow-indigo-500/40 border border-white/10 group">
        {/* Animated Background Elements */}
        <div className="absolute -right-10 -top-20 opacity-20 transition-transform duration-1000 group-hover:rotate-12 group-hover:scale-110">
          <Activity size={300} strokeWidth={1} />
        </div>
        <div className="absolute left-20 bottom-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 text-sm font-medium text-indigo-50">
              <Sparkles size={16} className="text-yellow-300" />
              <span>Patient Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Welcome Back 👋
            </h1>
            <p className="mt-3 text-lg text-indigo-100 max-w-xl font-light leading-relaxed">
              Here is your personal healthcare overview. Track appointments, view activity, and manage your billing all in one beautiful place.
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Upcoming Appointments"
          value={
            data.appointments.filter((a) => a.status !== "Completed").length
          }
          icon={CalendarDays}
          color="text-indigo-600"
          bg="bg-indigo-100"
          shadowColor="hover:shadow-indigo-500/20"
        />

        <StatCard
          title="Pending Invoices"
          value={pendingInvoices}
          icon={FileText}
          color="text-rose-600"
          bg="bg-rose-100"
          shadowColor="hover:shadow-rose-500/20"
        />

        <StatCard
          title="Completed Visits"
          value={completedVisits}
          icon={Activity}
          color="text-emerald-600"
          bg="bg-emerald-100"
          shadowColor="hover:shadow-emerald-500/20"
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* APPOINTMENTS */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Upcoming Appointments
                </h2>
                <p className="text-sm text-slate-500 mt-1">Your next scheduled visits</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-2xl">
                <CalendarDays size={24} className="text-indigo-600" />
              </div>
            </div>

            {data.appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Stethoscope size={48} className="text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">No appointments scheduled</h3>
                <p className="text-slate-500 mt-1 max-w-sm">You currently don't have any upcoming visits booked with your doctors.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.appointments.slice(0, 5).map((appt) => (
                  <div
                    key={appt.id}
                    className="group border border-slate-100 rounded-2xl p-5 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-transparent transition-all duration-300 hover:shadow-md hover:border-indigo-100 relative overflow-hidden cursor-pointer"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          {(appt.doctorName || "D").charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                            {appt.doctorName || "Doctor"}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 mt-1 text-sm font-medium text-slate-500">
                            <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                              <CalendarDays size={14} className="text-indigo-500" />
                              {appt.appointmentDate}
                            </span>

                            <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                              <Clock3 size={14} className="text-indigo-500" />
                              {appt.appointmentTime}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            appt.status === "Completed"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-amber-100 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {appt.status}
                        </span>
                        <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-500 transition-colors transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RECENT ACTIVITY SUMMARY */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">
              Activity Summary
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100/50 hover:scale-[1.02] transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-indigo-200/50 flex items-center justify-center mb-4">
                  <CalendarDays size={20} className="text-indigo-700" />
                </div>
                <p className="text-sm text-indigo-600/80 font-bold uppercase tracking-wider">
                  Total Bookings
                </p>
                <h3 className="text-3xl font-black mt-2 text-indigo-950">
                  {data.appointments.length}
                </h3>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100/50 hover:scale-[1.02] transition-transform duration-300">
                <div className="w-10 h-10 rounded-full bg-emerald-200/50 flex items-center justify-center mb-4">
                  <Activity size={20} className="text-emerald-700" />
                </div>
                <p className="text-sm text-emerald-600/80 font-bold uppercase tracking-wider">
                  Visits Cleared
                </p>
                <h3 className="text-3xl font-black mt-2 text-emerald-950">
                  {completedVisits}
                </h3>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-6 border border-rose-100/50 hover:scale-[1.02] transition-transform duration-300 col-span-2 md:col-span-1">
                <div className="w-10 h-10 rounded-full bg-rose-200/50 flex items-center justify-center mb-4">
                  <FileText size={20} className="text-rose-700" />
                </div>
                <p className="text-sm text-rose-600/80 font-bold uppercase tracking-wider">
                  Bills Pending
                </p>
                <h3 className="text-3xl font-black mt-2 text-rose-950">
                  {pendingInvoices}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-8">
          
          {/* PROFILE CARD */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 text-center relative overflow-hidden group">
            {/* Background design */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-100 to-purple-100 opacity-50"></div>
            
            <div className="relative">
              <div className="w-28 h-28 mx-auto rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-tr from-indigo-600 to-purple-600 font-black text-5xl border-4 border-white">
                  {localStorage.getItem("patient_name")?.charAt(0) || "U"}
                </div>
              </div>

              <h3 className="font-extrabold text-2xl mt-5 text-slate-800">
                {localStorage.getItem("patient_name") || "Guest User"}
              </h3>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider mt-3 border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Active Patient
              </div>
            </div>
          </div>

          {/* INVOICE ALERT */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2.5 rounded-xl ${pendingInvoices > 0 ? "bg-rose-100 animate-bounce" : "bg-emerald-100"}`}>
                <Bell size={20} className={pendingInvoices > 0 ? "text-rose-600" : "text-emerald-600"} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Billing Status
              </h3>
            </div>

            {pendingInvoices > 0 ? (
              <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-200 rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg hover:shadow-rose-100 transition-all">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-rose-500 opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity"></div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-rose-100 rounded-full">
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-rose-700">
                      {pendingInvoices} Pending Invoice{pendingInvoices > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-rose-600/80 mt-2 font-medium">
                      Action required. Please review and settle your outstanding bills to maintain a clear account.
                    </p>
                    
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-2xl p-6 hover:shadow-lg hover:shadow-emerald-100 transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-100 rounded-full">
                    <Activity size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-emerald-700">
                      All Caught Up!
                    </p>
                    <p className="text-sm text-emerald-600/80 mt-2 font-medium">
                      You have no outstanding bills. Your account is completely up to date.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg, shadowColor }) {
  return (
    <div className={`bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-200/50 flex items-center justify-between transition-all duration-300 hover:-translate-y-1.5 ${shadowColor} group`}>
      <div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <h2 className="text-4xl font-black mt-2 text-slate-800">{value}</h2>
      </div>
      <div className={`${bg} p-4 rounded-2xl ${color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon size={28} strokeWidth={2.5} />
      </div>
    </div>
  );
}

export default Dashboard;