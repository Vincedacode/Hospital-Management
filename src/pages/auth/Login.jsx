import React, { useState } from "react";
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorMessage("Please enter both your email and password.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // 1. Authenticate user credentials via Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

 const user = userCredential.user;

// =======================
// CHECK ADMIN COLLECTION
// =======================
const adminRef = doc(db, "users", user.uid);
const adminSnap = await getDoc(adminRef);

if (adminSnap.exists()) {
  const adminData = adminSnap.data();
  const adminRole = adminData.role?.toLowerCase();

  if (adminRole === "admin") {
    setSuccessMessage(
      "Login successful! Redirecting to Admin Dashboard..."
    );

    setTimeout(() => {
      navigate("/admin/dashboard");
    }, 1200);

    return;
  }
}

// =======================
// CHECK STAFF COLLECTION
// =======================
const staffRef = doc(db, "staff", user.uid);
const staffSnap = await getDoc(staffRef);

if (staffSnap.exists()) {
  const staffData = staffSnap.data();
  const staffRole = staffData.role?.toLowerCase();

  if (staffRole === "doctor" || staffRole === "nurse") {
    localStorage.setItem("staff_tier", staffRole);

    setSuccessMessage(
      `Login successful! Redirecting to ${
        staffRole.charAt(0).toUpperCase() +
        staffRole.slice(1)
      } Workspace...`
    );

    setTimeout(() => {
      navigate("/staff/dashboard");
    }, 1200);

    return;
  }
}

// =======================
// CHECK PATIENT COLLECTION
// =======================
const patientRef = doc(db, "patients", user.uid);
const patientSnap = await getDoc(patientRef);

if (patientSnap.exists()) {
  const patientData = patientSnap.data();

  localStorage.setItem("patient_uid", user.uid);
  localStorage.setItem(
    "patient_name",
    `${patientData.firstName || ""} ${patientData.lastName || ""}`
  );

  setSuccessMessage(
    "Login successful! Redirecting to Patient Portal..."
  );

  setTimeout(() => {
    navigate("/patient/dashboard");
  }, 1200);

  return;
}

// =======================
// NO PROFILE FOUND
// =======================
setErrorMessage(
  "User account exists but no profile record was found."
);

      // 2. Evaluate clinical permissions and route to the correct layout workspace
      if (userRole === "admin") {
        setSuccessMessage("Login successful! Redirecting to Admin Terminal...");
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1200);

      } else if (userRole === "doctor" || userRole === "nurse") {
        // Persist the specific staff role type locally if components need to render elements contextually
        localStorage.setItem("staff_tier", userRole);
        
        // Clean capitalization for the success message layout
        const readableRole = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
        setSuccessMessage(`Login successful! Redirecting to ${readableRole} Workspace...`);
        
        setTimeout(() => {
          navigate("/staff/dashboard");
        }, 1200);

      } else {
        setErrorMessage("Access denied: Account is missing an authorized clinical role designation.");
      }

    } catch (error) {
      console.error("AUTH ERROR CODE:", error.code);
      console.error("AUTH ERROR MESSAGE:", error.message);
      
      // Translate common Firebase authentication error strings into polished alert elements
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setErrorMessage("Invalid email or password combination.");
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage("This account has been temporarily locked due to multiple failed login attempts.");
      } else {
        setErrorMessage(error.message || "A secure connection terminal runtime error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 md:p-6 font-sans antialiased text-gray-800">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 transition-all">

        {/* Brand/System Identity Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 mb-3">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to manage your medical ecosystem
          </p>
        </div>

        {/* Operational Error Notifications */}
        {errorMessage && (
          <div className="p-3.5 mb-5 text-xs font-medium text-red-700 bg-red-50 rounded-xl border border-red-100">
            {errorMessage}
          </div>
        )}

        {/* Operational Success Notifications */}
        {successMessage && (
          <div className="p-3.5 mb-5 text-xs font-medium text-green-700 bg-green-50 rounded-xl border border-green-100 animate-pulse">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email Input */}
          <div className="relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden bg-white">
            <span className="absolute left-4 top-3.5 text-gray-400">
              <Mail size={18} />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full pl-11 pr-4 py-3 bg-transparent text-gray-700 focus:outline-none text-sm disabled:bg-gray-50"
            />
          </div>

          {/* Password Input */}
          <div className="relative rounded-xl border-2 border-gray-300 focus-within:border-indigo-500 overflow-hidden bg-white">
            <span className="absolute left-4 top-3.5 text-gray-400">
              <Lock size={18} />
            </span>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full pl-11 pr-12 py-3 bg-transparent text-gray-700 focus:outline-none text-sm disabled:bg-gray-50"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Action Submission Trigger */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-xl flex items-center justify-center gap-2 text-sm transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.99]"
            }`}
          >
            {loading ? "Signing In..." : "Sign In Account"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">
        Secure Managed Portal • Authorized Clinical Operations Only
      </p>
    </div>
  );
};

export default Login;