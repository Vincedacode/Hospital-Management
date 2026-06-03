// src/pages/InvoiceManagement.jsx

import React from "react";

const InvoiceManagement = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Invoice Form Section */}
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <button className="px-8 py-3 text-white rounded-xl bg-gradient-to-r from-purple-500 to-slate-600">
            Generate Report
          </button>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Invoice ID"
              className="border-2 border-gray-400 rounded-lg px-4 py-2 w-64"
            />
            <button className="px-8 py-2 bg-yellow-400 text-white rounded-xl">
              Search
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <select className="w-full border-2 border-gray-400 rounded-lg p-3">
              <option>Patient Name</option>
            </select>

            <select className="w-full border-2 border-gray-400 rounded-lg p-3">
              <option>Lab Name</option>
            </select>

            <input
              type="text"
              placeholder="Ward Number"
              className="w-full border-2 border-gray-400 rounded-lg p-3"
            />
          </div>

          <div className="space-y-6">
            <select className="w-full border-2 border-gray-400 rounded-lg p-3">
              <option>Doctor Name</option>
            </select>

            <select className="w-full border-2 border-gray-400 rounded-lg p-3">
              <option>Treatment</option>
            </select>

            <div className="text-right">
              <h2 className="text-3xl font-semibold">
                Total Amount : ₦15,000
              </h2>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button className="w-full max-w-lg py-4 text-white rounded-xl bg-gradient-to-r from-purple-500 to-slate-600">
            Generate Bill
          </button>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Recent Invoices</h2>

        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Patient Name</th>
              <th className="p-3">Lab Name</th>
              <th className="p-3">Ward No</th>
              <th className="p-3">Doctor Name</th>
              <th className="p-3">Treatment</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {[1, 2, 3, 4].map((invoice) => (
              <tr key={invoice} className="border-b">
                <td className="p-3">{invoice}</td>
                <td className="p-3">Sapooth</td>
                <td className="p-3">Blood Lab</td>
                <td className="p-3">1</td>
                <td className="p-3">Dr. Rajitha</td>
                <td className="p-3">Dengue</td>
                <td className="p-3">₦15,000</td>

                <td className="p-3 flex gap-3 justify-center">
                  <button>✏️</button>
                  <button>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceManagement;