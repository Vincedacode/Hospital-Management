import React, { useState, useEffect } from "react";
import {
  CalendarDays, FileText, Clock3, Activity, UserRound, Bell, Loader2
} from "lucide-react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

function Dashboard() {
  const [data, setData] = useState({
    appointments: [],
    invoices: [],
    loading: true
  });

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const patientName = localStorage.getItem("patient_name");

    // Query 1: Appointments
    const apptQuery = query(collection(db, "appointments"), where("patientId", "==", currentUser.uid));
    
    // Query 2: Invoices
    const invQuery = query(collection(db, "invoices"), where("patientName", "==", patientName));

    const unsubscribeAppt = onSnapshot(apptQuery, (snap) => {
      const appts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(prev => ({ ...prev, appointments: appts, loading: false }));
    });

    const unsubscribeInv = onSnapshot(invQuery, (snap) => {
      const invs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(prev => ({ ...prev, invoices: invs }));
    });

    return () => {
      unsubscribeAppt();
      unsubscribeInv();
    };
  }, []);

  if (data.loading) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;
  }

  const completedVisits = data.appointments.filter(a => a.status === "Completed").length;
 const pendingInvoices = data.invoices.filter(
  i => (i.paymentStatus || "").toLowerCase() === "pending"
).length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl p-6 border shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back 👋</h1>
          <p className="text-gray-500 mt-1">Overview of your health activity</p>
        </div>
        <Bell size={20} className="text-gray-400" />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="Upcoming Appts" value={data.appointments.filter(a => a.status !== "Completed").length} icon={CalendarDays} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard title="Pending Invoices" value={pendingInvoices} icon={FileText} color="text-red-600" bg="bg-red-50" />
        <StatCard title="Completed Visits" value={completedVisits} icon={Activity} color="text-green-600" bg="bg-green-50" />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>
          <div className="space-y-3">
            {data.appointments.slice(0, 3).map((a) => (
              <div key={a.id} className="flex justify-between items-center p-4 border rounded-xl">
                <div>
                  <p className="font-semibold">{a.doctorName || "Doctor"}</p>
                  <p className="text-sm text-gray-500">{a.appointmentDate} at {a.appointmentTime}</p>
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">{a.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border shadow-sm text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold">
              {localStorage.getItem("patient_name")?.[0]}
            </div>
            <h3 className="mt-3 font-semibold">{localStorage.getItem("patient_name")}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-3xl font-bold mt-1 text-gray-900">{value}</h2>
      </div>
      <div className={`${bg} p-3 rounded-xl ${color}`}>
        <Icon size={22} />
      </div>
    </div>
  );
}

export default Dashboard;