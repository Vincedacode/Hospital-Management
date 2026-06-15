import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./components/DashboardLayout";
import StaffLayout from "./components/StaffLayout";
import PatientLayout from "./components/PatientLayout";

// Auth
import Login from "./pages/auth/Login";

// Admin
import Dashboard from "./pages/admin/Dashboard";
import Staff from "./pages/admin/StaffManagement";
import Pharmacy from "./pages/admin/PharmacyManagement";
import Patient from "./pages/admin/PatientManagement";
import Appointments from "./pages/admin/AppointmentManagement";
import Medicines from "./pages/admin/MedicineManagement";
import Invoices from "./pages/admin/InvoiceManagement";

// Staff Portal
import StaffDashboard from "./pages/staff/Dashboard";
import StaffPatients from "./pages/staff/PatientManagement";
import StaffAppointments from "./pages/staff/AppointmentManagement";
import StaffInvoices from "./pages/staff/InvoiceManagement";
import StaffProfile from "./pages/staff/Profile";

// Patient Portal
import PatientDashboard from "./pages/patient/Dashboard";
import PatientAppointments from "./pages/patient/AppointmentManagement";
import PatientInvoices from "./pages/patient/InvoiceManagement";
import PatientProfile from "./pages/patient/Profile";

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route index element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Admin */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="staff" element={<Staff />} />
        <Route path="pharmacy" element={<Pharmacy />} />
        <Route path="patient" element={<Patient />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="medicines" element={<Medicines />} />
        <Route path="invoices" element={<Invoices />} />
      </Route>

      {/* Staff */}
      <Route path="/staff" element={<StaffLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="patients" element={<StaffPatients />} />
        <Route path="appointments" element={<StaffAppointments />} />
        <Route path="invoices" element={<StaffInvoices />} />
        <Route path="profile" element={<StaffProfile />} />
      </Route>

      {/* Patient */}
      <Route path="/patient" element={<PatientLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="invoices" element={<PatientInvoices />} />
        <Route path="profile" element={<PatientProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;