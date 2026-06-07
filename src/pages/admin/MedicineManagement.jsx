import React from 'react';
import { 
  FileText, 
  Search, 
  Calendar, 
  Clock, 
  Plus, 
  RefreshCw, 
  Trash2, 
  Edit2, 
  AlertCircle 
} from 'lucide-react';

const MedicineManagement = () => {
  // Mock data matching the UI table
  const inventoryData = [
    { id: 1, name: 'Vitamin C', expire: '2025-04-13', manufacture: '2021-12-13', supplier: 'Kane', price: '1500.00', qty: 150 },
    { id: 2, name: 'Paracetamol', expire: '2025-05-13', manufacture: '2022-04-04', supplier: 'Kane', price: '4500.00', qty: 225 },
    { id: 3, name: 'Avatar', expire: '2026-01-16', manufacture: '2020-06-08', supplier: 'Kane', price: '5000.00', qty: 65 },
    { id: 4, name: 'Amoxicillin', expire: '2024-12-13', manufacture: '2021-01-13', supplier: 'Kane', price: '1200.00', qty: 275 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased text-gray-800">
      
      {/* Top Header Panel */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <h1 className="text-xl font-bold tracking-wide text-gray-900">Medicine Management</h1>
      </div>

      {/* Main Control Panel Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-6 max-w-7xl mx-auto">
        
        {/* Action Button & Search Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm transition-all transform active:scale-95">
            <FileText size={18} />
            Generate Report
          </button>
          
          <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                placeholder="Medicine ID" 
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
            <input 
              type="text" 
              placeholder="Medicine name" 
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors"
            />
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Expire Date" 
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors text-left"
              />
              <Calendar className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" size={20} />
            </div>

            <input 
              type="number" 
              placeholder="QTY" 
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors"
            />
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <input 
              type="text" 
              placeholder="Supplier Name" 
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors"
            />
            
            <div className="relative">
              <input 
                type="text" 
                placeholder="Manufacture Date" 
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors text-left"
              />
              <Clock className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" size={20} />
            </div>

            <div className="flex rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors">
              <span className="bg-black text-white px-4 flex items-center justify-center font-bold text-sm tracking-wider">
                RS:
              </span>
              <input 
                type="text" 
                placeholder="Unit Price" 
                className="w-full px-4 py-3 focus:outline-none placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
          <button className="flex items-center gap-2 px-10 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-md min-w-[140px] justify-center transition-all transform active:scale-95">
            <Plus size={18} />
            Add
          </button>
          <button className="flex items-center gap-2 px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md min-w-[140px] justify-center transition-all transform active:scale-95">
            <RefreshCw size={18} />
            Update
          </button>
          <button className="flex items-center gap-2 px-10 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-md min-w-[140px] justify-center transition-all transform active:scale-95">
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Out of Stock Inventory Table Panel */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 max-w-7xl mx-auto overflow-hidden">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle className="text-red-500" size={20} />
            Out of Stock
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider w-16 text-center">ID</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Medicine Name</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Expire Date</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Manufacture Date</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider">Supplier Name</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider text-right">Unit Price</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider text-center">QTY</th>
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inventoryData.map((item, index) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-gray-50/70 transition-colors ${index % 2 === 1 ? 'bg-gray-50/30' : ''}`}
                >
                  <td className="p-4 text-sm font-medium text-gray-500 text-center">{item.id}</td>
                  <td className="p-4 text-sm font-semibold text-gray-900">{item.name}</td>
                  <td className="p-4 text-sm text-gray-600">{item.expire}</td>
                  <td className="p-4 text-sm text-gray-600">{item.manufacture}</td>
                  <td className="p-4 text-sm text-gray-600">{item.supplier}</td>
                  <td className="p-4 text-sm font-mono text-gray-700 text-right">{item.price}</td>
                  <td className="p-4 text-sm font-medium text-gray-700 text-center">{item.qty}</td>
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

export default MedicineManagement;