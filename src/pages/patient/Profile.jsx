import React, { useState, useEffect } from "react";
import {
  User, Mail, Phone, Calendar, MapPin, IdCard, Shield, 
  Loader2, AlertCircle, Lock, Sparkles, HeartPulse
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-16 h-16 bg-indigo-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
          <Loader2 className="relative animate-spin text-indigo-600 z-10" size={44} />
        </div>
        <p className="text-slate-500 text-sm font-medium tracking-wide animate-pulse">Synchronizing secure records...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col justify-center items-center py-16 px-4 text-center max-w-md mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl mt-12">
        <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 mb-4 animate-bounce">
          <AlertCircle size={36} />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Profile Sync Problem</h3>
        <p className="text-slate-500 text-sm mt-2 font-medium">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50/40 min-h-screen">
      
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 p-6 md:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute -right-6 -bottom-12 opacity-10 pointer-events-none">
          <User size={240} />
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-3 text-xs font-semibold tracking-wider uppercase text-indigo-200">
              <Shield size={12} className="text-indigo-400" />
              <span>Identity Verification</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">My Profile</h1>
            <p className="mt-1 text-sm text-indigo-200/70 font-light max-w-md">
              Review personal authentication credentials, identity data, and primary hospital registries.
            </p>
          </div>
          
          <div className="self-start sm:self-center flex items-center gap-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-md text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-2xl border border-emerald-500/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <Lock size={13} className="inline" /> Verified Account
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* AVATAR HERO CARD */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 text-center relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
          {/* Decorative subtle backdrop mesh */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/5"></div>
          
          <div className="relative pt-4">
            {/* Avatar container with deep neon borders */}
            <div className="w-28 h-28 mx-auto rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-tr from-indigo-600 to-purple-600 font-black text-4xl border-4 border-white select-none">
                {profile.firstName?.[0]}{profile.lastName?.[0]}
              </div>
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-800 tracking-tight">
              {profile.firstName} {profile.lastName}
            </h2>
            
            <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100">
              <HeartPulse size={12} className="text-indigo-500" />
              Patient Account
            </div>

            {/* Quick meta statistics card itemizations inside profile */}
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-left">
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">File Status</span>
                <p className="text-xs font-bold text-slate-700 mt-0.5">Active / Synced</p>
              </div>
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Access Node</span>
                <p className="text-xs font-bold text-slate-700 mt-0.5">Secure Vault</p>
              </div>
            </div>
          </div>
        </div>

        {/* COMPREHENSIVE DETAILS ACCORDION GRID */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Personal Information</h3>
              <p className="text-xs text-slate-400 mt-0.5">Official demographics recorded on corporate systems</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoField icon={<User size={16} />} label="First Name" value={profile.firstName} />
            <InfoField icon={<User size={16} />} label="Last Name" value={profile.lastName} />
            <InfoField icon={<Mail size={16} />} label="Email Address" value={profile.email} />
            <InfoField icon={<Phone size={16} />} label="Phone Connection" value={profile.mobile} />
            <InfoField icon={<Calendar size={16} />} label="Date of Birth" value={profile.dob} />
            <InfoField icon={<MapPin size={16} />} label="Residential Address" value={profile.address} />
            <InfoField icon={<IdCard size={16} />} label="National ID / NIC" value={profile.nic} className="md:col-span-2" />
          </div>
        </div>

      </div>
    </div>
  );
}

// Upgraded field interface wrapper configuration
function InfoField({ icon, label, value, className = "" }) {
  return (
    <div className={`group relative border border-slate-100 bg-slate-50/40 rounded-2xl p-4 hover:bg-white hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-300 ${className}`}>
      <div className="flex items-center gap-2 text-slate-400 group-hover:text-indigo-500 transition-colors mb-1.5">
        <div className="p-1.5 bg-white border border-slate-100 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 rounded-lg shadow-sm transition-all duration-300">
          {icon}
        </div> 
        <span className="text-[10px] uppercase font-black tracking-wider text-slate-400/90 group-hover:text-indigo-600/80 transition-colors">
          {label}
        </span>
      </div>
      <p className="font-bold text-slate-800 pl-0.5 text-base group-hover:text-slate-900 transition-colors">
        {value || <span className="text-slate-300 font-normal italic">Not Provided</span>}
      </p>
    </div>
  );
}

export default Profile;