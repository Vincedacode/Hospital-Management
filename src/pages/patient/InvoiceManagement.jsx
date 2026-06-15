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
          <span className="flex items-center gap-1 text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-semibold w-fit">
            <CheckCircle2 size={14} /> Paid
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 text-red-700 bg-red-100 px-3 py-1 rounded-full text-xs font-semibold w-fit">
            <XCircle size={14} /> Rejected
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center gap-1 text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full text-xs font-semibold w-fit">
            <Clock3 size={14} /> Pending
          </span>
        );
      case "overdue":
        return (
          <span className="flex items-center gap-1 text-red-700 bg-red-100 px-3 py-1 rounded-full text-xs font-semibold w-fit">
            <AlertCircle size={14} /> Overdue
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
            {status || "Pending"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-100">
            <FileText className="text-purple-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Invoices</h1>
            <p className="text-gray-500 mt-1">View your medical bills and payment history</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Invoice ID or Treatment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading your invoices...</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No invoices found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-sm text-gray-600">
                <tr>
                  <th className="px-6 py-4">Invoice ID</th>
                  <th className="px-6 py-4">Treatment</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{inv.id?.substring(0, 8)}...</td>
                    <td className="px-6 py-4">{inv.treatment}</td>
                    <td className="px-6 py-4 font-semibold">{inv.amount}</td>
                    <td className="px-6 py-4">{getStatus(inv.paymentStatus)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                      
                       {(inv.paymentStatus || "Pending").toLowerCase() === "pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateInvoiceStatus(inv.id, "paid")}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateInvoiceStatus(inv.id, "rejected")}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition"
                            >
                              Reject
                            </button>
                          </>
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