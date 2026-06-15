import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Eye,
  Phone,
  Mail,
  UserRound,
  CalendarDays,
  Loader2,
  Activity,
  X,
  MapPin,
  Fingerprint,
  ShieldAlert
} from "lucide-react";

import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

function PatientManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, male: 0, female: 0, newThisMonth: 0 });
  
  // Modal tracking states for the individual patient dossier details
  const [selectedPatientFile, setSelectedPatientFile] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const appointmentsRef = collection(db, "appointments");
    const q = query(appointmentsRef, where("assignedDoctorId", "==", currentUser.uid));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const uniquePatientIds = new Set();
        const appointmentGroupMap = {};

        snapshot.forEach((appointmentDoc) => {
          const apptData = appointmentDoc.data();
          if (apptData.patientId) {
            uniquePatientIds.add(apptData.patientId);
            if (!appointmentGroupMap[apptData.patientId]) {
              appointmentGroupMap[apptData.patientId] = [];
            }
            appointmentGroupMap[apptData.patientId].push(apptData);
          }
        });

        const patientProfilesPromises = Array.from(uniquePatientIds).map(async (patientId) => {
          const patientDocRef = doc(db, "patients", patientId);
          const patientSnap = await getDoc(patientDocRef);
          
          if (patientSnap.exists()) {
            const pData = patientSnap.data();
            const userAppts = appointmentGroupMap[patientId] || [];
            const sortedAppts = userAppts.sort((a, b) => 
              new Date(b.appointmentDate) - new Date(a.appointmentDate)
            );
            
            const verifiedLastVisit = sortedAppts[0]?.appointmentDate || "Pending Examination";

            return {
              id: patientSnap.id,
              firstName: pData.firstName || "Unknown",
              lastName: pData.lastName || "Patient",
              gender: pData.gender || "Unassigned",
              phone: pData.phone || pData.mobile || "No Phone",
              email: pData.email || "No Email",
              lastVisit: verifiedLastVisit,
              createdAt: pData.createdAt ? pData.createdAt.toDate() : new Date(),
              
              // New schema fields mapped to reveal inside file detail window
              address: pData.address || "Not Provided",
              dob: pData.dob || "—",
              nic: pData.nic || "—",
              role: pData.role || "patient"
            };
          }
          return null;
        });

        const resolvedProfiles = (await Promise.all(patientProfilesPromises)).filter(Boolean);

        let maleCount = 0;
        let femaleCount = 0;
        let newCount = 0;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        resolvedProfiles.forEach((profile) => {
          const gen = profile.gender.toLowerCase();
          if (gen === "male") maleCount++;
          if (gen === "female") femaleCount++;
          if (profile.createdAt && profile.createdAt.getMonth() === currentMonth && profile.createdAt.getFullYear() === currentYear) {
            newCount++;
          }
        });

        setPatients(resolvedProfiles);
        setStats({ total: resolvedProfiles.length, male: maleCount, female: femaleCount, newThisMonth: newCount });
      } catch (err) {
        console.error("Error reading updated data maps:", err);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error("Error with Firestore snapshot listener:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenPatientFile = (patient) => {
    setSelectedPatientFile(patient);
    setIsDrawerOpen(true);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center gap-4">
        <Loader2 className="animate-spin text-purple-600" size={40} />
        <p className="text-sm font-semibold text-gray-500 tracking-wide">Syncing Security Credentials & Registers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Block */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="text-purple-600" size={26} /> Patient Registry Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Secure ID-verified medical records synchronized with your active appointment queue.
          </p>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Assigned Patients</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</h2>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600"><Users size={22} /></div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Male Attendees</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-1">{stats.male}</h2>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><UserRound size={22} /></div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Female Attendees</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-1">{stats.female}</h2>
            </div>
            <div className="p-3 bg-pink-50 rounded-xl text-pink-600"><UserRound size={22} /></div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Intakes This Month</p>
              <h2 className="text-3xl font-bold text-gray-800 mt-1">{stats.newThisMonth}</h2>
            </div>
            <div className="p-3 bg-green-50 rounded-xl text-green-600"><CalendarDays size={22} /></div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="relative max-w-md w-full">
            <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search assigned patient profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 bg-gray-50/50 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
            />
          </div>
        </div>

        {/* Table View Layout */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/40">
            <h2 className="text-base font-bold text-gray-800">Verified Patient Dossiers</h2>
          </div>

          {/* Desktop Table - Removed Age Column */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 text-left">Patient Ref ID</th>
                  <th className="p-4 text-left">Full Name</th>
                  <th className="p-4 text-left">Gender</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Email Address</th>
                  <th className="p-4 text-left">Latest Appointment</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-purple-50/30 transition-colors group">
                      <td className="p-4 font-mono text-xs text-purple-600 font-semibold select-all">{patient.id}</td>
                      <td className="p-4 font-semibold text-gray-800">{patient.firstName} {patient.lastName}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          patient.gender.toLowerCase() === "male" ? "bg-blue-50 text-blue-700" : patient.gender.toLowerCase() === "female" ? "bg-pink-50 text-pink-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {patient.gender}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 font-mono text-xs">{patient.phone}</td>
                      <td className="p-4 text-gray-500 truncate max-w-[160px]">{patient.email}</td>
                      <td className="p-4 text-gray-700 font-semibold text-xs bg-gray-50/50">{patient.lastVisit}</td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleOpenPatientFile(patient)}
                          className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm group-hover:scale-[1.03]"
                        >
                          <Eye size={14} /> View File
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-gray-400 font-medium">
                      No matching verified dossiers assigned to your profile identifier.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile UI - Removed Age Element */}
          <div className="lg:hidden p-4 space-y-4">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div key={patient.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 text-base">{patient.firstName} {patient.lastName}</h3>
                      <p className="text-xs font-mono text-purple-500 mt-0.5">{patient.id}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      patient.gender.toLowerCase() === "male" ? "bg-blue-50 text-blue-700" : patient.gender.toLowerCase() === "female" ? "bg-pink-50 text-pink-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {patient.gender}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-600">
                    <p><strong>Last Appt:</strong> {patient.lastVisit}</p>
                    <p className="flex items-center gap-1 mt-1 truncate"><Phone size={12} className="text-gray-400" /> {patient.phone}</p>
                    <p className="flex items-center gap-1 truncate"><Mail size={12} className="text-gray-400" /> {patient.email}</p>
                  </div>

                  <button 
                    onClick={() => handleOpenPatientFile(patient)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl flex justify-center items-center gap-2 text-xs font-bold transition shadow-sm"
                  >
                    <Eye size={14} /> Open Complete File
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm font-medium">
                No matching verified dossiers assigned to your profile identifier.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Slide-out Patient File Backdrop Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Slide-out Patient File Details Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 border-l border-gray-100 p-6 overflow-y-auto transition-transform duration-300 ease-in-out ${
        isDrawerOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        {selectedPatientFile && (
          <div className="space-y-6">
            
            {/* Drawer Header Controls */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2.5 py-1 rounded-md">
                  System Role: {selectedPatientFile.role}
                </span>
                <h2 className="text-xl font-bold text-gray-800 mt-2">
                  {selectedPatientFile.firstName} {selectedPatientFile.lastName}
                </h2>
                <p className="text-xs font-mono text-gray-400 mt-0.5">UID: {selectedPatientFile.id}</p>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Core Patient Particulars Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Demographics & Identification</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <p className="text-xs text-gray-400 font-medium">National Identity (NIC)</p>
                  <p className="text-sm font-mono font-bold text-gray-800 mt-1 flex items-center gap-1.5">
                    <Fingerprint size={14} className="text-purple-500" /> {selectedPatientFile.nic}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <p className="text-xs text-gray-400 font-medium">Date of Birth</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1 flex items-center gap-1.5">
                    <CalendarDays size={14} className="text-purple-500" /> {selectedPatientFile.dob}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <p className="text-xs text-gray-400 font-medium">Biological Gender</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1 flex items-center gap-1.5">
                    <UserRound size={14} className="text-purple-500" /> {selectedPatientFile.gender}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <p className="text-xs text-gray-400 font-medium">Latest Check-in</p>
                  <p className="text-xs font-bold text-purple-700 mt-1">
                    {selectedPatientFile.lastVisit}
                  </p>
                </div>
              </div>
            </div>

            {/* Communication Parameters */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Parameters</h3>
              
              <div className="border border-gray-100 rounded-xl divide-y divide-gray-100">
                <div className="p-3.5 flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Phone size={16} /></div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Mobile Line</p>
                    <p className="text-sm font-mono font-semibold text-gray-800">{selectedPatientFile.phone}</p>
                  </div>
                </div>

                <div className="p-3.5 flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Mail size={16} /></div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Email Address</p>
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[260px]">{selectedPatientFile.email}</p>
                  </div>
                </div>

                <div className="p-3.5 flex items-start gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600 mt-0.5"><MapPin size={16} /></div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Residential Address</p>
                    <p className="text-sm font-medium text-gray-700 mt-0.5">{selectedPatientFile.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registry Meta */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Account Created:</span>
                <span className="font-medium text-gray-700">
                  {selectedPatientFile.createdAt.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Security Notice Guardrail */}
            <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-3.5 flex gap-2.5 text-xs text-amber-800">
              <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>Security Guardrail Note:</strong> Sensitive authentication credential fields (passwords) are handled directly by client auth nodes and are excluded from clinical visibility layers.
              </p>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}

export default PatientManagement;