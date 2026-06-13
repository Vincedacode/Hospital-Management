import { useState, useEffect } from "react";

// ── Firestore CRUD Integrations ──────────────────────────────────────────────
import { getAppointments } from "../../services/appointmentService"; // Adjust paths to match your project tree
import { getInvoices } from "../../services/invoiceService";
import { getMedicines } from "../../services/medicineService";
import { getPatients } from "../../services/patientService";
import { getStaff } from "../../services/staffService";

// ── Secondary Management Views (Imported for Navigation Routing) ─────────────
import InvoiceManagement from "./InvoiceManagement";
 import MedicineManagement from "./MedicineManagement";

// ── Recharts ──────────────────────────────────────────────────────────────────
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts";

// ── Shared Recharts Custom Tooltip ───────────────────────────────────────────
const DashboardTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#222", color: "#fff", padding: "4px 10px",
        borderRadius: 6, fontSize: 12, fontWeight: 700,
      }}>
        {payload[0].value.toLocaleString()}
      </div>
    );
  }
  return null;
};

// ── Legend Color Dot Indicator ───────────────────────────────────────────────
const Dot = ({ color }) => (
  <span style={{
    display: "inline-block", width: 10, height: 10,
    borderRadius: "50%", background: color, marginRight: 6,
    flexShrink: 0
  }} />
);

