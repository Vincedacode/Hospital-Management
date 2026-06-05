import { useState } from "react";
import Sidebar from "../components/SideBar";
import NavBar from "../components/NavBar";
import MedicineForm from "../components/MedicineForm";
import MedicineTable from "../components/MedicineTable";

const INITIAL_MEDICINES = [
  { id: 1, name: "Vitamin C",    expireDate: "2025-04-13", manufactureDate: "2021-12-13", supplier: "Kane", unitPrice: "1500", qty: "150" },
  { id: 2, name: "Paracetamol",  expireDate: "2025-05-13", manufactureDate: "2022-04-04", supplier: "Kane", unitPrice: "4500", qty: "225" },
  { id: 3, name: "Avatar",       expireDate: "2026-01-16", manufactureDate: "2020-06-08", supplier: "Kane", unitPrice: "5000", qty: "65"  },
  { id: 4, name: "Amoxicillin",  expireDate: "2024-12-13", manufactureDate: "2021-01-13", supplier: "Kane", unitPrice: "1200", qty: "275" },
  { id: 5, name: "Ibuprofen",    expireDate: "2025-08-20", manufactureDate: "2022-02-10", supplier: "Kane", unitPrice: "2000", qty: "180" },
];

const EMPTY_FORM = { id: "", name: "", supplier: "", expireDate: "", manufactureDate: "", qty: "", unitPrice: "" };

function Pharmacy() {
  const [medicines, setMedicines] = useState(INITIAL_MEDICINES);
  const [selected, setSelected]   = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <NavBar />

        <div className="flex-1 overflow-y-auto p-6">
          <MedicineForm
            medicines={medicines}
            setMedicines={setMedicines}
            selected={selected}
            setSelected={setSelected}
            form={form}
            setForm={setForm}
          />
          <MedicineTable
            medicines={medicines}
            setMedicines={setMedicines}
            selected={selected}
            setSelected={setSelected}
            setForm={setForm}
          />
        </div>
      </div>
    </div>
  );
}

export default Pharmacy;