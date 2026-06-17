import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Clock3,
  Trash2,
  FileText,
  User,
  MapPin,
  CheckCircle,
  Receipt,
  Edit2,
  CheckCircle2
} from "lucide-react";
import {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment
} from "../../services/appointmentService";
import { getStaff } from "../../services/staffService";
import { getPatients } from "../../services/patientService";

function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(false);
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  
  const [patientSearch, setPatientSearch] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  // Animation state banner triggers
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [animationMessage, setAnimationMessage] = useState("");

  // Form State modified to securely record assignedDoctorId
  const [formData, setFormData] = useState({
    id: "", 
    patientId: "",
    patientName: "",
    appointmentDate: "",
    appointmentTime: "",
    doctorName: "Doctor Name",
    assignedDoctorId: "", // Secure link key added
    address: "" 
  });

  const initData = async () => {
    setLoading(true);
    try {
      const [apptData, staffData, patientData] = await Promise.all([
        getAppointments(),
        getStaff(),
        getPatients()
      ]);

      setAppointments(apptData);
      setPatients(patientData);
      
      const activeDoctors = staffData.filter(
        (member) => member.role?.toLowerCase() === "doctor"
      );
      setDoctors(activeDoctors);
    } catch (error) {
      console.error("Initialization failure:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const handlePatientSearchChange = (e) => {
    const value = e.target.value;
    setPatientSearch(value);

    if (value.trim() === "") {
      setFilteredPatients([]);
      setShowPatientDropdown(false);
      return;
    }

    const matches = patients.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      return (
        fullName.includes(value.toLowerCase()) || 
        (p.nic && p.nic.toLowerCase().includes(value.toLowerCase()))
      );
    });

    setFilteredPatients(matches);
    setShowPatientDropdown(true);
  };

  const handleSelectPatient = (patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`;
    setSelectedPatient(patient);
    setPatientSearch(`${patient.firstName} ${patient.lastName} (NIC: ${patient.nic || "N/A"})`);
    setShowPatientDropdown(false);
    
    setFormData((prev) => ({
      ...prev,
      patientId: patient.id,
      patientName: fullName
    }));
  };

  const handleDoctorChange = (e) => {
    const selectedId = e.target.value;
    
    if (selectedId === "Doctor Name") {
      setFormData((prev) => ({
        ...prev,
        doctorName: "Doctor Name",
        assignedDoctorId: ""
      }));
      return;
    }

    const matchedDoc = doctors.find((doc) => doc.id === selectedId);
    if (matchedDoc) {
      setFormData((prev) => ({
        ...prev,
        assignedDoctorId: matchedDoc.id,
        doctorName: `Dr. ${matchedDoc.firstName} ${matchedDoc.lastName}`
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setFormData({
      id: "",
      patientId: "",
      patientName: "",
      appointmentDate: "",
      appointmentTime: "",
      doctorName: "Doctor Name",
      assignedDoctorId: "",
      address: ""
    });
    setPatientSearch("");
    setSelectedPatient(null);
  };

  // Triggers the non-blocking visual micro-interaction overlay
  const triggerSuccessFeedback = (message) => {
    setAnimationMessage(message);
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 2200);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.patientId) {
      alert("Validation Error: Please select a registered patient from the search suggestions.");
      return;
    }
    if (!formData.assignedDoctorId) {
      alert("Validation Error: Please select an assigned physician.");
      return;
    }

    try {
      setLoading(true);
      const { id, ...payload } = formData;
      await createAppointment(payload);
      clearForm();
      triggerSuccessFeedback("Clinical Appointment Booked Successfully!");
      const apptData = await getAppointments();
      setAppointments(apptData);
    } catch (error) {
      alert("Failed creating new database appointment entry.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    if (!formData.id) {
      alert("Please choose an appointment record from the directory table below first.");
      return;
    }
    try {
      setLoading(true);
      const { id, ...updatedPayload } = formData;
      await updateAppointment(id, updatedPayload);
      clearForm();
      triggerSuccessFeedback("Schedule Parameters Updated Flawlessly!");
      const apptData = await getAppointments();
      setAppointments(apptData);
    } catch (error) {
      alert("Failed updating document records.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, event) => {
    if (event) event.stopPropagation();
    if (window.confirm("Drop this scheduling index entry permanently?")) {
      try {
        setLoading(true);
        await deleteAppointment(id);
        triggerSuccessFeedback("Schedule Index Entry Dropped and Purged.");
        if (formData.id === id) clearForm();
        const apptData = await getAppointments();
        setAppointments(apptData);
      } catch (error) {
        alert("Execution targets failed on file deletion commands.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelectRow = (appt) => {
    setFormData({
      id: appt.id,
      patientId: appt.patientId || "",
      patientName: appt.patientName || "",
      appointmentDate: appt.appointmentDate || "",
      appointmentTime: appt.appointmentTime || "",
      doctorName: appt.doctorName || "Doctor Name",
      assignedDoctorId: appt.assignedDoctorId || "",
      address: appt.address || ""
    });

    const associatedPatient = patients.find((p) => p.id === appt.patientId);
    if (associatedPatient) {
      setSelectedPatient(associatedPatient);
      setPatientSearch(`${associatedPatient.firstName} ${associatedPatient.lastName}`);
    } else {
      setSelectedPatient(null);
      setPatientSearch(appt.patientName || "Linked Patient Profile");
    }
  };

  const filteredAppointments = appointments.filter((item) => {
    const nameMatch = item.patientName?.toLowerCase().includes(tableSearchQuery.toLowerCase());
    const doctorMatch = item.doctorName?.toLowerCase().includes(tableSearchQuery.toLowerCase());
    const idMatch = item.id?.toLowerCase().includes(tableSearchQuery.toLowerCase());
    return nameMatch || doctorMatch || idMatch;
  });

  // --- CDN-safe PDF Generator Function ---
  const generatePDF = () => {
    const { jsPDF } = window.jspdf || {};
    
    if (!jsPDF) {
      alert("PDF library is still loading from CDN. Please try again in a moment.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Appointments Report", 14, 15);
    
    doc.autoTable({
      startY: 25,
      head: [["Ref ID", "Patient Name", "Assigned Doctor", "Date", "Time", "Notes"]],
      body: filteredAppointments.map((item) => [
        item.id ? item.id.substring(0, 8) + '...' : 'N/A', 
        item.patientName || 'N/A', 
        item.doctorName || 'N/A', 
        item.appointmentDate || 'N/A', 
        item.appointmentTime || 'N/A', 
        item.address || 'N/A'
      ]),
    });
    
    doc.save("appointments-report.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 font-sans antialiased text-gray-800 relative">
      
      {/* Success Micro-Interaction Notification Modal Backdrop */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-emerald-100 flex flex-col items-center max-w-sm mx-auto text-center transform scale-100 transition-transform duration-300">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-4 shadow-inner animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Schedule Synchronized</h3>
            <p className="text-sm font-medium text-slate-500 animate-pulse">{animationMessage}</p>
          </div>
        </div>
      )}

      {/* Top Header Panel */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wide text-gray-900 flex items-center gap-2">
          <Calendar className="text-purple-600" size={22} />
          Appointment Management
        </h1>
        {loading && (
          <span className="text-purple-600 font-semibold animate-pulse text-xs bg-purple-50 px-3 py-1 rounded-lg">
            Syncing registry...
          </span>
        )}
      </div>

      {/* Main Control Panel Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 mb-6 max-w-7xl mx-auto">
        
        {/* Action Button & Search Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-2 rounded-lg">
            {formData.id ? `⚠️ Editing Appointment Ref: ${formData.id.substring(0, 8)}...` : "✨ Scheduling New Entry"}
          </div>

          <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-3">
            <button 
              onClick={generatePDF}
              type="button"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:from-purple-700 hover:to-indigo-600 transition-all transform active:scale-95 text-sm"
            >
              <FileText size={18} /> Generate Report
            </button>
            <div className="relative w-full sm:w-64 flex items-center">
              <span className="absolute left-3 text-gray-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search Patient, Doctor, or ID"
                value={tableSearchQuery}
                onChange={(e) => setTableSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        {/* Form Inputs Component */}
        <form onSubmit={formData.id ? handleUpdate : handleRegister}>
          <div className="space-y-5">
            
            {/* Patient Picker Field */}
            <div className="relative">
              <div className="relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors bg-white">
                <span className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Type Patient Name or NIC number to lookup record profiles..."
                  value={patientSearch}
                  onChange={handlePatientSearchChange}
                  onFocus={() => patientSearch.trim() && setShowPatientDropdown(true)}
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-gray-700 focus:outline-none placeholder-gray-400 text-sm"
                />
              </div>

              {/* Dynamic Suggestions Dropdown overlay matching layout structures */}
              {showPatientDropdown && filteredPatients.length > 0 && (
                <div className="absolute z-50 w-full bg-white border border-gray-200 mt-1 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-gray-100">
                  {filteredPatients.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPatient(p)}
                      className="p-3 hover:bg-purple-50 cursor-pointer flex justify-between items-center transition text-sm"
                    >
                      <div>
                        <span className="font-semibold text-gray-800">{p.firstName} {p.lastName}</span>
                        <span className="text-xs text-gray-400 block">{p.email || "No Email"}</span>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-600">
                        NIC: {p.nic || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {showPatientDropdown && filteredPatients.length === 0 && (
                <div className="absolute z-50 w-full bg-white border border-gray-200 mt-1 p-4 rounded-xl shadow-xl text-center text-sm text-gray-400">
                  No registered matching patient profiles found.
                </div>
              )}
            </div>

            {/* Profile Connected Context Alert Box */}
            {selectedPatient && (
              <div className="bg-purple-50 border border-purple-100 p-3.5 rounded-xl flex items-start gap-2.5 text-purple-900 text-sm animate-fadeIn">
                <CheckCircle size={18} className="text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Patient Profile Attached & Verified</p>
                  <p className="text-xs text-purple-700 mt-0.5">
                    Mobile: {selectedPatient.mobile || "N/A"} | DOB: {selectedPatient.dob || "N/A"} | Reference UID: {selectedPatient.id}
                  </p>
                </div>
              </div>
            )}

            {/* Form Fields Column Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors bg-white">
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-transparent text-gray-700 focus:outline-none text-sm cursor-pointer"
                />
              </div>

              <div className="relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors bg-white">
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-transparent text-gray-700 focus:outline-none text-sm cursor-pointer"
                />
              </div>

              <div className="relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors bg-white">
                <select
                  name="assignedDoctorId"
                  value={formData.assignedDoctorId || "Doctor Name"}
                  onChange={handleDoctorChange}
                  required
                  className="w-full px-4 py-3 bg-transparent text-gray-700 focus:outline-none appearance-none cursor-pointer text-sm"
                >
                  <option value="Doctor Name">Select Doctor Name</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      Dr. {doc.firstName} {doc.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Directives Area */}
            <div className="relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors bg-white">
              <span className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                <MapPin size={18} />
              </span>
              <textarea
                rows="2"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Notes or Location Directives (e.g., Room 304, Consultation Wing B)"
                className="w-full pl-11 pr-4 py-3 bg-transparent text-gray-700 focus:outline-none placeholder-gray-400 resize-none text-sm"
              />
            </div>

            {/* Action Buttons Hub Layout */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto pt-4">
              <button 
                type="submit"
                className="w-full py-3.5 text-white font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm"
              >
                <Calendar size={18} />
                {formData.id ? "Update Schedule Parameters" : "Book Clinical Appointment"}
              </button>
              
              {formData.id && (
                <button 
                  type="button"
                  onClick={clearForm}
                  className="w-full sm:w-auto px-6 py-3.5 text-gray-500 hover:text-gray-700 border-2 border-gray-300 hover:border-gray-400 font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Synchronized Recent Appointments Table Registry */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 max-w-7xl mx-auto overflow-hidden">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Appointments Registry</h2>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider w-24 text-center">Booking Ref</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Patient Name</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Assigned Doctor</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider text-center">Scheduled Date</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Scheduled Time</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Directives / Notes</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider text-center w-28">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-sm text-center text-gray-400">
                    No matching generated appointments found in this directory.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((item, index) => (
                  <tr 
                    key={item.id} 
                    onClick={() => handleSelectRow(item)}
                    className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${index % 2 === 1 ? 'bg-gray-50/30' : ''} ${formData.id === item.id ? 'bg-purple-50' : ''}`}
                  >
                    <td className="p-4 text-xs font-mono font-bold text-indigo-600 text-center" title={item.id}>
                      {item.id ? `${item.id.substring(0, 7)}...` : '—'}
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900">{item.patientName}</td>
                    <td className="p-4 text-sm text-gray-600">{item.doctorName}</td>
                    <td className="p-4 text-sm text-gray-600 text-center">{item.appointmentDate}</td>
                    <td className="p-4 text-sm text-gray-600">{item.appointmentTime}</td>
                    <td className="p-4 text-sm text-gray-400 italic truncate max-w-[180px]">{item.address || "—"}</td>

                    <td className="p-4 text-sm text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleSelectRow(item); }}
                          className="text-indigo-500 hover:text-indigo-700 p-1 rounded hover:bg-indigo-50 transition-colors"
                          title="Load Appointment Parameters"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => handleDelete(item.id, e)}
                          className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Void Schedule Block"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AppointmentManagement;