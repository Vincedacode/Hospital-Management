import React, { useState, useEffect } from 'react';
import { EyeOff, Eye, RefreshCw, Trash2, Loader2 } from 'lucide-react';
import { createStaff, getStaff, updateStaff, deleteStaff } from "../../services/staffService";

function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
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
    // Populate form data, ensuring no undefined fields pass down to inputs
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
      password: "" // Keep password blank during edit for security
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
        await loadStaff();
        if (editingId === id) resetForm();
      } catch (err) {
        setError("Could not complete profile deletion.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Panel */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Staff Management</h1>
          {loading && <Loader2 className="animate-spin text-indigo-600" size={20} />}
        </div>

        {/* Error Alert Bar */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="firstName" value={formData.firstName} onChange={handleInputChange} disabled={loading} placeholder="First Name" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100" />
              <input name="lastName" value={formData.lastName} onChange={handleInputChange} disabled={loading} placeholder="Last Name" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100" />
              
              <select name="role" value={formData.role} onChange={handleInputChange} disabled={loading} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white disabled:bg-gray-100">
                <option value="">Role</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Admin">Admin</option>
              </select>

              <select name="gender" value={formData.gender} onChange={handleInputChange} disabled={loading} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white disabled:bg-gray-100">
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              {/* Email can only be configured during initial registration inside Firebase Auth */}
              <input name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={loading || editingId} placeholder="Email Address" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100" />
              <input name="mobile" value={formData.mobile} onChange={handleInputChange} disabled={loading} placeholder="Mobile Number" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100" />
              <input name="nic" value={formData.nic} onChange={handleInputChange} disabled={loading} placeholder="NIC" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100" />
              
              <div>
                <input name="dob" type="date" value={formData.dob} onChange={handleInputChange} disabled={loading} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-500 disabled:bg-gray-100" />
              </div>

              {/* Password field is only functional during a clean member registration context */}
              {!editingId ? (
                <div className="relative">
                  <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} disabled={loading} placeholder="Password" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm pr-10 disabled:bg-gray-100" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={loading} className="absolute right-3 top-3 text-gray-400">
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              ) : (
                <div className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400 flex items-center">
                  Password edits must be performed via Account Settings.
                </div>
              )}
            </div>

            {/* Context-Aware Submission Button Hub */}
            <div className="flex justify-center gap-4 pt-6">
              {editingId ? (
                <>
                  <button onClick={handleUpdate} disabled={loading} className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                    Update Profile
                  </button>
                  <button onClick={resetForm} disabled={loading} className="bg-gray-400 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-500 disabled:opacity-50">
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={handleRegister} disabled={loading} className="bg-emerald-600 text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50">
                  Register Staff Member
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {staff.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-400">
                    No active staff records discovered.
                  </td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-700">{member.firstName} {member.lastName}</td>
                    <td className="py-3 px-4 text-gray-600">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        member.role === 'Admin' ? 'bg-purple-50 text-purple-700' :
                        member.role === 'Doctor' ? 'bg-blue-50 text-blue-700' : 'bg-teal-50 text-teal-700'
                      }`}>
                        {member.role || 'Staff'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{member.email}</td>
                    <td className="py-3 px-4 text-center flex justify-center gap-4">
                      <button onClick={() => handleEdit(member)} disabled={loading} className="text-indigo-600 hover:text-indigo-900 transition-colors disabled:opacity-50">
                        <RefreshCw size={16} />
                      </button>
                      <button onClick={() => handleDelete(member.id)} disabled={loading} className="text-rose-600 hover:text-rose-900 transition-colors disabled:opacity-50">
                        <Trash2 size={16} />
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

export default StaffManagement;