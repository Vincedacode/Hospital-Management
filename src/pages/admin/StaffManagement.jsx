import React, { useState, useEffect } from 'react';
import { EyeOff, Eye, RefreshCw, Trash2, Loader2, FileText, Users, CheckCircle2 } from 'lucide-react';
import { createStaff, getStaff, updateStaff, deleteStaff } from "../../services/staffService";

function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  // Animation state banner triggers
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [animationMessage, setAnimationMessage] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", role: "", gender: "", 
    email: "", mobile: "", nic: "", dob: "", address: "", password: ""
  });

  // Fetch initial data on mount
  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const data = await getStaff();
      setStaff(data);
    } catch (err) {
      setError("Failed to load staff list.");
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      firstName: "", lastName: "", role: "", gender: "", 
      email: "", mobile: "", nic: "", dob: "", address: "", password: ""
    });
    setEditingId(null);
    setShowPassword(false);
    setError("");
  };

  // Triggers the non-blocking visual confirmation overlay sequence
  const triggerSuccessFeedback = (message) => {
    setAnimationMessage(message);
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 2200);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Email and Password fields are required for registration.");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      await createStaff(formData);
      resetForm();
      triggerSuccessFeedback("Staff Account Successfully Registered!");
      await loadStaff();
    } catch (err) {
      setError(err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setError("");
    setEditingId(member.id);
    setFormData({
      firstName: member.firstName || "",
      lastName: member.lastName || "",
      role: member.role || "",
      gender: member.gender || "",
      email: member.email || "",
      mobile: member.mobile || "",
      nic: member.nic || "",
      dob: member.dob || "",
      address: member.address || "",
      password: "" 
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    
    setLoading(true);
    setError("");
    try {
      await updateStaff(editingId, formData);
      resetForm();
      triggerSuccessFeedback("Staff Profile Updated Flawlessly!");
      await loadStaff();
    } catch (err) {
      setError(err.message || "An error occurred while updating profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this staff member? This will delete their database record.")) {
      try {
        setError("");
        await deleteStaff(id);
        triggerSuccessFeedback("Record Purged from Database.");
        await loadStaff();
        if (editingId === id) resetForm();
      } catch (err) {
        setError("Could not complete profile deletion.");
      }
    }
  };

  // --- CDN-safe PDF Generator Function ---
  const generatePDF = () => {
    const { jsPDF } = window.jspdf || {};
    
    if (!jsPDF) {
      alert("PDF library is still loading from CDN. Please try again in a moment.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Staff Directory Report", 14, 15);
    
    doc.autoTable({
      startY: 25,
      head: [["Name", "Role", "Gender", "Email", "Mobile", "NIC"]],
      body: staff.map((member) => [
        `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'N/A',
        member.role || 'N/A',
        member.gender || 'N/A',
        member.email || 'N/A',
        member.mobile || 'N/A',
        member.nic || 'N/A'
      ]),
    });
    
    doc.save("staff-directory-report.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 font-sans antialiased text-gray-800 relative">
      
      {/* Dynamic Success Animation Notification Overlay */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-emerald-100 flex flex-col items-center max-w-sm mx-auto text-center transform scale-100 transition-transform duration-300">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-4 shadow-inner animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Transaction Logged</h3>
            <p className="text-sm font-medium text-slate-500 animate-pulse">{animationMessage}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Panel */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="text-purple-600" size={22} />
            <h1 className="text-xl font-bold tracking-wide text-gray-900 flex items-center gap-2">
              Staff Management
            </h1>
            {loading && <Loader2 className="animate-spin text-indigo-600 ml-2" size={20} />}
          </div>
          
          <button 
            onClick={generatePDF}
            type="button"
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:from-purple-700 hover:to-indigo-600 transition-all transform active:scale-95 text-sm"
          >
            <FileText size={18} /> Generate Report
          </button>
        </div>

        {/* Error Alert Bar */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 mb-6 max-w-7xl mx-auto">
          <div className="text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-2 rounded-lg inline-block mb-6">
            {editingId ? `⚠️ Editing Staff Ref: ${editingId.substring(0, 8)}...` : "✨ Registering New Staff"}
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input name="firstName" value={formData.firstName} onChange={handleInputChange} disabled={loading} placeholder="First Name" className="w-full px-3 py-3 border-2 border-gray-300 rounded-xl text-sm disabled:bg-gray-100 transition-colors focus:outline-none focus:border-indigo-500 outline-none" />
              <input name="lastName" value={formData.lastName} onChange={handleInputChange} disabled={loading} placeholder="Last Name" className="w-full px-3 py-3 border-2 border-gray-300 rounded-xl text-sm disabled:bg-gray-100 transition-colors focus:outline-none focus:border-indigo-500 outline-none" />
              
              <select name="role" value={formData.role} onChange={handleInputChange} disabled={loading} className="w-full px-3 py-3 border-2 border-gray-300 rounded-xl text-sm bg-white disabled:bg-gray-100 transition-colors focus:outline-none focus:border-indigo-500 outline-none cursor-pointer">
                <option value="">Role</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
              </select>

              <select name="gender" value={formData.gender} onChange={handleInputChange} disabled={loading} className="w-full px-3 py-3 border-2 border-gray-300 rounded-xl text-sm bg-white disabled:bg-gray-100 transition-colors focus:outline-none focus:border-indigo-500 outline-none cursor-pointer">
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <input name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={loading || editingId} placeholder="Email Address" className="w-full px-3 py-3 border-2 border-gray-300 rounded-xl text-sm disabled:bg-gray-100 transition-colors focus:outline-none focus:border-indigo-500 outline-none" />
              <input name="mobile" value={formData.mobile} onChange={handleInputChange} disabled={loading} placeholder="Mobile Number" className="w-full px-3 py-3 border-2 border-gray-300 rounded-xl text-sm disabled:bg-gray-100 transition-colors focus:outline-none focus:border-indigo-500 outline-none" />
              <input name="nic" value={formData.nic} onChange={handleInputChange} disabled={loading} placeholder="NIC" className="w-full px-3 py-3 border-2 border-gray-300 rounded-xl text-sm disabled:bg-gray-100 transition-colors focus:outline-none focus:border-indigo-500 outline-none" />
              
              <div>
                <input name="dob" type="date" value={formData.dob} onChange={handleInputChange} disabled={loading} className="w-full px-3 py-3 border-2 border-gray-300 rounded-xl text-sm text-gray-500 disabled:bg-gray-100 transition-colors focus:outline-none focus:border-indigo-500 outline-none" />
              </div>

              {!editingId ? (
                <div className="relative">
                  <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} disabled={loading} placeholder="Password" className="w-full px-3 py-3 border-2 border-gray-300 rounded-xl text-sm pr-10 disabled:bg-gray-100 transition-colors focus:outline-none focus:border-indigo-500 outline-none" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={loading} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              ) : (
                <div className="w-full px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm text-gray-400 flex items-center">
                  Password edits must be performed via Account Settings.
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto mt-10">
              {editingId ? (
                <>
                  <button onClick={handleUpdate} disabled={loading} className="w-full py-3.5 text-white font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                    Update Profile
                  </button>
                  <button onClick={resetForm} disabled={loading} className="w-full sm:w-auto px-6 py-3.5 text-gray-500 hover:text-gray-700 border-2 border-gray-300 hover:border-gray-400 font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors text-sm disabled:opacity-50">
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={handleRegister} disabled={loading} className="w-full py-3.5 text-white font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                  Register Staff Member
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Re-designed Table Component matching Invoices */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 max-w-7xl mx-auto overflow-hidden">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Staff Registry</h2>

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider w-24 text-center">Staff ID</th>
                  <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Staff Member</th>
                  <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Role</th>
                  <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Email Address</th>
                  <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider text-center">Gender</th>
                  <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Mobile</th>
                  <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider text-right">NIC</th>
                  <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider text-center w-28">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {staff.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-sm text-center text-gray-400">
                      No active staff records discovered in this directory.
                    </td>
                  </tr>
                ) : (
                  staff.map((member, index) => (
                    <tr 
                      key={member.id} 
                      className={`hover:bg-gray-50/70 transition-colors ${index % 2 === 1 ? 'bg-gray-50/30' : ''} ${editingId === member.id ? 'bg-purple-50' : ''}`}
                    >
                      <td className="p-4 text-xs font-mono font-bold text-indigo-600 text-center" title={member.id}>
                        {member.id ? `${member.id.substring(0, 7)}...` : '—'}
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-900">
                        {member.firstName} {member.lastName}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          member.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          member.role === 'Doctor' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-teal-50 text-teal-700 border-teal-200'
                        }`}>
                          {member.role || 'Staff'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{member.email || "—"}</td>
                      <td className="p-4 text-sm text-gray-600 text-center">{member.gender || "—"}</td>
                      <td className="p-4 text-sm text-gray-600">{member.mobile || "—"}</td>
                      <td className="p-4 text-sm font-bold text-purple-600 text-right">{member.nic || "—"}</td>

                      <td className="p-4 text-sm text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => handleEdit(member)}
                            className="text-indigo-500 hover:text-indigo-700 p-1 rounded hover:bg-indigo-50 transition-colors"
                            title="Edit Parameters"
                            disabled={loading}
                          >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                          </button>
                          <button 
                            onClick={() => handleDelete(member.id)}
                            className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Delete Record"
                            disabled={loading}
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
    </div>
  );
}

export default StaffManagement;