import React, { useState, useEffect } from "react";
import { 
  Users, 
  FileText, 
  Search, 
  User, 
  Phone, 
  Calendar, 
  Layers, 
  MapPin, 
  Key, 
  Edit2, 
  Trash2,
  Eye,
  EyeOff,
  IdCard,
  Mail,
  CheckCircle2,
  Loader2
} from "lucide-react";

import {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient
} from "../../services/patientService";

const PatientManagement = () => {
  // State Management
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Animation state triggers
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [animationMessage, setAnimationMessage] = useState("");

  const patientsPerPage = 5;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    nic: "",
    dob: "",
    address: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  // Fetch Patients on Mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await getPatients();
        setPatients(data || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setErrorMessage("Failed to load patient records.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Event Handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setFormData({
      firstName: "", 
      lastName: "", 
      email: "", 
      mobile: "",
      nic: "", 
      dob: "", 
      address: "", 
      gender: "", 
      password: "", 
      confirmPassword: "",
    });
    setEditingId(null);
    setErrorMessage("");
  };

  // Triggers the non-blocking visual feedback modal overlay
  const triggerSuccessFeedback = (message) => {
    setAnimationMessage(message);
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 2200);
  };

  const validateForm = (isEdit = false) => {
    if (
      !formData.firstName || !formData.lastName || !formData.email || 
      !formData.mobile || !formData.nic || !formData.dob || 
      !formData.address || !formData.gender
    ) {
      setErrorMessage("All profile fields must be filled completely.");
      return false;
    }

    if (!isEdit && (!formData.password || !formData.confirmPassword)) {
      setErrorMessage("Password fields are required for new registrations.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email format.");
      return false;
    }

    const emailExists = patients.some(
      (p) => p.email.toLowerCase() === formData.email.toLowerCase() && p.id !== editingId
    );
    if (emailExists) {
      setErrorMessage("This email address is already registered.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm(false)) return;

    try {
      setLoading(true);
      const newPatient = await createPatient(formData);
      setPatients((prev) => [newPatient, ...prev]);
      clearForm();
      triggerSuccessFeedback("Patient Profile Registered Successfully!");
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage("This email is already registered in Authentication.");
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage("Password should be at least 6 characters.");
      } else {
        setErrorMessage("Failed to register patient: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (patient) => {
    setFormData({
      firstName: patient.firstName || "",
      lastName: patient.lastName || "",
      email: patient.email || "",
      mobile: patient.mobile || "",
      nic: patient.nic || "",
      dob: patient.dob || "",
      address: patient.address || "",
      gender: patient.gender || "",
      password: "",
      confirmPassword: "",
    });
    setEditingId(patient.id);
    
    // Smooth auto-scroll back to form block header context
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    if (!validateForm(true)) return;

    try {
      setLoading(true);
      const { confirmPassword, ...cleanData } = formData;
      
      if (!cleanData.password) {
        delete cleanData.password;
      }

      await updatePatient(editingId, cleanData);

      setPatients((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...cleanData } : p))
      );

      clearForm();
      triggerSuccessFeedback("Patient File Updated Flawlessly!");
    } catch (error) {
      setErrorMessage("Failed to update system records.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this record?")) return;
    
    try {
      setLoading(true);
      await deletePatient(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
      triggerSuccessFeedback("Patient File Purged from Records.");
    } catch (error) {
      setErrorMessage("Delete operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const { jsPDF } = window.jspdf || {};
    
    if (!jsPDF) {
      alert("PDF library is still loading from CDN. Please try again in a moment.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Patient Directory Report", 14, 15);
    
    doc.autoTable({
      startY: 25,
      head: [["Patient ID", "First Name", "Last Name", "Email", "Mobile", "NIC", "Gender"]],
      body: patients.map((p) => [p.id, p.firstName, p.lastName, p.email, p.mobile, p.nic, p.gender]),
    });
    
    doc.save("patient-directory.pdf");
  };

  const filteredPatients = patients.filter((p) =>
    p.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage) || 1;
  const verifiedCurrentPage = currentPage > totalPages ? totalPages : currentPage;
  const indexOfLastPatient = verifiedCurrentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const formGroupStyle = "relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-all duration-200 bg-white shadow-sm hover:border-gray-400";
  const iconStyle = "absolute left-4 top-3.5 text-gray-400 pointer-events-none";
  const inputStyle = "w-full pl-11 pr-4 py-3 bg-transparent text-gray-700 focus:outline-none placeholder-gray-400 text-sm";

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 font-sans antialiased text-gray-800 relative">
      
      {/* Global Success Micro-Interaction Notification Overlay */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-emerald-100 flex flex-col items-center max-w-sm mx-auto text-center transform scale-100 transition-transform duration-300 animate-scaleUp">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-4 shadow-inner animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Database Synchronized</h3>
            <p className="text-sm font-medium text-slate-500 animate-pulse">{animationMessage}</p>
          </div>
        </div>
      )}

      {/* Top Header Panel */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 max-w-7xl mx-auto flex items-center justify-between animate-fadeIn">
        <h1 className="text-xl font-bold tracking-wide text-gray-900 flex items-center gap-2">
          <Users className="text-purple-600" size={22} />
          Patient Management
        </h1>
        {loading && <Loader2 className="animate-spin text-purple-600 shrink-0" size={20} />}
      </div>

      {/* Main Control Panel Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 mb-6 max-w-7xl mx-auto transform transition-all duration-300 animate-slideUp">
        
        {/* Action Button & Search Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <button 
            onClick={generatePDF}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm transition-all transform active:scale-95 w-full sm:w-auto justify-center text-sm"
          >
            <FileText size={18} />
            Generate Report
          </button>

          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search ID or Name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors text-sm"
              />
            </div>
            <button 
              onClick={() => setCurrentPage(1)}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm transition-all transform active:scale-95 text-sm"
            >
              <Search size={18} />
              Search
            </button>
          </div>
        </div>

        {/* Dynamic Alerts inside Layout */}
        {errorMessage && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 animate-fadeIn">
            {errorMessage}
          </div>
        )}

        {/* Dynamic Input Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Left Column Fields */}
          <div className="space-y-5">
            <div className={formGroupStyle}>
              <span className={iconStyle}><User size={18} /></span>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            <div className={formGroupStyle}>
              <span className={iconStyle}><User size={18} /></span>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            <div className={formGroupStyle}>
              <span className={iconStyle}><Mail size={18} /></span>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            <div className={formGroupStyle}>
              <span className={iconStyle}><Phone size={18} /></span>
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            <div className={formGroupStyle}>
              <span className={iconStyle}><IdCard size={18} /></span>
              <input
                type="text"
                name="nic"
                placeholder="National Identity Card (NIC)"
                value={formData.nic}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>
          </div>

          {/* Right Column Fields */}
          <div className="space-y-5">
            <div className={formGroupStyle}>
              <span className={iconStyle}><Calendar size={18} /></span>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`${inputStyle} text-gray-500 cursor-pointer`}
              />
            </div>

            <div className={formGroupStyle}>
              <span className={iconStyle}><Layers size={18} /></span>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`${inputStyle} appearance-none cursor-pointer`}
              >
                <option value="" disabled hidden>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Rather Not Say">Rather Not Say</option>
              </select>
            </div>

            <div className={formGroupStyle}>
              <span className={iconStyle}><Key size={18} /></span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={editingId ? "Leave blank to keep password unchanged" : "Password"}
                value={formData.password}
                onChange={handleChange}
                className={`${inputStyle} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className={formGroupStyle}>
              <span className={iconStyle}><Key size={18} /></span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder={editingId ? "Confirm blank or new password" : "Confirm Password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`${inputStyle} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className={formGroupStyle}>
              <span className={iconStyle}><MapPin size={18} /></span>
              <input
                type="text"
                name="address"
                placeholder="Residential Address"
                value={formData.address}
                onChange={handleChange}
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Action Button Controls Row */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button 
            onClick={handleAdd}
            disabled={loading || !!editingId}
            className="w-full sm:w-44 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-md transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-sm"
          >
            {editingId ? "Form Locked" : "Add Patient"}
          </button>
          <button 
            onClick={handleUpdate}
            disabled={loading || !editingId}
            className="w-full sm:w-44 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-sm"
          >
            Update Parameters
          </button>
          <button 
            onClick={clearForm}
            className="w-full sm:w-44 py-3 text-gray-500 hover:text-gray-700 border-2 border-gray-300 hover:border-gray-400 font-semibold rounded-xl flex items-center justify-center shadow-sm transition-all transform active:scale-95 text-sm bg-white"
          >
            {editingId ? "Cancel Edit" : "Clear Fields"}
          </button>
        </div>
      </div>

      {/* Records Table Panel */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 max-w-7xl mx-auto overflow-hidden transition-all duration-300 animate-slideUp delay-75">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Patient Registry</h2>
          <span className="text-xs font-semibold px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-100 animate-pulse">
            Total Records: {patients.length}
          </span>
        </div>

        {/* Table Viewport */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider text-center w-24">ID</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Full Name</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Email Address</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Contact Number</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">NIC</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider text-center">Gender</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider text-center w-28">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading && patients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-sm text-gray-400 font-medium animate-pulse">
                    Loading directory database records securely...
                  </td>
                </tr>
              ) : currentPatients.length > 0 ? (
                currentPatients.map((patient, index) => (
                  <tr 
                    key={patient.id} 
                    onClick={() => handleEdit(patient)}
                    className={`hover:bg-gray-50/70 transition-colors duration-150 cursor-pointer ${index % 2 === 1 ? 'bg-gray-50/30' : ''} ${editingId === patient.id ? 'bg-purple-50' : ''}`}
                  >
                    <td className="p-4 text-xs font-mono font-bold text-indigo-600 text-center truncate max-w-[100px]" title={patient.id}>
                      {patient.id ? `${patient.id.substring(0, 7)}...` : '—'}
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900">{patient.firstName} {patient.lastName}</td>
                    <td className="p-4 text-sm text-gray-600">{patient.email}</td>
                    <td className="p-4 text-sm text-gray-600">{patient.mobile}</td>
                    <td className="p-4 text-sm text-gray-600">{patient.nic}</td>
                    <td className="p-4 text-sm text-gray-600 text-center">
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-100 transition-all duration-200">
                        {patient.gender}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleEdit(patient); }}
                          className="text-indigo-500 hover:text-indigo-700 p-1 rounded hover:bg-indigo-50 transition-colors"
                          title="Load Patient Parameters"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleDelete(patient.id); }}
                          className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Void Patient Profile"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-sm text-gray-500 font-medium">
                    No active matching patient profiles discovered in this search layout directory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-9 h-9 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
                  verifiedCurrentPage === idx + 1
                    ? "bg-purple-600 text-white shadow-md transform scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientManagement;