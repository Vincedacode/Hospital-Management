import { FaEdit, FaTrash } from "react-icons/fa";

function MedicineTable({ medicines, setMedicines, selected, setSelected, setForm }) {

  const handleEdit = (medicine) => {
    setSelected(medicine);
    setForm(medicine);
  };

  const handleDelete = (id) => {
    setMedicines(medicines.filter((m) => m.id !== id));
    if (selected?.id === id) {
      setSelected(null);
      setForm({ id: "", name: "", supplier: "", expireDate: "", manufactureDate: "", qty: "", unitPrice: "" });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-800">Out of Stock</h3>
        <p className="text-xs text-gray-400 mt-1">Track and manage all medicine inventory below.</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-100">
              <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs whitespace-nowrap">ID</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs whitespace-nowrap">Medicine Name</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs whitespace-nowrap">Expire Date</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs whitespace-nowrap">Manufacture Date</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs whitespace-nowrap">Supplier Name</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs whitespace-nowrap">Unit Price</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs whitespace-nowrap">QTY</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700 text-xs whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-300 py-10 text-sm">
                  No medicines added yet.
                </td>
              </tr>
            ) : (
              medicines.map((m, index) => (
                <tr
                  key={m.id}
                  onClick={() => handleEdit(m)}
                  className={`border-b border-gray-50 cursor-pointer transition-colors duration-150 ${
                    selected?.id === m.id ? "bg-purple-50" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-gray-500">{m.expireDate}</td>
                  <td className="px-4 py-3 text-gray-500">{m.manufactureDate}</td>
                  <td className="px-4 py-3 text-gray-500">{m.supplier}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {m.unitPrice ? parseFloat(m.unitPrice).toFixed(2) : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{m.qty}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(m); }}
                        className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }}
                        className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition"
                        title="Delete"
                      >
                        <FaTrash />
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
  );
}

export default MedicineTable;