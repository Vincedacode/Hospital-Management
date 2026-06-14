import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Clock3,
  Trash2,
  FileText,
  User,
  MapPin,
  CheckCircle
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
    const fullName = `Patient: ${patient.firstName} ${patient.lastName}`;
    setSelectedPatient(patient);
    setPatientSearch(`${patient.firstName} ${patient.lastName} (NIC: ${patient.nic || "N/A"})`);
    setShowPatientDropdown(false);
    
    setFormData((prev) => ({
      ...prev,
      patientId: patient.id,
      patientName: fullName
    }));
  };

  // Intercepts doctor assignment selection to save both Name and UID parameters
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
      const apptData = await getAppointments();
      setAppointments(apptData);
    } catch (error) {
      alert("Failed creating new database appointment entry.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.id) {
      alert("Please choose an appointment record from the directory table below first.");
      return;
    }
    try {
      setLoading(true);
      const { id, ...updatedPayload } = formData;
      await updateAppointment(id, updatedPayload);
      clearForm();
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

  return (
    <div className="bg-gray-100 p-3 sm:p-4 lg:p-6 space-y-6">
      {/* Header Panel */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm p-4 sm:p-5 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
          Appointment Management
        </h1>
        {loading && (
          <span className="text-indigo-600 font-medium animate-pulse text-sm">
            Syncing registry files...
          </span>
        )}
      </div>

      {/* Booking Form Layout */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-md p-4 sm:p-5 lg:p-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
          <button className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto shadow-md">
            <FileText size={18} /> Generate Report
          </button>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <input
              type="text"
              placeholder="Search Table Directory"
              value={tableSearchQuery}
              onChange={(e) => setTableSearchQuery(e.target.value)}
              className="border-2 border-gray-300 rounded-xl px-4 py-3 w-full sm:w-[280px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="bg-yellow-400 hover:bg-yellow-50 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md">
              <Search size={18} /> Search
            </button>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Patient Selection Row */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Find Registered Patient
            </label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Type Patient Name or NIC number to lookup record profiles..."
                value={patientSearch}
                onChange={handlePatientSearchChange}
                onFocus={() => patientSearch.trim() && setShowPatientDropdown(true)}
                className="w-full border-2 border-gray-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Live Search Matching Dropdown */}
            {showPatientDropdown && filteredPatients.length > 0 && (
              <div className="absolute z-50 w-full bg-white border border-gray-200 mt-1 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-gray-100">
                {filteredPatients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPatient(p)}
                    className="p-3 hover:bg-indigo-50 cursor-pointer flex justify-between items-center transition"
                  >
                    <div>
                      <span className="font-semibold text-gray-800">{p.firstName} {p.lastName}</span>
                      <span className="text-xs text-gray-400 block">{p.email || "No Email Associated"}</span>
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

          {/* Connected Profile Status Indicator Context */}
          {selectedPatient && (
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-start gap-2.5 text-emerald-800 text-sm animate-fadeIn">
              <CheckCircle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Patient Attached Verified</p>
                <p className="text-xs text-emerald-700">
                  Mobile: {selectedPatient.mobile || "N/A"} | DOB: {selectedPatient.dob || "N/A"} | ID Link Reference: {selectedPatient.id}
                </p>
              </div>
            </div>
          )}

          {/* Date, Time & Doctor Layout Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            <div className="relative">
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                required
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleInputChange}
                required
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Clock3 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Value binds to doc.id instead of plain text names */}
            <select
              name="assignedDoctorId"
              value={formData.assignedDoctorId || "Doctor Name"}
              onChange={handleDoctorChange}
              required
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Doctor Name">Doctor Name</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.firstName} {doc.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Contextual Notes / Location Details */}
          <div className="relative">
            <MapPin size={18} className="absolute left-4 top-4 text-gray-400" />
            <textarea
              rows="3"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Notes or Location Directives (e.g., Room 304, Consultation Wing B)"
              className="w-full border-2 border-gray-300 rounded-xl pl-11 pr-4 pt-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Operation Core Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-700 to-lime-500 text-white font-semibold py-3 rounded-xl shadow-md hover:scale-[1.02] transition"
            >
              Book Appointment
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              className="w-full bg-gradient-to-r from-indigo-700 to-purple-500 text-white font-semibold py-3 rounded-xl shadow-md hover:scale-[1.02] transition"
            >
              Update Schedule
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold py-3 rounded-xl shadow-md hover:scale-[1.02] transition"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* Directory Table View */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-md p-4 sm:p-5 lg:p-6 overflow-hidden">
        <h2 className="text-xl font-bold text-gray-800">Scheduled Appointments Log</h2>
        <p className="text-sm text-gray-500 mb-5">
          Select an active schedule log row to edit timing parameters or reassign clinical staff contexts.
        </p>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 border-b">
                <th className="text-left p-4">Booking Ref</th>
                <th className="text-left p-4">Patient Profile Name</th>
                <th className="text-left p-4">Assigned Medical Doctor</th>
                <th className="text-left p-4">Scheduled Date</th>
                <th className="text-left p-4">Scheduled Time</th>
                <th className="text-left p-4">Directives / Notes</th>
                <th className="text-left p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400 font-medium">
                    No matching clinical appointment records indexed.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleSelectRow(item)}
                    className="border-b hover:bg-indigo-50/40 cursor-pointer transition"
                  >
                    <td className="p-4 font-mono text-xs text-indigo-600 font-bold truncate max-w-[120px]">
                      {item.id}
                    </td>
                    <td className="p-4 font-semibold text-gray-800">{item.patientName}</td>
                    <td className="p-4 text-gray-900 font-medium">{item.doctorName}</td>
                    <td className="p-4 text-gray-600 font-medium">{item.appointmentDate}</td>
                    <td className="p-4 text-gray-600 font-medium">{item.appointmentTime}</td>
                    <td className="p-4 text-gray-400 italic truncate max-w-[180px]">{item.address || "—"}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
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