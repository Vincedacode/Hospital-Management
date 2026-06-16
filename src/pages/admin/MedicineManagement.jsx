import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Calendar, 
  Clock, 
  Plus, 
  RefreshCw, 
  Trash2, 
  Edit2, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

// Import your Firestore functions
import { 
  createMedicine, 
  getMedicines, 
  updateMedicine, 
  deleteMedicine 
} from "../../services/medicineService"; 

const MedicineManagement = () => {
  // --- States ---
  const [medicines, setMedicines] = useState([]);
  const [searchId, setSearchId] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    expireDate: '',
    qty: '',
    supplierName: '',
    manufactureDate: '',
    unitPrice: ''
  });

  const [editingId, setEditingId] = useState(null);

  // --- Fetch Data on Mount ---
  const fetchMedicines = async () => {
    try {
      const data = await getMedicines();
      setMedicines(data);
    } catch (error) {
      alert("Failed to load inventory.");
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // --- Form Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setFormData({
      name: '',
      expireDate: '',
      qty: '',
      supplierName: '',
      manufactureDate: '',
      unitPrice: ''
    });
    setEditingId(null);
  };

  // --- CRUD Operations ---
  const handleAdd = async () => {
    if (!formData.name || !formData.qty || !formData.unitPrice) {
      alert("Please fill in at least the Name, QTY, and Unit Price.");
      return;
    }
    try {
      await createMedicine({
        name: formData.name,
        expire: formData.expireDate,
        qty: Number(formData.qty),
        supplier: formData.supplierName,
        manufacture: formData.manufactureDate,
        price: formData.unitPrice
      });
      clearForm();
      fetchMedicines();
    } catch (error) {
      alert("Error adding medicine.");
    }
  };

  const handleUpdate = async () => {
    if (!editingId) {
      alert("Please click the edit icon on a table row first.");
      return;
    }
    try {
      await updateMedicine(editingId, {
        name: formData.name,
        expire: formData.expireDate,
        qty: Number(formData.qty),
        supplier: formData.supplierName,
        manufacture: formData.manufactureDate,
        price: formData.unitPrice
      });
      clearForm();
      fetchMedicines();
    } catch (error) {
      alert("Error updating medicine.");
    }
  };

  const handleDelete = async (idToDelete) => {
    const targetId = idToDelete || editingId;
    if (!targetId) {
      alert("No target selected to delete.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await deleteMedicine(targetId);
        if (targetId === editingId) clearForm();
        fetchMedicines();
      } catch (error) {
        alert("Error deleting medicine.");
      }
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || '',
      expireDate: item.expire || '',
      qty: item.qty || '',
      supplierName: item.supplier || '',
      manufactureDate: item.manufacture || '',
      unitPrice: item.price || ''
    });
  };

