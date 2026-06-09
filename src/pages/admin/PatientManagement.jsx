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
  Mail
} from "lucide-react";

const PatientManagement = () => {
  // State Management
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const patientsPerPage = 5;

  const [formData, setFormData] = useState({
    patientId: "",
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

  // Mock Seeds
  const generateInitialPatients = () => [
    { patientId: "P-1001", firstName: "John", lastName: "Smith", email: "john@gmail.com", mobile: "08011111111", nic: "NIC001", dob: "1998-01-01", address: "Wale", gender: "Male" },
    { patientId: "P-1002", firstName: "Emma", lastName: "Brown", email: "emma@gmail.com", mobile: "08022222222", nic: "NIC002", dob: "1997-03-02", address: "Lekki", gender: "Female" },
    { patientId: "P-1003", firstName: "David", lastName: "Miller", email: "david@gmail.com", mobile: "08033333333", nic: "NIC003", dob: "1995-05-10", address: "Yaba", gender: "Male" },
    { patientId: "P-1004", firstName: "Sophia", lastName: "Wilson", email: "sophia@gmail.com", mobile: "08044444444", nic: "NIC004", dob: "1996-11-22", address: "Ikeja", gender: "Female" },
  ];

  // Lifecycle Hooks for LocalStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("patients"));
    if (saved) {
      setPatients(saved);
    } else {
      const initial = generateInitialPatients();
      setPatients(initial);
      localStorage.setItem("patients", JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    if (patients.length > 0) {
      localStorage.setItem("patients", JSON.stringify(patients));
    } else if (patients.length === 0 && localStorage.getItem("patients")) {
      localStorage.setItem("patients", JSON.stringify([]));
    }
  }, [patients]);

  // Event Handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setFormData({
      patientId: "", firstName: "", lastName: "", email: "", mobile: "",
      nic: "", dob: "", address: "", gender: "", password: "", confirmPassword: "",
    });
    setEditingId(null);
    setErrorMessage("");
  };

  const validateForm = () => {
    if (
      !formData.firstName || !formData.lastName || !formData.email || 
      !formData.mobile || !formData.nic || !formData.dob || 
      !formData.address || !formData.gender || !formData.password || !formData.confirmPassword
    ) {
      setErrorMessage("All fields must be filled completely.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email format.");
      return false;
    }

    const emailExists = patients.some(
      (p) => p.email === formData.email && p.patientId !== editingId
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

  const handleAdd = () => {
    if (!validateForm()) return;
    const newPatient = { ...formData, patientId: `P-${Date.now()}` };
    setPatients([...patients, newPatient]);
    clearForm();
  };

  const handleEdit = (patient) => {
    setFormData(patient);
    setEditingId(patient.patientId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = () => {
    if (!editingId) {
      setErrorMessage("Please select an existing patient row to update.");
      return;
    }
    if (!validateForm()) return;

    setPatients(patients.map((p) => (p.patientId === editingId ? formData : p)));
    clearForm();
  };

  const handleDelete = (id) => {
    const filtered = patients.filter((p) => p.patientId !== id);
    setPatients(filtered);
    if ((currentPage - 1) * patientsPerPage >= filtered.length && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // CDN-safe PDF Generator Function
  const generatePDF = () => {
    // Access libraries attached to window space by CDN scripts
    const { jsPDF } = window.jspdf || {};
    
    if (!jsPDF) {
      alert("PDF library is still loading from CDN. Please try again in a moment.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Patient Directory Report", 14, 15);
    
    // Call autoTable directly as a plugin feature bound to the doc instance
    doc.autoTable({
      startY: 25,
      head: [["Patient ID", "First Name", "Last Name", "Email", "Mobile", "NIC", "Gender"]],
      body: patients.map((p) => [p.patientId, p.firstName, p.lastName, p.email, p.mobile, p.nic, p.gender]),
    });
    
    doc.save("patient-directory.pdf");
  };

  // Searching and Filtering
  const filteredPatients = patients.filter((p) =>
    p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage) || 1;
  const verifiedCurrentPage = currentPage > totalPages ? totalPages : currentPage;
  const indexOfLastPatient = verifiedCurrentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  // Common styles to match structural form layouts
  const formGroupStyle = "relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors bg-white";
  const iconStyle = "absolute left-4 top-3.5 text-gray-400 pointer-events-none";
  const inputStyle = "w-full pl-11 pr-4 py-3 bg-transparent text-gray-700 focus:outline-none placeholder-gray-400";

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 font-sans antialiased text-gray-800">
      
      {/* Top Header Panel */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold tracking-wide text-gray-900 flex items-center gap-2">
          <Users className="text-purple-600" size={22} />
          Patient Management
        </h1>
      </div>

      {/* Main Control Panel Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 mb-6 max-w-7xl mx-auto">
        
        {/* Action Button & Search Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <button 
            onClick={generatePDF}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm transition-all transform active:scale-95 w-full sm:w-auto justify-center"
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
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm transition-all transform active:scale-95">
              <Search size={18} />
              Search
            </button>
          </div>
        </div>

        {/* Dynamic Alerts inside Layout */}
        {errorMessage && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200">
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

            {/* Password input with visibility feature */}
            <div className={formGroupStyle}>
              <span className={iconStyle}><Key size={18} /></span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`${inputStyle} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password input */}
            <div className={formGroupStyle}>
              <span className={iconStyle}><Key size={18} /></span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`${inputStyle} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
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
            className="w-full sm:w-44 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-sm transition-all transform active:scale-95"
          >
            Add Patient
          </button>
          <button 
            onClick={handleUpdate}
            className="w-full sm:w-44 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm transition-all transform active:scale-95"
          >
            Update
          </button>
          <button 
            onClick={clearForm}
            className="w-full sm:w-44 py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-sm transition-all transform active:scale-95"
          >
            Clear Fields
          </button>
        </div>
      </div>

      {/* Records Table Panel */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 max-w-7xl mx-auto overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent Records</h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
            Total Systems Account Count: {patients.length}
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
              {currentPatients.length > 0 ? (
                currentPatients.map((patient, index) => (
                  <tr 
                    key={patient.patientId} 
                    className={`hover:bg-gray-50/70 transition-colors ${index % 2 === 1 ? 'bg-gray-50/30' : ''}`}
                  >
                    <td className="p-4 text-sm font-medium text-gray-500 text-center">{patient.patientId}</td>
                    <td className="p-4 text-sm font-semibold text-gray-900">{patient.firstName} {patient.lastName}</td>
                    <td className="p-4 text-sm text-gray-600">{patient.email}</td>
                    <td className="p-4 text-sm text-gray-600">{patient.mobile}</td>
                    <td className="p-4 text-sm text-gray-600">{patient.nic}</td>
                    <td className="p-4 text-sm text-gray-600 text-center">
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-100">
                        {patient.gender}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => handleEdit(patient)}
                          className="text-indigo-500 hover:text-indigo-700 p-1 rounded hover:bg-indigo-50 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(patient.patientId)}
                          className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-sm text-gray-500">
                    No active patient records found.
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
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-9 h-9 rounded-lg font-medium text-sm transition-colors ${
                  verifiedCurrentPage === idx + 1
                    ? "bg-purple-600 text-white shadow-sm"
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