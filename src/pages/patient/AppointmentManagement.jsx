import React, { useState, useEffect } from "react";
import { 
  CalendarDays, 
  Clock3, 
  Search, 
  Plus, 
  X, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Loader2, 
  MapPin, 
  FileText,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { getAppointments, createAppointment } from "../../services/appointmentService";
import { getStaff } from "../../services/staffService";

function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [search, setSearch] = useState("");

  // Visual success micro-interaction animation states
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [animationMessage, setAnimationMessage] = useState("");

  const [newAppt, setNewAppt] = useState({
    assignedDoctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    address: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const patientId = localStorage.getItem("patient_uid");
      
      const [allAppointments, allStaff] = await Promise.all([
        getAppointments(),
        getStaff()
      ]);

      const myAppointments = allAppointments.filter(a => a.patientId === patientId);
      setAppointments(myAppointments);

      const activeDoctors = allStaff.filter(s => s.role?.toLowerCase() === "doctor");
      setDoctors(activeDoctors);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Triggers the non-blocking visual feedback modal overlay
  const triggerSuccessFeedback = (message) => {
    setAnimationMessage(message);
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 2400);
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedDoctor = doctors.find(d => d.id === newAppt.assignedDoctorId);
      
      const payload = {
        ...newAppt,
        doctorName: `Dr. ${selectedDoctor?.firstName} ${selectedDoctor?.lastName}`,
        patientId: localStorage.getItem("patient_uid"),
        patientName: localStorage.getItem("patient_name"),
        status: "Pending",
        createdAt: new Date().toISOString()
      };
      
      await createAppointment(payload);
      setIsBooking(false);
      setNewAppt({ assignedDoctorId: "", appointmentDate: "", appointmentTime: "", address: "" });
      
      // Fire the beautiful pop feedback overlay
      triggerSuccessFeedback("Schedule Request Submitted for Practitioner Review!");
      
      fetchData();
    } catch (error) {
      console.error("Booking submission error:", error);
      alert("Failed to securely route appointment slot parameters.");
    }
  };

  const filteredAppointments = appointments.filter((appt) =>
    appt.doctorName?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusDetails = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
          icon: <CheckCircle2 size={14} className="text-emerald-600" />
        };
      case "cancelled":
        return {
          bg: "bg-rose-50 text-rose-700 border-rose-200/60",
          icon: <XCircle size={14} className="text-rose-600" />
        };
      case "completed":
        return {
          bg: "bg-blue-50 text-blue-700 border-blue-200/60",
          icon: <CheckCircle2 size={14} className="text-blue-600" />
        };
      case "pending":
      default:
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200/60",
          icon: <AlertCircle size={14} className="text-amber-600" />
        };
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 font-sans">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-16 h-16 bg-indigo-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
          <Loader2 className="relative animate-spin text-indigo-600 z-10" size={44} />
        </div>
        <p className="text-slate-500 text-sm font-medium tracking-wide animate-pulse">Syncing schedules...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 bg-slate-50/40 min-h-screen relative font-sans antialiased text-slate-800">
      
      {/* ── BEAUTIFUL SUCCESS INTERACTION OVERLAY MODAL ── */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-emerald-100 flex flex-col items-center max-w-sm w-full mx-4 text-center transform scale-100 transition-transform duration-300 animate-scaleUp">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-4 shadow-inner animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Slot Reserved</h3>
            <p className="text-sm font-medium text-slate-500 animate-pulse leading-relaxed">{animationMessage}</p>
          </div>
        </div>
      )}

      {/* HEADER ACTION BANNER */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 md:p-8 text-white shadow-xl shadow-indigo-600/10 border border-white/10 animate-fadeIn">
        <div className="absolute -right-6 -bottom-10 opacity-10 pointer-events-none">
          <CalendarDays size={240} />
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-3 text-xs font-semibold tracking-wider uppercase text-indigo-100">
              <Sparkles size={12} className="text-amber-300" />
              <span>Real-time Scheduling</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">My Appointments</h1>
            <p className="mt-1.5 text-sm text-indigo-100/80 font-light max-w-md">
              Book new consultations, monitor approvals, and review past visits cleanly in one secure pane.
            </p>
          </div>
          
          <button 
            onClick={() => setIsBooking(true)}
            className="self-start sm:self-center bg-white text-indigo-700 hover:text-white hover:bg-white/10 hover:backdrop-blur-md border border-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2.5 transition-all duration-300 active:scale-95 shadow-lg shadow-black/10 group text-sm"
          >
            <Plus size={18} className="transform group-hover:rotate-90 transition-transform duration-300" /> 
            <span>Book New Slot</span>
          </button>
        </div>
      </div>

      {/* FILTER SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-md shadow-slate-200/30 flex items-center gap-3 transition-all focus-within:border-indigo-400">
        <Search size={20} className="text-slate-400 ml-2" />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter appointments by physician name..." 
          className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm focus:outline-none font-medium"
        />
        {search && (
          <button onClick={() => setSearch("")} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition">
            <X size={16} />
          </button>
        )}
      </div>

      {/* APPOINTMENTS DATA WRAPPER */}
      {filteredAppointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-slate-100 shadow-sm transform transition-all duration-300 animate-slideUp">
          <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-500 mb-4">
            <CalendarDays size={36} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No scheduled visits matching records</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-xs">You don't have any appointments currently running under this metric filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden transform transition-all duration-300 animate-slideUp">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4.5">Medical Staff</th>
                  <th className="px-6 py-4.5">Schedule Date</th>
                  <th className="px-6 py-4.5">Target Time</th>
                  <th className="px-6 py-4.5">Status Label</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredAppointments.map((appt) => {
                  const statusDetails = getStatusDetails(appt.status);
                  return (
                    <tr key={appt.id} className="group hover:bg-slate-50/40 transition-colors duration-200">
                      <td className="px-6 py-4.5 font-semibold text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
                            {appt.doctorName ? appt.doctorName.replace("Dr. ", "").charAt(0) : "D"}
                          </div>
                          <span className="group-hover:text-indigo-600 transition-colors duration-200">
                            {appt.doctorName || "Assigned Specialist"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5">
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg">
                          <CalendarDays size={13} className="text-slate-400" />
                          {appt.appointmentDate}
                        </span>
                      </td>
                      <td className="px-6 py-4.5">
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg">
                          <Clock3 size={13} className="text-slate-400" />
                          {appt.appointmentTime}
                        </span>
                      </td>
                      <td className="px-6 py-4.5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-200 ${statusDetails.bg}`}>
                          {statusDetails.icon}
                          {appt.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BOOKING INTERACTIVE SLIDE-OVER / MODAL GLASSMORPHISM */}
      {isBooking && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col transform animate-scaleUp duration-300">
            
            {/* Modal Head */}
            <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Request Appointment</h2>
                  <p className="text-xs text-slate-400">Slots are subject to practitioner validation</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsBooking(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleBookSubmit} className="p-6 space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Medical Professional</label>
                <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 hover:bg-slate-50 focus-within:border-indigo-500 transition-colors">
                  <select 
                    required 
                    className="w-full bg-transparent p-3.5 pr-10 text-sm text-slate-700 font-medium focus:outline-none appearance-none cursor-pointer"
                    onChange={(e) => setNewAppt({...newAppt, assignedDoctorId: e.target.value})}
                  >
                    <option value="">Choose a Doctor</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        Dr. {doc.firstName} {doc.lastName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred Date</label>
                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 hover:bg-slate-50 focus-within:border-indigo-500 transition-colors">
                    <input 
                      required 
                      type="date" 
                      className="w-full bg-transparent p-3.5 text-sm text-slate-700 font-medium focus:outline-none cursor-pointer" 
                      onChange={(e) => setNewAppt({...newAppt, appointmentDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred Time</label>
                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 hover:bg-slate-50 focus-within:border-indigo-500 transition-colors">
                    <input 
                      required 
                      type="time" 
                      className="w-full bg-transparent p-3.5 text-sm text-slate-700 font-medium focus:outline-none cursor-pointer" 
                      onChange={(e) => setNewAppt({...newAppt, appointmentTime: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Appointment Notes / Symptoms</label>
                <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 hover:bg-slate-50 focus-within:border-indigo-500 transition-colors">
                  <textarea 
                    placeholder="Briefly describe the purpose of your checkup or any persistent symptoms..." 
                    rows={3}
                    className="w-full bg-transparent p-3.5 pr-10 text-sm text-slate-700 placeholder-slate-400 font-medium focus:outline-none resize-none" 
                    onChange={(e) => setNewAppt({...newAppt, address: e.target.value})}
                  />
                  <div className="absolute right-4 bottom-4 text-slate-300 pointer-events-none">
                    <FileText size={16} />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button 
                  type="button"
                  onClick={() => setIsBooking(false)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold transition-colors active:scale-95 transform"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-bold transition shadow-md shadow-indigo-600/10 active:scale-95 transform"
                >
                  Submit Schedule Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentManagement;