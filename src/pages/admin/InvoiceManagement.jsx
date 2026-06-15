import React, { useState, useEffect } from "react";
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
  X
} from "lucide-react";

// Import your Firestore services
import { 
  createInvoice, 
  getInvoices, 
  updateInvoice, 
  deleteInvoice 
} from "../../services/invoiceService"; // Adjust path as needed

// Mock imports for other collections you'd normally link to.
// Swap these with your real services once you have them!
import { getPatients } from "../../services/patientService";
import { getStaff } from "../../services/staffService";

const InvoiceManagement = () => {
  // --- States ---
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Form Field State
  const [formData, setFormData] = useState({
    patientName: "",
    labName: "",
    wardNumber: "",
    doctorName: "",
    treatment: ""
  });

  // Base pricing configurations for automated checkout totals
  const pricingRates = {
    treatment: { "Dengue Treatment": 10000, "Malaria Check": 4000, "General Consultation": 2500, "None / Checkup": 0 },
    lab: { "Blood Lab Panel": 5000, "Urinalysis": 2000, "X-Ray Imaging": 12000, "None": 0 }
  };

  // --- Fetch System Dependencies ---
  const loadDependencies = async () => {
    try {
      const allInvoices = await getInvoices();
      setInvoices(allInvoices);

      // Attempt to load registry collections safely if available
      if (getPatients) {
        const patientData = await getPatients();
        setPatients(patientData);
      }
      if (getStaff) {
        const staffData = await getStaff();
        const activeDocs = staffData.filter(s => s.role?.toLowerCase() === 'doctor');
        setDoctors(activeDocs);
      }
    } catch (error) {
      console.error("Dependency initialization error:", error);
    }
  };

  useEffect(() => {
    loadDependencies();
  }, []);

  // --- Calculations ---
  const calculatedTotal = 
    (pricingRates.treatment[formData.treatment] || 0) + 
    (pricingRates.lab[formData.labName] || 0);

  // --- Form Actions ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setFormData({
      patientName: "",
      labName: "",
      wardNumber: "",
      doctorName: "",
      treatment: ""
    });
    setEditingId(null);
  };

  // CREATE / UPDATE Handle
  const handleSubmitBill = async (e) => {
    e.preventDefault();
    if (!formData.patientName || formData.patientName === "Patient Name") {
      alert("Please select a registered patient.");
      return;
    }

const payload = {
  ...formData,
  amount: `₦${calculatedTotal.toLocaleString()}`,
  paymentStatus: editingId
    ? invoices.find(i => i.id === editingId)?.paymentStatus || "Pending"
    : "Pending",
};

    try {
      if (editingId) {
        await updateInvoice(editingId, payload);
        alert("Invoice updated successfully!");
      } else {
        await createInvoice(payload);
        alert("Invoice generated and logged successfully!");
      }
      clearForm();
      const updatedList = await getInvoices();
      setInvoices(updatedList);
    } catch (error) {
      alert("Failed to save transaction record.");
    }
  };

  // LOAD FOR EDITING
  const startEdit = (invoice) => {
    setEditingId(invoice.id);
    setFormData({
      patientName: invoice.patientName || "",
      labName: invoice.labName || "",
      wardNumber: invoice.wardNumber || "",
      doctorName: invoice.doctorName || "",
      treatment: invoice.treatment || ""
    });
  };

  // DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Permanently purge this invoice record from historical accounting ledger files?")) {
      try {
        await deleteInvoice(id);
        if (id === editingId) clearForm();
        const updatedList = await getInvoices();
        setInvoices(updatedList);
      } catch (error) {
        alert("Error executing record erasure.");
      }
    }
  };

  // SEARCH FILTER
  const filteredInvoices = invoices.filter(inv => {
    const query = searchQuery.toLowerCase();
    return (
      inv.id?.toLowerCase().includes(query) ||
      inv.patientName?.toLowerCase().includes(query) ||
      inv.doctorName?.toLowerCase().includes(query)
    );
  });

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
          <div className="text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-2 rounded-lg">
            {editingId ? `⚠️ Editing Invoice Ref: ${editingId.substring(0, 8)}...` : "✨ Generating New Entry"}
          </div>

          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search Patient, Doctor, or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 placeholder-gray-400 transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Input Form Grid */}
        <form onSubmit={handleSubmitBill}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left Column */}
            <div className="space-y-5">
              
              {/* Dynamic Patient Selector */}
              <div className="relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors bg-white">
                <span className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                  <User size={18} />
                </span>
                <select 
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-gray-700 focus:outline-none appearance-none cursor-pointer text-sm"
                >
                  <option value="">Select Patient</option>
                  {patients.length > 0 ? (
                    patients.map(p => (
                      <option key={p.id} value={`${p.firstName} ${p.lastName}`}>{p.firstName} {p.lastName}</option>
                    ))
                  ) : (
                    <>
                      <option value="Sapooth">Sapooth (Fallback Profile)</option>
                      <option value="John Doe">John Doe</option>
                    </>
                  )}
                </select>
              </div>

              {/* Dynamic Lab Menu */}
              <div className="relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors bg-white">
                <span className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                  <FlaskConical size={18} />
                </span>
                <select 
                  name="labName"
                  value={formData.labName}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-gray-700 focus:outline-none appearance-none cursor-pointer text-sm"
                >
                  <option value="">No Lab Work / Select Lab</option>
                  {Object.keys(pricingRates.lab).map(lab => (
                    <option key={lab} value={lab}>{lab}</option>
                  ))}
                </select>
              </div>

              {/* Ward Entry Field */}
              <div className="relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors bg-white">
                <span className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                  <BedDouble size={18} />
                </span>
                <input
                  type="text"
                  name="wardNumber"
                  placeholder="Ward Number (e.g., General Ward 01)"
                  value={formData.wardNumber}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-gray-700 focus:outline-none placeholder-gray-400 text-sm"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              
              {/* Dynamic Doctor Selector */}
              <div className="relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors bg-white">
                <span className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                  <Stethoscope size={18} />
                </span>
                <select 
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-gray-700 focus:outline-none appearance-none cursor-pointer text-sm"
                >
                  <option value="">Select Doctor</option>
                  {doctors.length > 0 ? (
                    doctors.map(d => (
                      <option key={d.id} value={`Dr. ${d.firstName} ${d.lastName}`}>Dr. {d.firstName} {d.lastName}</option>
                    ))
                  ) : (
                    <>
                      <option value="Dr. Rajitha">Dr. Rajitha</option>
                      <option value="Dr. Alao Obasanjo">Dr. Alao Obasanjo</option>
                    </>
                  )}
                </select>
              </div>

              {/* Treatment Workload Menu */}
              <div className="relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden transition-colors bg-white">
                <span className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                  <Activity size={18} />
                </span>
                <select 
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-gray-700 focus:outline-none appearance-none cursor-pointer text-sm"
                >
                  <option value="">Select Treatment Class</option>
                  {Object.keys(pricingRates.treatment).map(treat => (
                    <option key={treat} value={treat}>{treat}</option>
                  ))}
                </select>
              </div>

              {/* Grand Total Readout Box */}
              <div className="text-right flex items-center justify-end h-12">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                  Total Amount : <span className="text-purple-600">₦{calculatedTotal.toLocaleString()}</span>
                </h2>
              </div>
            </div>
          </div>

          {/* Form Actions Layout Grid */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto mt-10">
            <button 
              type="submit"
              className="w-full py-3.5 text-white font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Receipt size={20} />
              {editingId ? "Update Saved Invoice" : "Generate Bill"}
            </button>
            
            {editingId && (
              <button 
                type="button"
                onClick={clearForm}
                className="w-full sm:w-auto px-6 py-3.5 text-gray-500 hover:text-gray-700 border-2 border-gray-300 hover:border-gray-400 font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors"
              >
                <X size={16} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Recent Invoices Table Panel */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 max-w-7xl mx-auto overflow-hidden">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Invoices Registry</h2>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold uppercase text-gray-600 tracking-wider w-24 text-center">Invoice ID</th>
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
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-sm text-center text-gray-400">
                    No matching generated invoices found in this directory.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice, index) => (
                  <tr 
                    key={invoice.id} 
                    className={`hover:bg-gray-50/70 transition-colors ${index % 2 === 1 ? 'bg-gray-50/30' : ''} ${editingId === invoice.id ? 'bg-purple-50' : ''}`}
                  >
                    <td className="p-4 text-xs font-mono font-bold text-indigo-600 text-center" title={invoice.id}>
                      {invoice.id.substring(0, 7)}...
                    </td>
                    <td className="p-4 text-sm font-semibold text-gray-900">{invoice.patientName}</td>
                    <td className="p-4 text-sm text-gray-600">{invoice.labName || "—"}</td>
                    <td className="p-4 text-sm text-gray-600 text-center">{invoice.wardNumber || "—"}</td>
                    <td className="p-4 text-sm text-gray-600">{invoice.doctorName}</td>
                    <td className="p-4 text-sm text-gray-600">{invoice.treatment || "—"}</td>
                    <td className="p-4 text-sm font-bold text-purple-600 text-right">{invoice.amount}</td>

                    <td className="p-4 text-sm text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => startEdit(invoice)}
                          className="text-indigo-500 hover:text-indigo-700 p-1 rounded hover:bg-indigo-50 transition-colors"
                          title="Edit Invoice Parameters"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(invoice.id)}
                          className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Void / Delete Invoice"
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
  );
};

export default InvoiceManagement;