// SEARCH (By ID or Name)
const handleSearch = () => {
  const query = searchId.trim().toLowerCase();
  
  if (!query) {
    fetchMedicines(); // Reset to showcase full active database if query field is blank
    return;
  }

  const matched = medicines.filter(med => {
    const docId = (med.id || '').toLowerCase();
    const medName = (med.name || '').toLowerCase();
    
    // Returns true if the query matches either the unique firestore ID or the name
    return docId.includes(query) || medName.includes(query);
  });

  setMedicines(matched);
};

  // --- AUTOMATIC DATE FILTERATION LOGIC ---
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to compare dates accurately

  // Filter Active vs Expired
  const activeMedicines = medicines.filter(med => {
    if (!med.expire) return true; // Default to active if no date specified
    return new Date(med.expire) >= today;
  });

  const expiredMedicines = medicines.filter(med => {
    if (!med.expire) return false;
    return new Date(med.expire) < today;
  });

  // Reusable Table Component to prevent code duplication
  const MedicineTable = ({ data, isExpiredTable }) => (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider text-center w-24">ID Prefix</th>
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
          {data.length === 0 ? (
            <tr>
              <td colSpan="8" className="p-8 text-sm text-center text-gray-400">
                No items found in this section.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr 
                key={item.id} 
                className={`hover:bg-gray-50/70 transition-colors ${index % 2 === 1 ? 'bg-gray-50/30' : ''} ${editingId === item.id ? 'bg-yellow-50' : ''}`}
              >
                <td className="p-4 text-xs font-mono text-gray-500 text-center" title={item.id}>
                  {item.id.substring(0, 6)}...
                </td>
                <td className="p-4 text-sm font-semibold text-gray-900">{item.name}</td>
                <td className={`p-4 text-sm font-medium ${isExpiredTable ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                  {item.expire || 'N/A'}
                </td>
                <td className="p-4 text-sm text-gray-600">{item.manufacture || 'N/A'}</td>
                <td className="p-4 text-sm text-gray-600">{item.supplier || 'N/A'}</td>
                <td className="p-4 text-sm font-mono text-gray-700 text-right">{item.price}</td>
                <td className="p-4 text-sm font-medium text-gray-700 text-center">{item.qty}</td>
                <td className="p-4 text-sm text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button 
                      onClick={() => startEdit(item)}
                      className="text-indigo-500 hover:text-indigo-700 p-1 rounded hover:bg-indigo-50 transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete Item"
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
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased text-gray-800 space-y-6">
      
      {/* Top Header Panel */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h1 className="text-xl font-bold tracking-wide text-gray-900">Medicine Management</h1>
      </div>

      {/* Main Control Panel Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 max-w-7xl mx-auto">
        
        {/* Action Button & Search Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm transition-all transform active:scale-95">
            <FileText size={18} />
            Generate Report
          </button>
          
       <div className="flex w-full md:w-auto items-center gap-2">
  <div className="relative flex-1 md:w-72"> {/* Bumped width slightly to fit new placeholder text */}
    <input 
      type="text" 
      placeholder="Search by Medicine Name or ID..." 
      value={searchId}
      onChange={(e) => setSearchId(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Optional: Allows pressing 'Enter' to execute search query
      className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors"
    />
  </div>
  <button 
    onClick={handleSearch}
    className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm transition-all transform active:scale-95"
  >
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
              name="name"
              placeholder="Medicine name" 
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors"
            />
            
            <div className="relative">
              <input 
                type="text" 
                name="expireDate"
                placeholder="Expire Date" 
                value={formData.expireDate}
                onChange={handleInputChange}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors text-left"
              />
             
            </div>

            <input 
              type="number" 
              name="qty"
              placeholder="QTY" 
              value={formData.qty}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors"
            />
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <input 
              type="text" 
              name="supplierName"
              placeholder="Supplier Name" 
              value={formData.supplierName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors"
            />
            
            <div className="relative">
              <input 
                type="text" 
                name="manufactureDate"
                placeholder="Manufacture Date" 
                value={formData.manufactureDate}
                onChange={handleInputChange}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors text-left"
              />
              
            </div>

            <div className="flex rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors">
              <span className="bg-black text-white px-4 flex items-center justify-center font-bold text-sm tracking-wider">
                RS:
              </span>
              <input 
                type="text" 
                name="unitPrice"
                placeholder="Unit Price" 
                value={formData.unitPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-3 focus:outline-none placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
          <button 
            onClick={handleAdd}
            disabled={!!editingId}
            className={`flex items-center gap-2 px-10 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-md min-w-[140px] justify-center transition-all transform active:scale-95 ${!!editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Plus size={18} />
            Add
          </button>
          
          <button 
            onClick={handleUpdate}
            className="flex items-center gap-2 px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md min-w-[140px] justify-center transition-all transform active:scale-95"
          >
            <RefreshCw size={18} />
            Update
          </button>
          
          <button 
            onClick={() => handleDelete(null)}
            className="flex items-center gap-2 px-10 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-md min-w-[140px] justify-center transition-all transform active:scale-95"
          >
            <Trash2 size={18} />
            Delete
          </button>

          {editingId && (
            <button 
              onClick={clearForm}
              className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl shadow-md transition-all transform active:scale-95"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: Active Inventory Panel */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 max-w-7xl mx-auto overflow-hidden">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 text-emerald-600">
            <CheckCircle2 size={20} />
            Active Stock Inventory ({activeMedicines.length})
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Medicines in optimal condition available for distribution.
          </p>
        </div>
        <MedicineTable data={activeMedicines} isExpiredTable={false} />
      </div>

      {/* SECTION 2: Expired Inventory Panel */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 max-w-7xl mx-auto overflow-hidden">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 text-red-500">
            <AlertCircle size={20} />
            Expired Stock ({expiredMedicines.length})
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Medicines that have passed their expiration date and require safe disposal.
          </p>
        </div>
        <MedicineTable data={expiredMedicines} isExpiredTable={true} />
      </div>

    </div>
  );
};

export default MedicineManagement;