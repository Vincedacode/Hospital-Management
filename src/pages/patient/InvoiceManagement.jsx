import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Download,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock3,
  XCircle,
  Loader2,
  Sparkles,
  DollarSign
} from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getInvoices } from "../../services/invoiceService";

function InvoiceManagement() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const currentPatientName = localStorage.getItem("patient_name");
      const allInvoices = await getInvoices();
      
      const myInvoices = allInvoices.filter(
        (inv) => inv.patientName === currentPatientName
      );
      setInvoices(myInvoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateInvoiceStatus = async (invoiceId, newStatus) => {
    const action = newStatus === "paid" ? "accept" : "reject";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this medical bill?`
    );

    if (!confirmed) return;

    try {
      const invoiceRef = doc(db, "invoices", invoiceId);
      await updateDoc(invoiceRef, {
        paymentStatus: newStatus.toLowerCase(),
        updatedAt: new Date(),
      });

      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoiceId
            ? { ...inv, paymentStatus: newStatus.toLowerCase() }
            : inv
        )
      );

      alert(`Bill ${action}ed successfully!`);
    } catch (error) {
      console.error("Error updating invoice:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.id?.toLowerCase().includes(search.toLowerCase()) ||
      inv.treatment?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (status = "Pending") => {
    const s = (status || "Pending").toLowerCase();
    switch (s) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 size={13} /> Paid
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 border border-rose-200/60 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <XCircle size={13} /> Rejected
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200/60 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Clock3 size={13} /> Pending
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-50 border border-red-200/60 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
            <AlertCircle size={13} /> Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            {status || "Pending"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 bg-slate-50/40 min-h-screen">
      
      {/* HEADER HERO BANNER */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 p-6 md:p-8 text-white shadow-xl shadow-purple-600/10 border border-white/10">
        <div className="absolute -right-6 -bottom-12 opacity-10 pointer-events-none">
          <FileText size={240} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-3 text-xs font-semibold tracking-wider uppercase text-purple-100">
              <Sparkles size={12} className="text-amber-300" />
              <span>Financial Overview</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Billing & Invoices</h1>
            <p className="mt-1.5 text-sm text-purple-100/80 font-light max-w-md">
              Review breakdowns of your current treatments, track historical itemizations, and settle outstanding medical tabs quickly.
            </p>
          </div>
        </div>
      </div>

      {/* FILTER SEARCH BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-md shadow-slate-200/30 flex items-center gap-3 transition-all focus-within:border-purple-400">
        <Search size={20} className="text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Search by Invoice reference token ID or treatment nature..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm focus:outline-none font-medium"
        />
        {search && (
          <button 
            onClick={() => setSearch("")} 
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <XCircle size={16} />
          </button>
        )}
      </div>

      {/* TABLE SECTION WRAPPER */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500"></div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 w-16 h-16 bg-purple-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
              <Loader2 className="relative animate-spin text-purple-600 z-10" size={40} />
            </div>
            <p className="text-slate-500 text-sm font-medium tracking-wide animate-pulse">Compiling billing ledgers...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="p-4 bg-purple-50 rounded-2xl text-purple-500 mb-4">
              <DollarSign size={36} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No statement matching parameters</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xs">You have no recorded invoices loaded under this filter query currently.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4.5">Invoice ID</th>
                  <th className="px-6 py-4.5">Treatment / Care Scope</th>
                  <th className="px-6 py-4.5">Gross Amount</th>
                  <th className="px-6 py-4.5">Status Label</th>
                  <th className="px-6 py-4.5 text-right">Actions Pane</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="group hover:bg-slate-50/40 transition-colors duration-200">
                    <td className="px-6 py-4.5">
                      <span className="font-mono text-xs font-semibold text-purple-600 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-lg">
                        #{inv.id?.substring(0, 8).toUpperCase()}...
                      </span>
                    </td>
                    <td className="px-6 py-4.5 font-bold text-slate-800">
                      {inv.treatment}
                    </td>
                    <td className="px-6 py-4.5 font-black text-slate-900 text-base">
                      {inv.amount}
                    </td>
                    <td className="px-6 py-4.5">
                      {getStatus(inv.paymentStatus)}
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {(inv.paymentStatus || "Pending").toLowerCase() === "pending" ? (
                          <>
                            <button
                              onClick={() => handleUpdateInvoiceStatus(inv.id, "paid")}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition duration-200 active:scale-95 shadow-sm shadow-emerald-200"
                            >
                              Accept Bill
                            </button>
                            <button
                              onClick={() => handleUpdateInvoiceStatus(inv.id, "rejected")}
                              className="bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-200 text-slate-600 font-bold px-4 py-2 rounded-xl text-xs transition duration-200 active:scale-95"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 italic font-medium pr-2 select-none">
                            Archived
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvoiceManagement;