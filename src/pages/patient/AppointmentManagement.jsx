import React, { useState, useEffect } from "react";
import { CalendarDays, Clock3, Search, Plus, X, User, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { getAppointments, createAppointment } from "../../services/appointmentService";
import { getStaff } from "../../services/staffService";

function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [search, setSearch] = useState("");

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
      alert("Appointment requested successfully!");
      setIsBooking(false);
      setNewAppt({ assignedDoctorId: "", appointmentDate: "", appointmentTime: "", address: "" });
      fetchData();
    } catch (error) {
      alert("Failed to request appointment.");
    }
  };

  const filteredAppointments = appointments.filter((appt) =>
    appt.doctorName?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    case "pending":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <button 
          onClick={() => setIsBooking(true)}
          className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus size={18} /> Book Appointment
        </button>
      </div>

      {/* Booking Modal */}
      {isBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Request New Appointment</h2>
              <X className="cursor-pointer" onClick={() => setIsBooking(false)}/>
            </div>
            <form onSubmit={handleBookSubmit} className="space-y-4">
              <select required className="w-full border rounded-xl p-3" onChange={(e) => setNewAppt({...newAppt, assignedDoctorId: e.target.value})}>
                <option value="">Select a Doctor</option>
                {doctors.map(doc => <option key={doc.id} value={doc.id}>Dr. {doc.firstName} {doc.lastName}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input required type="date" className="border rounded-xl p-3" onChange={(e) => setNewAppt({...newAppt, appointmentDate: e.target.value})}/>
                <input required type="time" className="border rounded-xl p-3" onChange={(e) => setNewAppt({...newAppt, appointmentTime: e.target.value})}/>
              </div>
              <textarea placeholder="Notes" className="w-full border rounded-xl p-3" onChange={(e) => setNewAppt({...newAppt, address: e.target.value})}/>
              <button type="submit" className="bg-indigo-600 text-white w-full py-3 rounded-xl font-bold">Submit Request</button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-6 py-4">Doctor</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appt) => (
              <tr key={appt.id} className="border-t">
                <td className="px-6 py-4">{appt.doctorName}</td>
                <td className="px-6 py-4">{appt.appointmentDate}</td>
                <td className="px-6 py-4">{appt.appointmentTime}</td>
<td className="px-6 py-4">
  <span
    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
      appt.status
    )}`}
  >
    {appt.status?.toLowerCase() === "confirmed" && (
      <CheckCircle2 size={14} />
    )}
    {appt.status?.toLowerCase() === "cancelled" && (
      <XCircle size={14} />
    )}
    {appt.status?.toLowerCase() === "completed" && (
      <CheckCircle2 size={14} />
    )}
    {(!appt.status ||
      appt.status?.toLowerCase() === "pending") && (
      <AlertCircle size={14} />
    )}

    {appt.status || "Pending"}
  </span>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AppointmentManagement;