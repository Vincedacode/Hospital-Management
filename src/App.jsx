import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";

// Import your Login Component
import Login from "./pages/auth/Login"; 

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
      {/* 1. STANDALONE ROOT TRACKS (No Navbars or Sidebars) */}
      <>
        {/* Directing base domain path '/' straight to your secure login portal */}
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
      </>

      {/* 2. PROTECTED ADMIN LAYOUT TRACKS (Includes Navbars/Sidebars) */}
      <Route path="/admin" element={<DashboardLayout />} >
        {/* Default route inside /admin space fallback */}
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

      {/* 3. GLOBAL FALLBACK ROUTE */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;