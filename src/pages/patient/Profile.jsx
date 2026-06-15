import React, { useState, useEffect } from "react";
import {
  User, Mail, Phone, Calendar, MapPin, IdCard, Shield, 
  Loader2, AlertCircle, Lock
} from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setErrorMsg("No authenticated patient session found.");
      setLoading(false);
      return;
    }

    // Assuming patients are stored in a "patients" collection
    const patientDocRef = doc(db, "patients", currentUser.uid);
    
    const unsubscribe = onSnapshot(
      patientDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          setErrorMsg("Patient profile document not found.");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Snapshot listener error:", error);
        setErrorMsg("Failed to sync profile data.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col justify-center items-center p-10 text-center">
        <AlertCircle className="text-red-500 mb-2" size={40} />
        <p className="text-gray-600">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl p-6 border shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500">Manage your medical records and info</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-xl">
          <Lock size={14} /> Verified Account
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AVATAR BOX */}
        <div className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
            {profile.firstName?.[0]}{profile.lastName?.[0]}
          </div>
          <h2 className="mt-4 text-xl font-semibold">{profile.firstName} {profile.lastName}</h2>
          <span className="mt-3 px-4 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
            Patient Account
          </span>
        </div>

        {/* DETAILS GRID */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoField icon={<User size={18}/>} label="First Name" value={profile.firstName} />
            <InfoField icon={<User size={18}/>} label="Last Name" value={profile.lastName} />
            <InfoField icon={<Mail size={18}/>} label="Email" value={profile.email} />
            <InfoField icon={<Phone size={18}/>} label="Phone" value={profile.mobile} />
            <InfoField icon={<Calendar size={18}/>} label="Date of Birth" value={profile.dob} />
            <InfoField icon={<MapPin size={18}/>} label="Address" value={profile.address} />
            <InfoField icon={<IdCard size={18}/>} label="National ID" value={profile.nic} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for clean mapping
function InfoField({ icon, label, value }) {
  return (
    <div className="relative border border-gray-100 bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-2 text-gray-400 mb-1">
        {icon} <span className="text-xs uppercase font-bold">{label}</span>
      </div>
      <p className="font-semibold text-gray-800">{value || "—"}</p>
    </div>
  );
}

export default Profile;