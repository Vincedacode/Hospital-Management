import { useState } from "react";


const INITIAL_FORM = {
  id: "", firstName: "", lastName: "",
  role: "", gender: "", email: "",
  mobile: "", address: "", nic: "",
  dob: "", password: "", confirmPassword: "",
};

function StaffForm({ onRegister }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  // One handler for all text inputs — updates just the changed field
  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleRegister = () => {
    if (!form.firstName || !form.lastName) {
      alert("First name and last name are required.");
      return;
    }
    onRegister(form);
    setForm(INITIAL_FORM); // clear form after registering
  };

  return (
    <div style={{ background: "white", borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 600, color: "#333" }}>
        Staff Management
      </h2>

      {/* ID search row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <button style={styles.btnPurple}>Generate Report</button>
        <div style={{ flex: 1 }} /> {/* spacer */}
        <input
          placeholder="ID"
          value={form.id}
          onChange={handleChange("id")}
          style={{ ...styles.input, width: 160 }}
        />
        <button style={styles.btnYellow}>Search</button>
      </div>

      {/* Row: First Name + Last Name */}
      <div style={styles.row}>
        <input placeholder="First Name" value={form.firstName} onChange={handleChange("firstName")} style={styles.input} />
        <input placeholder="Last Name"  value={form.lastName}  onChange={handleChange("lastName")}  style={styles.input} />
      </div>

      {/* Row: Role + Gender dropdowns */}
      <div style={styles.row}>
        <select value={form.role}   onChange={handleChange("role")}   style={styles.input}>
          <option value="">Role</option>
          <option value="Doctor">Doctor</option>
          <option value="Nurse">Nurse</option>
          <option value="Admin">Admin</option>
        </select>
        <select value={form.gender} onChange={handleChange("gender")} style={styles.input}>
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      {/* Row: Email + Mobile */}
      <div style={styles.row}>
        <input placeholder="Email"         value={form.email}  onChange={handleChange("email")}  style={styles.input} type="email" />
        <input placeholder="Mobile Number" value={form.mobile} onChange={handleChange("mobile")} style={styles.input} />
      </div>

      {/* Full-width Address textarea */}
      <textarea
        placeholder="Address"
        value={form.address}
        onChange={handleChange("address")}
        rows={3}
        style={{ ...styles.input, width: "100%", resize: "vertical", fontFamily: "inherit" }}
      />

      {/* Row: NIC + Date of Birth */}
      <div style={styles.row}>
        <input placeholder="NIC"          value={form.nic} onChange={handleChange("nic")} style={styles.input} />
        <input placeholder="Date of Birth" value={form.dob} onChange={handleChange("dob")} style={styles.input} type="date" />
      </div>

      {/* Row: Password + Confirm Password (with show/hide toggle) */}
      <div style={styles.row}>
        {/* Password field wrapper — position relative lets the eye icon sit inside */}
        <div style={{ flex: 1, position: "relative" }}>
          <input
            placeholder="Password"
            value={form.password}
            onChange={handleChange("password")}
            type={showPassword ? "text" : "password"}
            style={{ ...styles.input, width: "100%", paddingRight: 40 }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          <input
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            style={{ ...styles.input, width: "100%", paddingRight: 40 }}
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            style={styles.eyeIcon}
          >
            {showConfirm ? "🙈" : "👁"}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>
        <button onClick={handleRegister}                  style={styles.btnGreen}>Register</button>
        <button onClick={() => alert("Update clicked!")} style={styles.btnPurple}>Update</button>
        <button onClick={() => alert("Delete clicked!")} style={styles.btnRed}>Delete</button>
      </div>
    </div>
  );
}

const SAMPLE_DOCTORS = [
  { id: 1, name: "Madhusha", role: "Doctor", gender: "Male", email: "Madhusha@gmail.com", mobile: "078-66622616", nic: "86262626", dob: "1999-04-13" },
  { id: 2, name: "Madhusha", role: "Doctor", gender: "Male", email: "Madhusha@gmail.com", mobile: "078-66622616", nic: "16161616", dob: "1999-04-13" },
  { id: 3, name: "Madhusha", role: "Doctor", gender: "Male", email: "Madhusha@gmail.com", mobile: "078-66622616", nic: "11161616", dob: "1999-04-13" },
];

function StaffTable({ doctors }) {
  const TABLE_HEADERS = ["ID", "Name", "Role", "Gender", "Email", "Mobile Number", "NIC", "DOB", "Status", ""];

  return (
    <div style={{ background: "white", borderRadius: 12, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 14, color: "#333" }}>Recent Doctors ↓</p>
      <p style={{ margin: "0 0 16px", fontSize: 12, color: "#999" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

      {/* The table itself */}
      <div style={{ overflowX: "auto" }}>  {/* ← allows horizontal scroll on small screens */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              {TABLE_HEADERS.map((h) => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#666", fontWeight: 500 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                <td style={styles.td}>{doc.id}</td>
                <td style={styles.td}>{doc.name}</td>
                <td style={styles.td}>{doc.role}</td>
                <td style={styles.td}>{doc.gender}</td>
                <td style={styles.td}>{doc.email}</td>
                <td style={styles.td}>{doc.mobile}</td>
                <td style={styles.td}>{doc.nic}</td>
                <td style={styles.td}>{doc.dob}</td>
                <td style={styles.td}>
                  {/* Green "Online" badge */}
                  <span style={{ background: "#22c55e", color: "white", padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>
                    Online
                  </span>
                </td>
                <td style={styles.td}>
                  {/* Delete icon */}
                  <button onClick={() => alert(`Delete ${doc.id}`)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#ef4444" }}>
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("Staff");
  const [doctors, setDoctors] = useState(SAMPLE_DOCTORS);

  const handleRegister = (formData) => {
    const newDoctor = {
      id:     doctors.length + 1,
      name:   `${formData.firstName} ${formData.lastName}`,
      role:   formData.role   || "Doctor",
      gender: formData.gender || "—",
      email:  formData.email  || "—",
      mobile: formData.mobile || "—",
      nic:    formData.nic    || "—",
      dob:    formData.dob    || "—",
    };
    setDoctors((prev) => [newDoctor, ...prev]);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f0f5", fontFamily: "Segoe UI, sans-serif" }}>

      {/* LEFT: Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* RIGHT: Main area — scrolls independently */}
      <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>

        {/* Only show Staff page content when Staff is active */}
        {activePage === "Staff" ? (
          <>
            <StaffForm onRegister={handleRegister} />
            <StaffTable doctors={doctors} />
          </>
        ) : (
          <div style={{ textAlign: "center", marginTop: 80, color: "#999", fontSize: 18 }}>
            {activePage} page — coming soon
          </div>
        )}
      </div>
    </div>
  );
}


const styles = {
  row: {
    display: "flex",
    gap: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    color: "#333",
    background: "white",
    boxSizing: "border-box",
  },
  td: {
    padding: "10px 12px",
    color: "#444",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: 16,
    userSelect: "none",
  },
  btnGreen: {
    background: "#22c55e", color: "white",
    border: "none", borderRadius: 8, padding: "10px 28px",
    cursor: "pointer", fontWeight: 600, fontSize: 14,
  },
  btnPurple: {
    background: "#7c6fd4", color: "white",
    border: "none", borderRadius: 8, padding: "10px 28px",
    cursor: "pointer", fontWeight: 600, fontSize: 14,
  },
  btnYellow: {
    background: "#facc15", color: "#333",
    border: "none", borderRadius: 8, padding: "10px 24px",
    cursor: "pointer", fontWeight: 600, fontSize: 14,
  },
  btnRed: {
    background: "#ef4444", color: "white",
    border: "none", borderRadius: 8, padding: "10px 28px",
    cursor: "pointer", fontWeight: 600, fontSize: 14,
  },
};
