import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Loader2,
  Lock,
  Activity,
  AlertCircle,
  Fingerprint
} from "lucide-react";

// Firebase imports
import { doc, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Live Workspace Analytics States
  const [metrics, setMetrics] = useState({
    patientsCount: 0,
    appointmentsCompleted: 0,
    serviceDuration: "0 Days"
  });

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setErrorMsg("No authenticated staff session discovered. Please log in again.");
      setLoading(false);
      return;
    }

    // Stream live data matching your document structural keys
    const staffDocRef = doc(db, "staff", currentUser.uid);
    const unsubscribeProfile = onSnapshot(
      staffDocRef,
      async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Safe case-normalization handling for database string values
          const rawGender = data.gender || "—";
          const formattedGender = rawGender !== "—" 
            ? rawGender.charAt(0).toUpperCase() + rawGender.slice(1).toLowerCase() 
            : "—";

          setProfile({
            uid: docSnap.id,
            firstName: data.firstName || "—",
            lastName: data.lastName || "—",
            email: data.email || "—",
            mobile: data.mobile || "—",
            nic: data.nic || "—",
            dob: data.dob || "—",
            role: data.role || "—",
            gender: formattedGender,
            createdAt: data.createdAt || null
          });

          // Compute active facility tenure data metrics pipelines
          await calculateLiveMetrics(currentUser.uid, data.createdAt);
        } else {
          setErrorMsg("Staff profile document missing from the registry database.");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Profile registry listening snapshot stream breakdown:", error);
        setErrorMsg("Failed to connect to backend profile registers.");
        setLoading(false);
      }
    );

    return () => unsubscribeProfile();
  }, []);

  const calculateLiveMetrics = async (uid, createdAt) => {
    try {
      const appointmentsRef = collection(db, "appointments");
      
      // Query 1: Total Completed appointments handled by this doctor instance
      const completedQuery = query(
        appointmentsRef,
        where("assignedDoctorId", "==", uid),
        where("status", "==", "Completed")
      );
      const completedSnap = await getDocs(completedQuery);
      const appointmentsCompleted = completedSnap.size;

      // Query 2: Unique core handled patients roster metrics
      const allDoctorApptsQuery = query(appointmentsRef, where("assignedDoctorId", "==", uid));
      const allApptsSnap = await getDocs(allDoctorApptsQuery);
      
      const uniquePatients = new Set();
      allApptsSnap.forEach((doc) => {
        const data = doc.data();
        if (data.patientId) uniquePatients.add(data.patientId);
      });

      // Metric 3: Humanized facility age tracking using Firebase Timestamp or native Date format
      let serviceDuration = "New Joiner";
      if (createdAt) {
        const joinDate = createdAt.seconds ? new Date(createdAt.seconds * 1000) : new Date(createdAt);
        if (!isNaN(joinDate)) {
          const diffTime = Math.abs(new Date() - joinDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > 365) {
            const years = (diffDays / 365).toFixed(1);
            serviceDuration = `${years} Year${years !== "1.0" ? "s" : ""}`;
          } else if (diffDays > 30) {
            const months = Math.floor(diffDays / 30);
            serviceDuration = `${months} Month${months !== 1 ? "s" : ""}`;
          } else {
            serviceDuration = `${diffDays} Day${diffDays !== 1 ? "s" : ""}`;
          }
        }
      }

      setMetrics({
        patientsCount: uniquePatients.size,
        appointmentsCompleted,
        serviceDuration
      });
    } catch (err) {
      console.error("Error evaluating live matrix profiling totals:", err);
    }
  };

  const formatTimestampDisplay = (createdAt) => {
    if (!createdAt) return "—";
    const dateObj = createdAt.seconds ? new Date(createdAt.seconds * 1000) : new Date(createdAt);
    return isNaN(dateObj) ? "—" : dateObj.toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-sm font-semibold text-gray-500 tracking-wide">Syncing Security Profile Credentials...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 text-center max-w-md space-y-4">
          <AlertCircle className="text-red-500 mx-auto" size={40} />
          <h3 className="text-lg font-bold text-gray-800">Authentication Error</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Block */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Profile Portal</h1>
            <p className="text-sm text-gray-500 mt-1">
              View and verify your core personnel registry files and active permissions.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold rounded-xl">
            <Lock size={14} /> Datastore Synced Verified
          </div>
        </div>

        {/* Layout Splitting Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile Identity Card Summary Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center">
            <div className="flex flex-col items-center text-center py-6">
              
              <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center relative shadow-inner">
                <User size={50} className="text-indigo-600" />
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full" />
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-800 tracking-tight">
                {profile.firstName} {profile.lastName}
              </h2>

              <p className="text-gray-500 font-medium text-sm mt-0.5">{profile.role}</p>

              <span className="mt-3 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold font-mono border border-indigo-100">
                {profile.uid.substring(0, 14)}...
              </span>
            </div>
          </div>

          {/* Primary Account Particulars Grid Registry */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Activity size={18} className="text-indigo-500" /> Staff Core Particulars Document
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoCard
                icon={<Mail size={18} />}
                label="Corporate Email Address"
                value={profile.email}
              />

              <InfoCard
                icon={<Phone size={18} />}
                label="Mobile Contact Line"
                value={profile.mobile}
              />

              <InfoCard
                icon={<Fingerprint size={18} />}
                label="National Identity Code (NIC)"
                value={profile.nic}
              />

              <InfoCard
                icon={<User size={18} />}
                label="Biological Gender"
                value={profile.gender}
              />

              <InfoCard
                icon={<Calendar size={18} />}
                label="Date of Birth (DOB)"
                value={profile.dob}
              />

              <InfoCard
                icon={<Calendar size={18} />}
                label="Account Profile Enrollment"
                value={formatTimestampDisplay(profile.createdAt)}
              />

              <InfoCard
                icon={<Shield size={18} />}
                label="System Core Privilege Role"
                value={profile.role}
              />
            </div>
          </div>
        </div>

        {/* Aggregated Realtime Work Metrics Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition hover:shadow-md">
            <h3 className="text-3xl font-black text-indigo-600 tracking-tight font-mono">
              {metrics.patientsCount}
            </h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1.5">
              Unique Patients Consulted
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition hover:shadow-md">
            <h3 className="text-3xl font-black text-green-600 tracking-tight font-mono">
              {metrics.appointmentsCompleted}
            </h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1.5">
              Appointments Concluded
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition hover:shadow-md">
            <h3 className="text-3xl font-black text-purple-600 tracking-tight font-mono">
              {metrics.serviceDuration}
            </h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1.5">
              Verified Service Duration
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="border border-gray-100 bg-gray-50/30 rounded-xl p-4 transition-colors hover:border-gray-200">
      <div className="flex items-center gap-2 text-indigo-600 mb-2">
        {icon}
      </div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-bold text-gray-800 mt-1 truncate">
        {value}
      </p>
    </div>
  );
}

export default Profile;