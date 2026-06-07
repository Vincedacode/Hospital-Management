// src/pages/InvoiceManagement.jsx

import React from "react";
import { 
  Receipt, 
  FileText, 
  Search, 
  User, 
  FlaskConical, 
  BedDouble, 
  Stethoscope, 
  Activity, 
  Edit2, 
  Trash2,
  DollarSign
} from "lucide-react";

const InvoiceManagement = () => {
  // Mock data matching the UI table
  const invoiceData = [
    { id: 1, name: "Sapooth", lab: "Blood Lab", ward: "1", doctor: "Dr. Rajitha", treatment: "Dengue", amount: "₦15,000" },
    { id: 2, name: "Sapooth", lab: "Blood Lab", ward: "1", doctor: "Dr. Rajitha", treatment: "Dengue", amount: "₦15,000" },
    { id: 3, name: "Sapooth", lab: "Blood Lab", ward: "1", doctor: "Dr. Rajitha", treatment: "Dengue", amount: "₦15,000" },
    { id: 4, name: "Sapooth", lab: "Blood Lab", ward: "1", doctor: "Dr. Rajitha", treatment: "Dengue", amount: "₦15,000" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 font-sans antialiased text-gray-800">
      
      {/* Top Header Panel */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold tracking-wide text-gray-900 flex items-center gap-2">
          <Receipt className="text-purple-600" size={22} />
          Invoice Management
        </h1>
      </div>

      {/* Main Control Panel Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 mb-6 max-w-7xl mx-auto">
        
        {/* Action Button & Search Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm transition-all transform active:scale-95 w-full sm:w-auto justify-center">
            <FileText size={18} />
            Generate Report
          </button>

          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Invoice ID"
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm transition-all transform active:scale-95">
              <Search size={18} />
              Search
            </button>
          </div>
        </div>

        {/* Dynamic Input Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-5">
            <div className="relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors bg-white">
              <span className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                <User size={18} />
              </span>
              <select className="w-full pl-11 pr-4 py-3 bg-transparent text-gray-700 focus:outline-none appearance-none cursor-pointer">
                <option>Patient Name</option>
              </select>
            </div>

            <div className="relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors bg-white">
              <span className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                <FlaskConical size={18} />
              </span>
              <select className="w-full pl-11 pr-4 py-3 bg-transparent text-gray-700 focus:outline-none appearance-none cursor-pointer">
                <option>Lab Name</option>
              </select>
            </div>

            <div className="relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors bg-white">
              <span className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                <BedDouble size={18} />
              </span>
              <input
                type="text"
                placeholder="Ward Number"
                className="w-full pl-11 pr-4 py-3 bg-transparent text-gray-700 focus:outline-none placeholder-gray-400"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <div className="relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors bg-white">
              <span className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                <Stethoscope size={18} />
              </span>
              <select className="w-full pl-11 pr-4 py-3 bg-transparent text-gray-700 focus:outline-none appearance-none cursor-pointer">
                <option>Doctor Name</option>
              </select>
            </div>

            <div className="relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors bg-white">
              <span className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                <Activity size={18} />
              </span>
              <select className="w-full pl-11 pr-4 py-3 bg-transparent text-gray-700 focus:outline-none appearance-none cursor-pointer">
                <option>Treatment</option>
              </select>
            </div>

            <div className="text-right flex items-center justify-end h-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Total Amount : <span className="text-purple-600">₦15,000</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Generate Bill Button */}
        <div className="flex justify-center mt-10">
          <button className="w-full max-w-lg py-3.5 text-white font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2">
            <Receipt size={20} />
            Generate Bill
          </button>
        </div>
      </div>

      {/* Recent Invoices Table Panel */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 max-w-7xl mx-auto overflow-hidden">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Invoices</h2>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider w-16 text-center">ID</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Patient Name</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Lab Name</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider text-center">Ward No</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Doctor Name</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Treatment</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider text-right">Amount</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider text-center w-28">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {invoiceData.map((invoice, index) => (
                <tr 
                  key={invoice.id} 
                  className={`hover:bg-gray-50/70 transition-colors ${index % 2 === 1 ? 'bg-gray-50/30' : ''}`}
                >
                  <td className="p-4 text-sm font-medium text-gray-500 text-center">{invoice.id}</td>
                  <td className="p-4 text-sm font-semibold text-gray-900">{invoice.name}</td>
                  <td className="p-4 text-sm text-gray-600">{invoice.lab}</td>
                  <td className="p-4 text-sm text-gray-600 text-center">{invoice.ward}</td>
                  <td className="p-4 text-sm text-gray-600">{invoice.doctor}</td>
                  <td className="p-4 text-sm text-gray-600">{invoice.treatment}</td>
                  <td className="p-4 text-sm font-semibold text-purple-600 text-right">{invoice.amount}</td>

                  <td className="p-4 text-sm text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-indigo-500 hover:text-indigo-700 p-1 rounded hover:bg-indigo-50 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagement;