function MedicineForm({ medicines, setMedicines, selected, setSelected, form, setForm }) {

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.name?.trim()) return alert("Medicine name is required.");
    const newEntry = {
      id: Date.now(),
      name: form.name,
      supplier: form.supplier,
      expireDate: form.expireDate,
      manufactureDate: form.manufactureDate,
      qty: form.qty,
      unitPrice: form.unitPrice,
    };
    setMedicines([...medicines, newEntry]);
    setForm({ id: "", name: "", supplier: "", expireDate: "", manufactureDate: "", qty: "", unitPrice: "" });
    setSelected(null);
  };

  const handleUpdate = () => {
    if (!selected) return alert("Click a row first to select it for updating.");
    setMedicines(
      medicines.map((m) =>
        m.id === selected.id
          ? { ...m, name: form.name, supplier: form.supplier, expireDate: form.expireDate, manufactureDate: form.manufactureDate, qty: form.qty, unitPrice: form.unitPrice }
          : m
      )
    );
    setForm({ id: "", name: "", supplier: "", expireDate: "", manufactureDate: "", qty: "", unitPrice: "" });
    setSelected(null);
  };

  const handleDelete = () => {
    if (!selected) return alert("Click a row first to select it for deletion.");
    setMedicines(medicines.filter((m) => m.id !== selected.id));
    setForm({ id: "", name: "", supplier: "", expireDate: "", manufactureDate: "", qty: "", unitPrice: "" });
    setSelected(null);
  };

  const handleSearch = () => {
    const query = (form._search ?? "").toLowerCase().trim();
    const found = medicines.find(
      (m) => String(m.id) === query || m.name.toLowerCase().includes(query)
    );
    if (found) {
      setForm({ ...found, _search: form._search });
      setSelected(found);
    } else {
      alert("Medicine not found.");
    }
  };

  const handleGenerateReport = () => {
    const rows = medicines
      .map((m, i) => `${i + 1}\t${m.name}\t${m.expireDate}\t${m.manufactureDate}\t${m.supplier}\t${m.unitPrice}\t${m.qty}`)
      .join("\n");
    const content = `ID\tMedicine Name\tExpire Date\tManufacture Date\tSupplier\tUnit Price\tQTY\n${rows}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "medicine_report.txt";
    a.click();
  };

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-purple-500 transition bg-white placeholder-gray-400";

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mb-5">
      <h2 className="text-lg font-bold text-gray-800 mb-5">Medicine Management</h2>

      {/* Top row: Generate Report + Search */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <button
          onClick={handleGenerateReport}
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold text-sm px-5 py-3 rounded-xl hover:opacity-90 transition whitespace-nowrap"
        >
          Generate Report
        </button>

        <div className="flex items-center gap-3">
          <input
            className={inputClass}
            type="text"
            placeholder="Medicine ID"
            value={form._search ?? ""}
            onChange={(e) => setForm({ ...form, _search: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-400 text-gray-900 font-bold text-sm px-5 py-3 rounded-xl hover:opacity-90 transition whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </div>

      {/* Form grid */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <input className={inputClass} type="text" name="name" placeholder="Medicine name" value={form.name ?? ""} onChange={handleChange} />
        <input className={inputClass} type="text" name="supplier" placeholder="Supplier Name" value={form.supplier ?? ""} onChange={handleChange} />
        <input className={inputClass} type="date" name="expireDate" placeholder="Expire Date" value={form.expireDate ?? ""} onChange={handleChange} />
        <input className={inputClass} type="date" name="manufactureDate" placeholder="Manufacture Date" value={form.manufactureDate ?? ""} onChange={handleChange} />
        <input className={inputClass} type="number" name="qty" placeholder="QTY" value={form.qty ?? ""} onChange={handleChange} />

        {/* RS: prefix + Unit Price */}
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-purple-500 transition">
          <span className="bg-gray-900 text-white text-xs font-bold px-4 py-3 whitespace-nowrap">RS:</span>
          <input
            className="flex-1 px-4 py-3 text-sm text-gray-700 outline-none bg-white placeholder-gray-400"
            type="number"
            name="unitPrice"
            placeholder="Unit Price"
            value={form.unitPrice ?? ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-5">
        <button onClick={handleAdd} className="bg-green-500 hover:bg-green-600 text-white font-bold px-9 py-3 rounded-xl transition">
          Add
        </button>
        <button onClick={handleUpdate} className="bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 text-white font-bold px-9 py-3 rounded-xl transition">
          Update
        </button>
        <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-bold px-9 py-3 rounded-xl transition">
          Delete
        </button>
      </div>
    </div>
  );
}

export default MedicineForm;