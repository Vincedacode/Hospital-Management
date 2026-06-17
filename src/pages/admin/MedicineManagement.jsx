/**
 * @file MedicineManagement.jsx
 * @description This component provides a comprehensive interface for managing the hospital's medicine inventory. It allows administrators to add, update, delete, and search for medicines, as well as generate PDF reports of the current inventory. The component also visually distinguishes between active and expired medicines.
 * @collaborator chineduchiamaka742-oss 
 * */ 

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
  CheckCircle2,
  Loader2
} from 'lucide-react';


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
  const [loading, setLoading] = useState(false);
  
  // Animation notification banner triggers
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [animationMessage, setAnimationMessage] = useState("");

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
      setLoading(true);
      const data = await getMedicines();
      setMedicines(data || []);
    } catch (error) {
      alert("Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  
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

  // Triggers the micro-interaction backdrop overlay
  const triggerSuccessFeedback = (message) => {
    setAnimationMessage(message);
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 2200);
  };

  // --- CRUD Operations ---
  const handleAdd = async () => {
    if (!formData.name || !formData.qty || !formData.unitPrice) {
      alert("Please fill in at least the Name, QTY, and Unit Price.");
      return;
    }
    try {
      setLoading(true);
      await createMedicine({
        name: formData.name,
        expire: formData.expireDate,
        qty: Number(formData.qty),
        supplier: formData.supplierName,
        manufacture: formData.manufactureDate,
        price: formData.unitPrice
      });
      clearForm();
      triggerSuccessFeedback("Formulary Entry Logged Successfully!");
      await fetchMedicines();
    } catch (error) {
      alert("Error adding medicine.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId) {
      alert("Please click the edit icon on a table row first.");
      return;
    }
    try {
      setLoading(true);
      await updateMedicine(editingId, {
        name: formData.name,
        expire: formData.expireDate,
        qty: Number(formData.qty),
        supplier: formData.supplierName,
        manufacture: formData.manufactureDate,
        price: formData.unitPrice
      });
      clearForm();
      triggerSuccessFeedback("Formulary Parameter Modifications Complete!");
      await fetchMedicines();
    } catch (error) {
      alert("Error updating medicine.");
    } finally {
      setLoading(false);
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
        setLoading(true);
        await deleteMedicine(targetId);
        triggerSuccessFeedback("Batch Removed from Active Directory Records.");
        if (targetId === editingId) clearForm();
        await fetchMedicines();
      } catch (error) {
        alert("Error deleting medicine.");
      } finally {
        setLoading(false);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SEARCH (By ID or Name)
  const handleSearch = () => {
    const query = searchId.trim().toLowerCase();
    
    if (!query) {
      fetchMedicines(); 
      return;
    }

    const matched = medicines.filter(med => {
      const docId = (med.id || '').toLowerCase();
      const medName = (med.name || '').toLowerCase();
      return docId.includes(query) || medName.includes(query);
    });

    setMedicines(matched);
  };

  // CDN-safe PDF Generator Function
  const generatePDF = () => {
    const { jsPDF } = window.jspdf || {};
    
    if (!jsPDF) {
      alert("PDF library is still loading from CDN. Please try again in a moment.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Medicine Inventory Report", 14, 15);
    
    doc.autoTable({
      startY: 25,
      head: [["ID Prefix", "Medicine Name", "Exp. Date", "Mfg. Date", "Supplier", "Unit Price", "QTY"]],
      body: medicines.map((m) => [
        m.id ? m.id.substring(0, 6) + '...' : 'N/A', 
        m.name || 'N/A', 
        m.expire || 'N/A', 
        m.manufacture || 'N/A', 
        m.supplier || 'N/A', 
        m.price || 'N/A', 
        m.qty || '0'
      ]),
    });
    
    doc.save("medicine-inventory.pdf");
  };

  // --- AUTOMATIC DATE FILTERATION LOGIC ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter Active vs Expired
  const activeMedicines = medicines.filter(med => {
    if (!med.expire) return true; 
    return new Date(med.expire) >= today;
  });

  const expiredMedicines = medicines.filter(med => {
    if (!med.expire) return false;
    return new Date(med.expire) < today;
  });

  // Fixed closure implementation explicitly returning standard sub-DOM nodes safely
  const MedicineTable = ({ data, isExpiredTable }) => {
    return (
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
                  className={`hover:bg-gray-50/70 transition-all duration-150 ${index % 2 === 1 ? 'bg-gray-50/30' : ''} ${editingId === item.id ? 'bg-purple-50 font-medium' : ''}`}
                >
                  <td className="p-4 text-xs font-mono text-gray-500 text-center" title={item.id}>
                    {item.id ? `${item.id.substring(0, 6)}...` : '—'}
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
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased text-gray-800 space-y-6 relative animate-fadeIn">

     
      {showSuccessAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-emerald-100 flex flex-col items-center max-w-sm mx-auto text-center transform scale-100 transition-transform duration-300 animate-scaleUp">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-4 shadow-inner animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Inventory Synchronized</h3>
            <p className="text-sm font-medium text-slate-500 animate-pulse">{animationMessage}</p>
          </div>
        </div>
      )}

      
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center animate-fadeIn">
        <h1 className="text-xl font-bold tracking-wide text-gray-900">Medicine Management</h1>
        {loading && <Loader2 className="animate-spin text-purple-600 shrink-0" size={20} />}
      </div>

      {/* Main Control Panel Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 max-w-7xl mx-auto transform transition-all duration-300 animate-slideUp">
        
        {/* Action Button & Search Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <button 
            onClick={generatePDF}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm transition-all transform active:scale-95 w-full md:w-auto justify-center text-sm"
          >
            <FileText size={18} />
            Generate Report
          </button>
          
          <div className="flex w-full md:w-auto items-center gap-2">
            <div className="relative flex-1 md:w-72">
              <input 
                type="text" 
                placeholder="Search by Medicine Name or ID..." 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors text-sm"
              />
            </div>
            <button 
              onClick={handleSearch}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm transition-all transform active:scale-95 text-sm"
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
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors text-sm"
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
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors text-left text-sm"
              />
            </div>

            <input 
              type="number" 
              name="qty"
              placeholder="QTY" 
              value={formData.qty}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors text-sm"
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
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors text-sm"
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
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors text-left text-sm"
              />
            </div>

            <div className="flex rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors bg-white">
              <span className="bg-black text-white px-4 flex items-center justify-center font-bold text-sm tracking-wider">
                RS:
              </span>
              <input 
                type="text" 
                name="unitPrice"
                placeholder="Unit Price" 
                value={formData.unitPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-3 focus:outline-none placeholder-gray-400 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 max-w-xl mx-auto">
          <button 
            onClick={handleAdd}
            disabled={loading || !!editingId}
            className={`w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95 text-sm ${!!editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Plus size={18} />
            Add Batch
          </button>
          
          <button 
            onClick={handleUpdate}
            disabled={loading || !editingId}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95 text-sm disabled:opacity-50"
          >
            <RefreshCw size={18} />
            Update Specifications
          </button>
          
          <button 
            onClick={clearForm}
            className="w-full py-3.5 text-gray-500 hover:text-gray-700 border-2 border-gray-300 hover:border-gray-400 font-semibold rounded-xl flex items-center justify-center shadow-sm transition-all transform active:scale-95 text-sm bg-white"
          >
            {editingId ? "Cancel Edit" : "Clear Form"}
          </button>
        </div>
      </div>

      {/* SECTION 1: Active Inventory Panel */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 max-w-7xl mx-auto overflow-hidden transform transition-all duration-300 animate-slideUp delay-75">
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
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 max-w-7xl mx-auto overflow-hidden transform transition-all duration-300 animate-slideUp delay-150">
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