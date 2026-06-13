import React, { useState, useEffect } from 'react';
import { FileText, Search, Calendar, EyeOff, Eye, UserPlus, RefreshCw, Trash2 } from 'lucide-react';
import { createStaff, getStaff, updateStaff, deleteStaff } from "../../services/staffService";

function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", role: "", gender: "", 
    email: "", mobile: "", nic: "", dob: "", address: "", password: ""
  });

  // Fetch initial data
  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    const data = await getStaff();
    setStaff(data);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setLoading(true);
    await createStaff(formData);
    setFormData({}); // Clear form
    await loadStaff();
    setLoading(false);
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setFormData(member);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    setLoading(true);
    await updateStaff(editingId, formData);
    setEditingId(null);
    setFormData({});
    await loadStaff();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteStaff(id);
      await loadStaff();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Panel */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-xl font-bold text-gray-800">Staff Management</h1>
        </div>

        {/* Main Form Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="firstName" value={formData.firstName || ""} onChange={handleInputChange} placeholder="First Name" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
              <input name="lastName" value={formData.lastName || ""} onChange={handleInputChange} placeholder="Last Name" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
              
              <select name="role" value={formData.role || ""} onChange={handleInputChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white">
                <option value="">Role</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Admin">Admin</option>
              </select>

              <select name="gender" value={formData.gender || ""} onChange={handleInputChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white">
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <input name="email" type="email" value={formData.email || ""} onChange={handleInputChange} placeholder="Email" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
              <input name="mobile" value={formData.mobile || ""} onChange={handleInputChange} placeholder="Mobile Number" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
              <input name="nic" value={formData.nic || ""} onChange={handleInputChange} placeholder="NIC" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm" />
              
              <div className="relative">
                <input name="dob" type="date" value={formData.dob || ""} onChange={handleInputChange} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-500" />
              </div>

              <div className="relative">
                <input name="password" type={showPassword ? "text" : "password"} value={formData.password || ""} onChange={handleInputChange} placeholder="Password" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <button onClick={handleRegister} className="bg-emerald-600 text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700">Register</button>
              <button onClick={handleUpdate} className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700">Update</button>
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
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{member.firstName} {member.lastName}</td>
                  <td className="py-3 px-4">{member.role}</td>
                  <td className="py-3 px-4">{member.email}</td>
                  <td className="py-3 px-4 text-center flex justify-center gap-2">
                    <button onClick={() => handleEdit(member)} className="text-indigo-600 hover:text-indigo-900"><RefreshCw size={16} /></button>
                    <button onClick={() => handleDelete(member.id)} className="text-rose-600 hover:text-rose-900"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StaffManagement;