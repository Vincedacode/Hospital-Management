import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";

import Dashboard from "./pages/admin/Dashboard";
import Staff from "./pages/admin/StaffManagement";
import Pharmacy from "./pages/admin/PharmacyManagement";
import Patient from "./pages/admin/PatientManagement";
import Appointments from "./pages/admin/AppointmentManagement";
import Medicines from "./pages/admin/MedicineManagement";
import Invoices from "./pages/admin/InvoiceManagement";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<DashboardLayout />}>

        {/* DEFAULT ROUTE */}
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="staff" element={<Staff />} />
        <Route path="pharmacy" element={<Pharmacy />} />
        <Route path="patient" element={<Patient />} />
        <Route path="appointments" element={<Appointments/>}/>
        <Route path="medicines" element={<Medicines />} />
        <Route path="invoices" element={<Invoices />} />
      </Route>
    </Routes>
  );
}

export default App;