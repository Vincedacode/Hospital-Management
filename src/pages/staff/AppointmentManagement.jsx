import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  Search,
  Clock3,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  Activity,
  Check,
  X
} from "lucide-react";

import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

function AppointmentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // Tracks which item is processing a status change
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const appointmentsRef = collection(db, "appointments");
    const q = query(appointmentsRef, where("assignedDoctorId", "==", currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const fetchedAppointments = [];
        let pendingCount = 0;
        let completedCount = 0;
        let cancelledCount = 0;

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          
          const rawStatus = data.status || "Pending";
          const normalizedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

          if (normalizedStatus === "Pending") pendingCount++;
          if (normalizedStatus === "Completed") completedCount++;
          if (normalizedStatus === "Cancelled") cancelledCount++;

          fetchedAppointments.push({
            id: docSnap.id,
            patient: data.patientName ? data.patientName.replace("Patient: ", "") : "Unknown Patient",
            doctor: data.doctorName || "Dr. Staff",
            date: data.appointmentDate || "—",
            time: data.appointmentTime || "—",
            status: normalizedStatus
          });
        });

        fetchedAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));

        setAppointments(fetchedAppointments);
        setStats({
          total: fetchedAppointments.length,
          pending: pendingCount,
          completed: completedCount,
          cancelled: cancelledCount
        });
      } catch (error) {
        console.error("Failed mapping appointment data:", error);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error("Firestore listener connection interrupted:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Update status handler targeting the dynamic document route path
  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      setUpdatingId(appointmentId);
      const appointmentDocRef = doc(db, "appointments", appointmentId);
      
      // Persist status updates instantly into Firestore core
      await updateDoc(appointmentDocRef, {
        status: newStatus
      });
    } catch (error) {
      console.error("Failed executing status modification query:", error);
      alert("Could not update status. Please verify permissions.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-sm font-semibold text-gray-500 tracking-wide">Syncing Medical Duty Schedules...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Activity className="text-indigo-600" size={24} /> Appointment Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review and manage upcoming patient schedules and appointment validation parameters.
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            Live Feed Active
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Appointments</p>
              <h2 className="text-3xl font-bold text-gray-800">{stats.total}</h2>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><CalendarDays size={22} /></div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Pending Visits</p>
              <h2 className="text-3xl font-bold text-gray-800">{stats.pending}</h2>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600"><Clock3 size={22} /></div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Completed Evaluations</p>
              <h2 className="text-3xl font-bold text-gray-800">{stats.completed}</h2>
            </div>
            <div className="p-3 bg-green-50 rounded-xl text-green-600"><CheckCircle size={22} /></div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Cancelled Schedules</p>
              <h2 className="text-3xl font-bold text-gray-800">{stats.cancelled}</h2>
            </div>
            <div className="p-3 bg-red-50 rounded-xl text-red-600"><XCircle size={22} /></div>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="relative max-w-md w-full">
            <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Appointment ID or Patient Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/40">
            <h2 className="font-bold text-gray-800 text-base">Active Clinical Logs</h2>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 text-left">Appointment ID Reference</th>
                  <th className="p-4 text-left">Patient Name</th>
                  <th className="p-4 text-left">Scheduled Date</th>
                  <th className="p-4 text-left">Scheduled Time</th>
                  <th className="p-4 text-left">Status Badge</th>
                  <th className="p-4 text-center">Manage Status Action Paths</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="p-4 font-mono text-xs text-indigo-600 font-bold select-all">
                        {appointment.id}
                      </td>
                      <td className="p-4 font-semibold text-gray-800">
                        {appointment.patient}
                      </td>
                      <td className="p-4 text-gray-600 font-medium">
                        {appointment.date}
                      </td>
                      <td className="p-4 text-gray-600 font-medium">
                        {appointment.time}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          {appointment.status === "Pending" ? (
                            <>
                              <button
                                disabled={updatingId !== null}
                                onClick={() => handleUpdateStatus(appointment.id, "Completed")}
                                className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
                              >
                                <Check size={14} /> Complete
                              </button>
                              <button
                                disabled={updatingId !== null}
                                onClick={() => handleUpdateStatus(appointment.id, "Cancelled")}
                                className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl text-xs font-bold transition disabled:opacity-50"
                              >
                                <X size={14} /> Cancel
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400 font-medium italic">
                              Dossier Locked
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-gray-400 font-medium">
                      No matching clinical schedules assigned under your doctor key query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card System View */}
          <div className="lg:hidden p-4 space-y-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 text-base">{appointment.patient}</h3>
                      <p className="text-xs font-mono text-indigo-500 mt-0.5">{appointment.id}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusStyle(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-600">
                    <p><strong>Scheduled Date:</strong> {appointment.date}</p>
                    <p><strong>Scheduled Time Room:</strong> {appointment.time}</p>
                  </div>

                  {/* Actions Grid Block on Mobile */}
                  {appointment.status === "Pending" ? (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        disabled={updatingId !== null}
                        onClick={() => handleUpdateStatus(appointment.id, "Completed")}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl flex justify-center items-center gap-1 text-xs font-bold transition shadow-sm"
                      >
                        <Check size={14} /> Complete
                      </button>
                      <button
                        disabled={updatingId !== null}
                        onClick={() => handleUpdateStatus(appointment.id, "Cancelled")}
                        className="bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl flex justify-center items-center gap-1 text-xs font-bold transition"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="text-center text-xs text-gray-400 italic bg-gray-50 py-1.5 rounded-lg border border-dashed">
                      Dossier Log Closed
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm font-medium">
                No matching clinical schedules assigned under your doctor key query.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AppointmentManagement;