import React from 'react';
import { 
  FileText, 
  Search, 
  Calendar, 
  EyeOff, 
  UserPlus, 
  RefreshCw, 
  Trash2 
} from 'lucide-react';

function StaffManagement() {
  // Mock data for the table based on the image
  const staffMembers = [
    { id: '1', name: 'Madhusha', role: 'Doctor', gender: 'Male', email: 'Madhusha@gmail.com', mobile: '078-65622616', nic: '06262625', dob: '1999-04-13', status: 'Online' },
    { id: '2', name: 'Madhusha', role: 'Doctor', gender: 'Male', email: 'Madhusha@gmail.com', mobile: '078-65622616', nic: '16616161', dob: '1999-04-13', status: 'Online' },
    { id: '3', name: 'Madhusha', role: 'Doctor', gender: 'Male', email: 'Madhusha@gmail.com', mobile: '078-65622616', nic: '11161616', dob: '1999-04-13', status: 'Online' },
    { id: '4', name: 'Madhusha', role: 'Doctor', gender: 'Male', email: 'Madhusha@gmail.com', mobile: '078-65622616', nic: '16151616', dob: '1999-04-13', status: 'Online' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Panel */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-xl font-bold text-gray-800">Staff Management</h1>
        </div>

        {/* Main Form Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          
          {/* Top Actions: Generate Report & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-150">
            <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <FileText size={16} />
              Generate Report
            </button>
            
            <div className="flex w-full sm:w-auto gap-2">
              <div className="relative flex-1 sm:w-64">
                <input 
                  type="text" 
                  placeholder="ID" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button className="inline-flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                <Search size={16} />
                Search
              </button>
            </div>
          </div>

          {/* Form Fields Grid */}
          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* First Name */}
              <div>
                <input 
                  type="text" 
                  placeholder="First Name" 
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Last Name */}
              <div>
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Role Select */}
              <div>
                <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 assignment-select">
                  <option value="">Role</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Gender Select */}
              <div>
                <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <input 
                  type="tel" 
                  placeholder="Mobile Number" 
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Address - Full width on MD screens */}
              <div className="md:col-span-2">
                <textarea 
                  placeholder="Address" 
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* NIC */}
              <div>
                <input 
                  type="text" 
                  placeholder="NIC" 
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Date of Birth */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Date of Birth" 
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => !e.target.value && (e.target.type = "text")}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                />
                <Calendar size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Password */}
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                />
                <EyeOff size={16} className="absolute right-3 top-3.5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                />
                <EyeOff size={16} className="absolute right-3 top-3.5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <button type="submit" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-2.5 rounded-lg text-sm transition-colors shadow-sm min-w-[120px] justify-center">
                <UserPlus size={16} />
                Register
              </button>
              <button type="button" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-2.5 rounded-lg text-sm transition-colors shadow-sm min-w-[120px] justify-center">
                <RefreshCw size={16} />
                Update
              </button>
              <button type="button" className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-medium px-8 py-2.5 rounded-lg text-sm transition-colors shadow-sm min-w-[120px] justify-center">
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </form>
        </div>

        {/* Recent Doctors Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Recent Doctors</h2>
            <p className="text-xs text-gray-400 mt-1">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          
          {/* Responsive Table Wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Mobile Number</th>
                  <th className="py-3 px-4">NIC</th>
                  <th className="py-3 px-4">DOB</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {staffMembers.map((member) => (
                  <tr key={member.nic} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-gray-900">{member.id}</td>
                    <td className="py-3.5 px-4">{member.name}</td>
                    <td className="py-3.5 px-4">{member.role}</td>
                    <td className="py-3.5 px-4">{member.gender}</td>
                    <td className="py-3.5 px-4 text-gray-500">{member.email}</td>
                    <td className="py-3.5 px-4 text-gray-500">{member.mobile}</td>
                    <td className="py-3.5 px-4 font-mono text-xs">{member.nic}</td>
                    <td className="py-3.5 px-4 text-gray-500">{member.dob}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button className="text-rose-600 hover:text-rose-900 p-1 rounded hover:bg-rose-50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default StaffManagement;