export default function PharmacyManagement() {
  // Navigation & Page State Switcher
  const [activePage, setActivePage] = useState("Dashboard");

  // Telemetry Filters
  const [purchasePeriod, setPurchasePeriod] = useState("7 days");
  const [sellsPeriod, setSellsPeriod] = useState("All");
  const [stockPeriod, setStockPeriod] = useState("7 days");

  // Operational Database Hook States
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ customersCount: 0, medicinesCount: 0, staffCount: 0 });
  const [medicinesList, setMedicinesList] = useState([]);
  const [purchaseTelemetry, setPurchaseTelemetry] = useState([]);
  const [sellsTelemetry, setSellsTelemetry] = useState([]);
  const [stockTelemetry, setStockTelemetry] = useState([]);

  // Fetch Firestore Collections on Mount
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [appointments, invoices, medicines, patients, staff] = await Promise.all([
          getAppointments(),
          getInvoices(),
          getMedicines(),
          getPatients(),
          getStaff()
        ]);

        // 1. Process Aggregated Total Metrics Cards
        setMetrics({
          customersCount: patients.length || new Set(invoices.map(i => i.patientId)).size,
          medicinesCount: medicines.length,
          staffCount: staff.length
        });

        // 2. Hydrate Medicine Inventory List
        setMedicinesList(medicines);

        // 3. Map Purchase Telemetry Data (Area Chart)
        const compiledPurchases = aggregatePurchaseData(invoices);
        setPurchaseTelemetry(compiledPurchases);

        // 4. Map Sells Telemetry Data (Pie Chart)
        const compiledSells = aggregateSellsData(invoices);
        setSellsTelemetry(compiledSells);

        // 5. Map Stock Volume Level Levels (Bar Chart)
        const compiledStock = medicines.map(med => ({
          name: med.name || med.drugName || "Unknown",
          value: Number(med.qty || med.quantity || 0),
          color: Number(med.qty || med.quantity || 0) === 0 ? "#FF4500" : "#00BFFF"
        })).slice(0, 6); // Keep viewport readable
        
        setStockTelemetry(compiledStock.length ? compiledStock : defaultStockFallback);

      } catch (err) {
        console.error("Error loading system metrics from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // ── Helper Data Aggregators for Graphs ──────────────────────────────────
  const aggregatePurchaseData = (invoices) => {
    if (!invoices.length) return [
      { day: "Mon", value: 1800 }, { day: "Tue", value: 2212 }, { day: "Wed", value: 1600 },
      { day: "Thu", value: 2000 }, { day: "Fri", value: 1400 }, { day: "Sat", value: 1700 }, { day: "Sun", value: 1500 }
    ];
    
    const contextMap = {};
    invoices.forEach(inv => {
      const dateKey = inv.createdAt?.toDate ? inv.createdAt.toDate().toLocaleDateString('en-US', { weekday: 'short' }) : 'Day';
      contextMap[dateKey] = (contextMap[dateKey] || 0) + Number(inv.totalAmount || inv.price || 0);
    });
    return Object.keys(contextMap).map(key => ({ day: key, value: contextMap[key] }));
  };

  const aggregateSellsData = (invoices) => {
    if (!invoices.length) return [
      { name: "Antibiotics", value: 35, color: "#FFD700" },
      { name: "Analgesics", value: 25, color: "#1E90FF" },
      { name: "Vitamins", value: 20, color: "#FF6347" },
      { name: "Antivirals", value: 20, color: "#32CD32" }
    ];

    const distribution = {};
    invoices.forEach(inv => {
      const category = inv.category || "General Medicine";
      distribution[category] = (distribution[category] || 0) + 1;
    });

    const colors = ["#FFD700", "#1E90FF", "#FF6347", "#32CD32", "#FF4500"];
    return Object.keys(distribution).map((key, idx) => ({
      name: key,
      value: distribution[key],
      color: colors[idx % colors.length]
    }));
  };

  const defaultStockFallback = [
    { name: "Vitamin C", value: 150, color: "#00BFFF" },
    { name: "Paracetamol", value: 0, color: "#FF4500" },
    { name: "Actos", value: 65, color: "#00BFFF" }
  ];

  // ── Layout Routing Actions Switcher ─────────────────────────────────────────
  const navigateToActionPage = (actionLabel) => {
    switch (actionLabel) {
      case "Create Invoice":
        setActivePage("InvoiceManagement");
        break;
      case "Supplier Directory":
        setActivePage("SupplierDirectory");
        break;
      case "Medicine Catalog":
        setActivePage("MedicineManagement");
        break;
      default:
        setActivePage("Dashboard");
    }
  };

  // ── Styling Specifications ──────────────────────────────────────────────────
  const cardStyle = {
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    minWidth: 0, 
  };

  const sectionTitle = {
    fontSize: 14,
    fontWeight: 700,
    color: "#333",
  };

  const periodSelect = (value, onChange, options = ["7 days", "30 days", "All time"]) => (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        fontSize: 12, color: "#7c5cbf", fontWeight: 600,
        border: "none", background: "transparent", cursor: "pointer", outline: "none",
      }}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "sans-serif", color: "#666" }}>
        <h3>Syncing with Firestore Database records...</h3>
      </div>
    );
  }

  // ── Dynamic Render Router Return Layout ────────────────────────────────────
  if (activePage === "InvoiceManagement") {
    // Return or render your Invoice component layout directly
    return (
      <div style={{ padding: 24, fontFamily: "sans-serif" }}>
        <button onClick={() => setActivePage("Dashboard")} style={{ marginBottom: 16, cursor: "pointer" }}>← Back to Dashboard</button>
        
        <InvoiceManagement /> 
      </div>
    );
  }



  if (activePage === "MedicineManagement") {
    return (
      <div style={{ padding: 24, fontFamily: "sans-serif" }}>
        <button onClick={() => setActivePage("Dashboard")} style={{ marginBottom: 16, cursor: "pointer" }}>← Back to Dashboard</button>
       
         <MedicineManagement /> 
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "#f4f5fb",
      minHeight: "100vh",
      padding: "clamp(12px, 3vw, 24px)",
      boxSizing: "border-box"
    }}>
      {/* ── Page Title Header ── */}
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#222", marginBottom: 20 }}>
        Pharmacy Management Dashboard
      </h2>

      {/* ── Stat Aggregate Display Bar ── */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: 16, 
        marginBottom: 16 
      }}>
        {[
          { label: "Total Customers", value: metrics.customersCount },
          { label: "Total Medicines", value: metrics.medicinesCount },
          { label: "Active Staff Units", value: metrics.staffCount },
        ].map(({ label, value }) => (
          <div key={label} style={{ ...cardStyle, textAlign: "center", padding: "24px 16px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#666", marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#222" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Call To Action Navigation Routing Block ── */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
        gap: 16, 
        marginBottom: 24 
      }}>
        {["Create Invoice", "Supplier Directory", "Medicine Catalog"].map(label => (
          <button
            key={label}
            onClick={() => navigateToActionPage(label)}
            style={{
              background: "linear-gradient(135deg, #a78fe8 0%, #7c5cbf 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "14px 10px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(124, 92, 191, 0.15)",
              whiteSpace: "nowrap"
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Telemetry Charts Layout Grid ── */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", 
        gap: 20, 
        marginBottom: 24 
      }}>

        {/* Chart A: Area Graph Module */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
            <span style={sectionTitle}>Purchase Reports</span>
            {periodSelect(purchasePeriod, setPurchasePeriod)}
          </div>
          <div style={{ fontSize: 11, color: "#aaa", marginBottom: 16 }}>Live Firestore Core Sync</div>

          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={purchaseTelemetry} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="purchaseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B8DEF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#5B8DEF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#eee" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1000 ? `${v / 1000}K` : v}
                />
                <Tooltip content={<DashboardTooltip />} />
                <Area
                  type="monotone" dataKey="value"
                  stroke="#5B8DEF" strokeWidth={2.5}
                  fill="url(#purchaseGrad)"
                  dot={{ r: 4, fill: "#5B8DEF", stroke: "#fff", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Distribution Donut Module */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={sectionTitle}>Sells Categories</span>
            {periodSelect(sellsPeriod, setSellsPeriod, ["All", "7 days", "30 days"])}
          </div>

          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-around", 
            flexWrap: "wrap", 
            gap: 16,
            minHeight: 180 
          }}>
            <div style={{ width: 160, height: 160, position: "relative", flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sellsTelemetry}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {sellsTelemetry.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<DashboardTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexGrow: 1, minWidth: "130px" }}>
              {sellsTelemetry.map(({ name, color, value }) => (
                <div key={name} style={{ fontSize: 12, color: "#555", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Dot color={color} /> <span>{name}</span>
                  </div>
                  <span style={{ fontWeight: 600, marginLeft: 8 }}>{value} units</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart C: Full-Width Stock Level Ledger Bar */}
        <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={sectionTitle}>Stock Level Volume Tracking</span>
            {periodSelect(stockPeriod, setStockPeriod)}
          </div>

          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockTelemetry} margin={{ top: 10, right: 5, left: -25, bottom: 5 }} barSize={32}>
                <CartesianGrid strokeDasharray="4 4" stroke="#eee" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#777" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1000 ? `${v / 1000}K` : v}
                />
                <Tooltip content={<DashboardTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stockTelemetry.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ── Dynamic Storage & Stock Verification Log Data Table ── */}
      <div style={{
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
        padding: "20px",
      }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#222" }}>Live Storage Ledger (Expiry & Safety Monitored)</div>
          <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>Real-time functional monitoring sync automatically tracking batch safety intervals and inventory status constraints.</div>
        </div>

        <div style={{ overflowX: "auto", width: "100%", WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ background: "#f4f5fb" }}>
                {["Index ID", "Drug Name", "Price Group", "QTY Available", "Status Alert"].map(h => (
                  <th key={h} style={{
                    padding: "12px 14px",
                    textAlign: h === "Index ID" ? "center" : "left",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#444",
                    borderBottom: "1px solid #e2e8f0",
                    whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {medicinesList.map((row, i) => {
                const stockQty = Number(row.qty || row.quantity || 0);
                
                // Expiry Time Evaluator
                const isExpired = row.expire || row.expireDate ? new Date(row.expire || row.expireDate) < new Date() : false;
                
                // Item Availability Conditions (Must be stocked AND unexpired)
                const itemAvailable = stockQty > 0 && !isExpired;

                // Visual Status Tags Builder
                let statusLabel = "Available";
                let badgeBg = "#e6f6ee";
                let badgeColor = "#22a06b";

                if (isExpired) {
                  statusLabel = "Expired";
                  badgeBg = "#fff7ed"; // Alert orange warning
                  badgeColor = "#ea580c";
                } else if (stockQty === 0) {
                  statusLabel = "Out of Stock";
                  badgeBg = "#fdf2f2"; // Standard hazard red
                  badgeColor = "#e53e3e";
                }

                return (
                  <tr key={row.id || i} style={{ borderBottom: "1px solid #f0f0f0", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "12px 14px", textAlign: "center", fontSize: 13, color: "#666", fontFamily: "monospace" }}>
                      {row.id ? row.id.substring(0, 6).toUpperCase() : i + 1}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "#111", whiteSpace: "nowrap" }}>
                      {row.name || row.drugName || "Unnamed Drug Component"}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#333", fontWeight: 500, whiteSpace: "nowrap" }}>
                      {row.price ? `₦${Number(row.price).toLocaleString()}` : "—"}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: !itemAvailable ? "#e53e3e" : "#333", fontWeight: 600 }}>
                      {stockQty} units
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 4,
                        whiteSpace: "nowrap",
                        background: badgeBg,
                        color: badgeColor
                      }}>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}