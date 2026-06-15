import React, { useState, useEffect } from "react";
import { 
  Receipt, 
  Search, 
  Eye, 
  Printer, 
  CheckCircle, 
  Clock3, 
  DollarSign, 
  FileText, 
  Loader2,
  Activity,
  X
} from "lucide-react";

import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

function InvoiceManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Detail Modal tracking state parameters
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Aggregated Statistical Metrics states
  const [stats, setStats] = useState({
    totalCount: 0,
    paidCount: 0,
    pendingCount: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // Step 1: Query appointments assigned to this specific medical staff member
    const appointmentsRef = collection(db, "appointments");
    const apptQuery = query(appointmentsRef, where("assignedDoctorId", "==", currentUser.uid));

    const unsubscribeAppointments = onSnapshot(apptQuery, (appointmentsSnapshot) => {
      try {
        const uniquePatientNames = new Set();
        
        appointmentsSnapshot.forEach((apptDoc) => {
          const apptData = apptDoc.data();
          // Extract plain names matching the format created in your admin workflows
          if (apptData.patientName) {
            const cleanName = apptData.patientName.replace("Patient: ", "").trim();
            uniquePatientNames.add(cleanName);
          }
        });

        if (uniquePatientNames.size === 0) {
          setInvoices([]);
          setStats({ totalCount: 0, paidCount: 0, pendingCount: 0, totalRevenue: 0 });
          setLoading(false);
          return;
        }

        // Step 2: Open a real-time reactive subscription stream to the invoices collection
        const invoicesRef = collection(db, "invoices");
        
        const unsubscribeInvoices = onSnapshot(invoicesRef, (invoicesSnapshot) => {
          const matchingInvoices = [];
          let paid = 0;
          let pending = 0;
          let revenue = 0;

          invoicesSnapshot.forEach((invDoc) => {
            const invData = invDoc.data();
            const cleanPatientName = invData.patientName ? invData.patientName.trim() : "";

            // Relational check: Filter invoices based on patients treated by this staff member
            if (uniquePatientNames.has(cleanPatientName)) {
              
              // Calculate dynamic financial metrics safely
              const rawAmount = invData.amount || "₦0";
              const parsedAmount = Number(rawAmount.replace(/[^0-9.-]+/g, "")) || 0;
              
              // Standardize processing flags
              const rawStatus = invData.paymentStatus || (parsedAmount > 0 ? "Paid" : "Pending");
              const normalizedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

              if (normalizedStatus === "Paid") {
                paid++;
                revenue += parsedAmount;
              } else {
                pending++;
              }

              matchingInvoices.push({
                id: invDoc.id,
                patient: cleanPatientName,
                labName: invData.labName || "—",
                wardNumber: invData.wardNumber || "—",
                doctorName: invData.doctorName || "—",
                treatment: invData.treatment || "—",
                amount: rawAmount,
                paymentStatus: normalizedStatus
              });
            }
          });

          setInvoices(matchingInvoices);
          setStats({
            totalCount: matchingInvoices.length,
            paidCount: paid,
            pendingCount: pending,
            totalRevenue: revenue
          });
          setLoading(false);
        });

        return () => unsubscribeInvoices();

      } catch (error) {
        console.error("Relational staff indexing synchronization breakdown:", error);
        setLoading(false);
      }
    });

    return () => unsubscribeAppointments();
  }, []);

  const handleOpenDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.patient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-sm font-semibold text-gray-500 tracking-wide">Syncing Clinical Financial Ledgers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 relative font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="text-indigo-600" size={26} /> Invoice Overview Panel
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Displaying historical payment data and invoices generated for patients under your care.
          </p>
        </div>

        {/* Statistics Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Pool Invoices</p>
              <h2 className="text-3xl font-bold text-gray-800">{stats.totalCount}</h2>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><FileText size={22} /></div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Settled Records</p>
              <h2 className="text-3xl font-bold text-gray-800">{stats.paidCount}</h2>
            </div>
            <div className="p-3 bg-green-50 rounded-xl text-green-600"><CheckCircle size={22} /></div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Outstanding Claims</p>
              <h2 className="text-3xl font-bold text-gray-800">{stats.pendingCount}</h2>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600"><Clock3 size={22} /></div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Associated Revenue</p>
              <h2 className="text-3xl font-bold text-gray-800">₦{stats.totalRevenue.toLocaleString()}</h2>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><DollarSign size={22} /></div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="relative max-w-md w-full">
            <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Invoice Reference ID or Patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Main Matrix Board Card Element */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/40">
            <h2 className="font-bold text-gray-800 text-base">Billing Ledgers Directory</h2>
          </div>

          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden lg:block">
            <table className="w-full text-sm min-w-[950px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 text-center w-24">Invoice ID</th>
                  <th className="p-4 text-left">Patient Name</th>
                  <th className="p-4 text-left">Lab Name</th>
                  <th className="p-4 text-center w-24">Ward No</th>
                  <th className="p-4 text-left">Attending Doctor</th>
                  <th className="p-4 text-left">Treatment Details</th>
                  <th className="p-4 text-left">Payment Status</th>
                  <th className="p-4 text-right">Billed Amount</th>
                  <th className="p-4 text-center w-48">Operational Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-indigo-50/20 transition-colors">
                      <td className="p-4 font-mono text-xs text-indigo-600 font-bold text-center">
                        {invoice.id.substring(0, 7)}...
                      </td>
                      <td className="p-4 font-semibold text-gray-900">{invoice.patient}</td>
                      <td className="p-4 text-gray-500">{invoice.labName}</td>
                      <td className="p-4 text-center font-medium text-gray-500">{invoice.wardNumber}</td>
                      <td className="p-4 text-gray-600 font-medium">{invoice.doctorName}</td>
                      <td className="p-4 text-gray-500 italic font-medium">{invoice.treatment}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(invoice.paymentStatus)}`}>
                          {invoice.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-purple-600 text-right font-mono">{invoice.amount}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleOpenDetails(invoice)}
                            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm"
                          >
                            <Eye size={14} /> View Statement
                          </button>
                          <button 
                            onClick={handlePrint}
                            className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                          >
                            <Printer size={14} /> Print
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-12 text-center text-gray-400 font-medium">
                      No matching historical invoices indexed under your designated patient records loop.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Handset Mobile Fluid Grid Panels Layout */}
          <div className="lg:hidden p-4 space-y-4">
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 text-base">{invoice.patient}</h3>
                      <p className="text-xs font-mono text-indigo-500 mt-0.5">{invoice.id.substring(0, 12)}...</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusStyle(invoice.paymentStatus)}`}>
                      {invoice.paymentStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-600 font-medium">
                    <p><strong>Billed Total Amount:</strong> <span className="font-bold text-purple-600 font-mono">{invoice.amount}</span></p>
                    <p><strong>Lab Classification:</strong> {invoice.labName}</p>
                    <p><strong>Treatment Class:</strong> {invoice.treatment}</p>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button 
                      onClick={() => handleOpenDetails(invoice)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl flex justify-center items-center gap-1.5 text-xs font-bold transition shadow-sm"
                    >
                      <Eye size={14} /> Full Details
                    </button>
                    <button 
                      onClick={handlePrint}
                      className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-xl flex justify-center items-center gap-1.5 text-xs font-bold transition"
                    >
                      <Printer size={14} /> Print
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm font-medium">
                No matching historical invoices indexed under your designated patient records loop.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide-out Backdrop Overlay */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={() => setIsModalOpen(false)}
        />
      )}

      {/* Slide-out Invoice Breakdown Sheet Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 border-l border-gray-100 p-6 overflow-y-auto transition-transform duration-300 ease-in-out ${
        isModalOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        {selectedInvoice && (
          <div className="space-y-6">
            
            {/* Header controls */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-md">
                  Clinical Statement Summary
                </span>
                <h2 className="text-xl font-bold text-gray-800 mt-2">Invoice Breakdown Sheet</h2>
                <p className="text-xs font-mono text-gray-400 mt-0.5">Reference Document ID: {selectedInvoice.id}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Core particulars details summary lists */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2.5 text-sm text-gray-600">
              <p><strong>Patient Account Name:</strong> <span className="text-gray-900 font-semibold float-right">{selectedInvoice.patient}</span></p>
              <p><strong>Attending Practitioner:</strong> <span className="text-gray-900 font-medium float-right">{selectedInvoice.doctorName}</span></p>
              <p><strong>Ward Allocation Target:</strong> <span className="text-gray-900 font-mono float-right">{selectedInvoice.wardNumber}</span></p>
            </div>

            {/* Treatment breakdown costs matrix segments */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Line Items Allocation Summary</h3>
              
              <div className="border border-gray-100 rounded-xl divide-y bg-white overflow-hidden text-sm">
                <div className="p-3.5 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">Clinical Treatment Task</p>
                    <p className="text-xs text-gray-400 mt-0.5">{selectedInvoice.treatment}</p>
                  </div>
                </div>

                <div className="p-3.5 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">Lab Diagnostic Pipeline</p>
                    <p className="text-xs text-gray-400 mt-0.5">{selectedInvoice.labName}</p>
                  </div>
                </div>

                {/* Pricing Grand total block */}
                <div className="p-4 bg-gray-50 flex justify-between items-center text-base font-bold text-gray-900">
                  <span>Grand Total Amount Due</span>
                  <span className="font-mono text-purple-600 text-lg">{selectedInvoice.amount}</span>
                </div>
              </div>
            </div>

            {/* Administrative Status Meta notice */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
              <strong>Administrative System Note:</strong> Billing metrics inside this panel are pulled dynamically from the primary accounting collections layer and cannot be edited by standard diagnostic practitioners.
            </div>

          </div>
        )}
      </div>

    </div>
  );
}

export default InvoiceManagement;