import { useState, useEffect } from "react";

// ── Firestore CRUD Integrations ──────────────────────────────────────────────
import { getAppointments } from "../../services/appointmentService"; 
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
        background: "#222", color: "#fff", padding: "6px 10px",
        borderRadius: 6, fontSize: 12, fontWeight: 700, boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
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

  // Operational Database Hook States
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ customersCount: 0, medicinesCount: 0, suppliersCount: 0 });
  const [medicinesList, setMedicinesList] = useState([]);
  const [financialTelemetry, setFinancialTelemetry] = useState([]);
  const [distributionTelemetry, setDistributionTelemetry] = useState([]);
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

        // Extract and aggregate unique supplier names securely from the active medicines inventory array
        const uniqueSuppliers = new Set(
          medicines
            .map(med => med.supplier?.trim())
            .filter(supplierName => supplierName && supplierName.toLowerCase() !== "n/a" && supplierName !== "—")
        );

        // 1. Process Aggregated Total Metrics Cards
        setMetrics({
          customersCount: patients.length || new Set(invoices.map(i => i.patientName)).size,
          medicinesCount: medicines.length,
          suppliersCount: uniqueSuppliers.size || 0
        });

        // 2. Hydrate Medicine Inventory List
        setMedicinesList(medicines);

        // 3. Map Financial Investment Valuation Data (Area Chart)
        const compiledFinancials = aggregateFinancialData(medicines);
        setFinancialTelemetry(compiledFinancials);

        // 4. Map Stock Status Breakdown Proportions (Pie Chart)
        const compiledDistribution = aggregateStockStatusDistribution(medicines);
        setDistributionTelemetry(compiledDistribution);

        // 5. Map Dynamic Active Stock Quantities (Bar Chart Matrix)
        const compiledStock = medicines.map(med => {
          const quantity = Number(med.qty || 0);
          return {
            name: med.name || "Unknown Drug",
            value: quantity,
            // Low stock thresholds turn orange/red automatically
            color: quantity === 0 ? "#EF4444" : quantity < 15 ? "#F59E0B" : "#6366F1"
          };
        }).slice(0, 8); // Slice viewport scale boundaries for optimized readability
        
        setStockTelemetry(compiledStock.length ? compiledStock : defaultStockFallback);

      } catch (err) {
        console.error("Error loading system metrics from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // ── Helper Data Aggregators Driven Exclusively By Medicine Database ───────
  
  // Chart A: Calculates capital locked up based on (Unit Price * Quantity) per medicine
  const aggregateFinancialData = (medicines) => {
    if (!medicines.length) return [
      { name: "Amoxicillin", value: 45000 }, { name: "Paracetamol", value: 12000 }, 
      { name: "Metformin", value: 68000 }, { name: "Lipitor", value: 110000 }, 
      { name: "Omeprazole", value: 35000 }, { name: "Azithromycin", value: 92000 }
    ];

    return medicines.map(med => {
      const price = Number(med.price || 0);
      const qty = Number(med.qty || 0);
      return {
        name: med.name || "Unknown",
        value: price * qty
      };
    }).slice(0, 7);
  };

  // Chart B: Calculates quantitative metrics of stock segments matching statuses
  const aggregateStockStatusDistribution = (medicines) => {
    if (!medicines.length) return [
      { name: "Optimal Stocks", value: 14, color: "#10B981" },
      { name: "Low Inventory Warnings", value: 5, color: "#F59E0B" },
      { name: "Depleted / Out of Stocks", value: 2, color: "#EF4444" }
    ];

    let optimal = 0;
    let low = 0;
    let depleted = 0;
    const today = new Date();

    medicines.forEach(med => {
      const qty = Number(med.qty || 0);
      const isExpired = med.expire ? new Date(med.expire) < today : false;

      if (qty === 0 || isExpired) {
        depleted++;
      } else if (qty < 15) {
        low++;
      } else {
        optimal++;
      }
    });

    return [
      { name: "Optimal Stock (>15 units)", value: optimal, color: "#10B981" },
      { name: "Low Inventory Warning", value: low, color: "#F59E0B" },
      { name: "Depleted / Expired Stock", value: depleted, color: "#EF4444" }
    ];
  };

  const defaultStockFallback = [
    { name: "Vitamin C Co.", value: 150, color: "#6366F1" },
    { name: "Paracetamol BP", value: 0, color: "#EF4444" },
    { name: "Actos Metformin", value: 65, color: "#6366F1" },
    { name: "Amoxicillin Cap", value: 12, color: "#F59E0B" }
  ];

  // ── Layout Routing Actions Switcher ─────────────────────────────────────────
  const navigateToActionPage = (actionLabel) => {
    switch (actionLabel) {
      case "Create Invoice":
        setActivePage("InvoiceManagement");
        break;
      case "Medicine Catalog":
        setActivePage("MedicineManagement");
        break;
      default:
        setActivePage("Dashboard");
    }
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    minWidth: 0, 
    border: "1px solid #f1f5f9"
  };

  const sectionTitle = {
    fontSize: "15px",
    fontWeight: 700,
    color: "#0f172a",
  };

  const descriptionStyle = {
    fontSize: "12px",
    color: "#64748b",
    lineHeight: "1.5",
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "1px dashed #e2e8f0"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-4 animate-pulse">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin"></div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Syncing Ledger Data Engine...</h3>
            <p className="text-sm text-slate-400 mt-1">Fetching operational real-time collection schemas securely from cloud files.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Dynamic Render Router Return Layout ────────────────────────────────────
  if (activePage === "InvoiceManagement") {
    return (
      <div className="min-h-screen bg-gray-100 p-4 font-sans animate-fadeIn">
        <button onClick={() => setActivePage("Dashboard")} className="mb-4 bg-white border-2 border-gray-300 hover:border-purple-600 text-gray-700 font-semibold px-4 py-2 rounded-xl text-sm transition-all shadow-sm hover:scale-[1.02] transform duration-200">
          ← Back to Dashboard Overview
        </button>
        <InvoiceManagement /> 
      </div>
    );
  }

  if (activePage === "MedicineManagement") {
    return (
      <div className="min-h-screen bg-gray-100 p-4 font-sans animate-fadeIn">
        <button onClick={() => setActivePage("Dashboard")} className="mb-4 bg-white border-2 border-gray-300 hover:border-purple-600 text-gray-700 font-semibold px-4 py-2 rounded-xl text-sm transition-all shadow-sm hover:scale-[1.02] transform duration-200">
          ← Back to Dashboard Overview
        </button>
        <MedicineManagement /> 
      </div>
    );
  }

  return (
    <div className="animate-fadeIn" style={{
      fontFamily: "Inter, system-ui, sans-serif",
      background: "#f8fafc",
      minHeight: "100vh",
      padding: "clamp(16px, 4vw, 32px)",
      boxSizing: "border-box"
    }}>
      {/* ── Page Title Header ── */}
      <div className="transition-all duration-500 transform translate-y-0 opacity-100" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", tracking: "-0.025em" }}>
          Clinical Pharmacy Dashboard Overview
        </h2>
        <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
          Real-time auditing system tracking database counts, transactional logs, and pharmaceutical status layers.
        </p>
      </div>

      {/* ── Stat Aggregate Display Bar ── */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: 20, 
        marginBottom: 20 
      }}>
        {[
          { label: "Total Customers", value: metrics.customersCount, border: "4px solid #3b82f6", animDelay: "delay-75" },
          { label: "Total Medicines", value: metrics.medicinesCount, border: "4px solid #10b981", animDelay: "delay-100" },
          { label: "Total Manufacturers", value: metrics.suppliersCount, border: "4px solid #6366f1", animDelay: "delay-150" },
        ].map(({ label, value, border, animDelay }) => (
          <div key={label} className={`transform transition-all duration-500 hover:scale-[1.02] hover:shadow-md ${animDelay} animate-slideUp`} style={{ ...cardStyle, borderLeft: border, padding: "20px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Call To Action Navigation Routing Block ── */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: 16, 
        marginBottom: 28 
      }}>
        {[
          { label: "Create Invoice", sub: "Billing & Transactions", delay: "delay-100" },
          { label: "Medicine Catalog", sub: "Inventory Operations", delay: "delay-200" }
        ].map(btn => (
          <button
            key={btn.label}
            onClick={() => navigateToActionPage(btn.label)}
            className={`transition-all duration-300 transform hover:scale-[1.01] active:scale-95 hover:shadow-lg ${btn.delay} animate-slideUp`}
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              padding: "16px 20px",
              textAlign: "left",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em" }}>{btn.label}</div>
            <div style={{ fontSize: "11px", color: "#c7d2fe", marginTop: "2px" }}>Launch Module Panel →</div>
          </button>
        ))}
      </div>

      {/* ── Telemetry Charts Layout Grid ── */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", 
        gap: 24, 
        marginBottom: 24 
      }}>

        {/* Chart A: Capital Valuation Area Graph */}
        <div className="hover:shadow-md transition-shadow duration-300 animate-slideUp delay-200" style={cardStyle}>
          <span style={sectionTitle}>Asset Holding Valuation (₦)</span>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: 16 }}>Financial Weight per Medicine Component</div>

          <div style={{ width: "100%", height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialTelemetry} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="financialGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1000 ? `${v / 1000}K` : v}
                />
                <Tooltip content={<DashboardTooltip />} />
                <Area
                  type="monotone" dataKey="value"
                  stroke="#10B981" strokeWidth={2.5}
                  fill="url(#financialGrad)"
                  dot={{ r: 4, fill: "#10B981", stroke: "#fff", strokeWidth: 2 }}
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p style={descriptionStyle}>
            <strong>Graph Explanation:</strong> This financial area graph charts the <strong>Total Asset Value locked in stock</strong> per medicine profile. It takes the calculated formula parameter <span style={{ fontFamily: "monospace", color: "#10B981" }}>(Unit Price × Available Stock Quantity)</span> to help clinical directors auditing the warehouse visually target where capital reserves are heavily focused.
          </p>
        </div>

        {/* Chart B: Stock Status Distribution Donut */}
        <div className="hover:shadow-md transition-shadow duration-300 animate-slideUp delay-300" style={cardStyle}>
          <span style={sectionTitle}>Inventory Health Segmentation</span>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: 16 }}>Batch Balance Status Aggregation</div>

          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-around", 
            flexWrap: "wrap", 
            gap: 16,
            minHeight: 180 
          }}>
            <div style={{ width: 150, height: 150, position: "relative", flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionTelemetry}
                    cx="50%" cy="50%"
                    innerRadius={46} outerRadius={68}
                    dataKey="value"
                    isAnimationActive={true}
                    animationDuration={1200}
                  >
                    {distributionTelemetry.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<DashboardTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, flexGrow: 1, minWidth: "140px" }}>
              {distributionTelemetry.map(({ name, color, value }) => (
                <div key={name} style={{ fontSize: "11px", color: "#334155", display: "flex", alignItems: "center", stroke: "none", justifyStyle: "space-between", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Dot color={color} /> <span>{name}</span>
                  </div>
                  <span style={{ fontWeight: 700, marginLeft: 8, color: "#0f172a" }}>{value} items</span>
                </div>
              ))}
            </div>
          </div>
          <p style={descriptionStyle}>
            <strong>Graph Explanation:</strong> This structural donut chart maps the <strong>proportion of stock health categories</strong> across the active formulary catalog. It isolates what items are running optimally, tracking items flagging critical warning triggers (<span style={{ color: "#F59E0B", fontWeight: 600 }}>&lt;15 units</span>), or items entirely depleted or structurally out-of-date.
          </p>
        </div>

        {/* Chart C: Full-Width Stock Volume Bar Chart */}
        <div className="hover:shadow-md transition-shadow duration-300 animate-slideUp delay-500" style={{ ...cardStyle, gridColumn: "1 / -1" }}>
          <span style={sectionTitle}>Dynamic Stock Volume Level Ledger Tracking</span>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: 16 }}>Quantitative Unit Levels Sourced Across Real-Time Batches</div>

          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockTelemetry} margin={{ top: 10, right: 5, left: -20, bottom: 5 }} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#475569", fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#aaabbb" }} axisLine={false} tickLine={false} />
                <Tooltip content={<DashboardTooltip />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={true} animationDuration={1500} animationEasing="ease-out">
                  {stockTelemetry.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={descriptionStyle}>
            <strong>Graph Explanation:</strong> This transactional bar chart handles the <strong>direct volumetric quantity readout</strong> of active drugs loaded in your service file directory. Each column scale corresponds cleanly to total item counts. Colors dynamically shift to orange or flashing red vectors automatically whenever stock levels descend past compliance benchmarks.
          </p>
        </div>

      </div>

      {/* ── Dynamic Storage & Stock Verification Log Data Table ── */}
      <div className="hover:shadow-md transition-shadow duration-300 animate-slideUp delay-700" style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        padding: "24px",
        border: "1px solid #f1f5f9"
      }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>Live Storage Safety Ledger</div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Real-time functional monitoring sync automatically tracking batch safety intervals and inventory status constraints.</div>
        </div>

        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Index ID", "Drug Name", "Price Group", "QTY Available", "Status Alert"].map(h => (
                  <th key={h} style={{
                    padding: "14px",
                    textAlign: h === "Index ID" ? "center" : "left",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#475569",
                    borderBottom: "1px solid #e2e8f0",
                    whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {medicinesList.length === 0 ? (
                <tr className="transition-all duration-300">
                  <td colSpan="5" style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                    No operational pharmacy storage records discovered inside current dataset index fields.
                  </td>
                </tr>
              ) : (
                medicinesList.map((row, i) => {
                  const stockQty = Number(row.qty || 0);
                  const isExpired = row.expire ? new Date(row.expire) < new Date() : false;
                  const itemAvailable = stockQty > 0 && !isExpired;

                  let statusLabel = "Available";
                  let badgeBg = "#d1fae5";
                  let badgeColor = "#065f46";

                  if (isExpired) {
                    statusLabel = "Expired Batch";
                    badgeBg = "#ffedd5";
                    badgeColor = "#9a3412";
                  } else if (stockQty === 0) {
                    statusLabel = "Depleted Stock";
                    badgeBg = "#fee2e2";
                    badgeColor = "#991b1b";
                  } else if (stockQty < 15) {
                    statusLabel = "Low Volume Alert";
                    badgeBg = "#fef3c7";
                    badgeColor = "#92400e";
                  }

                  return (
                    <tr key={row.id || i} className="hover:bg-slate-50/80 transition-colors duration-200" style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                      <td style={{ padding: "14px", textAlign: "center", fontSize: "12px", color: "#6366f1", fontFamily: "monospace", fontWeight: 700 }}>
                        {row.id ? row.id.substring(0, 6).toUpperCase() : i + 1}
                      </td>
                      <td style={{ padding: "14px", fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
                        {row.name || "Unnamed Drug Component"}
                      </td>
                      <td style={{ padding: "14px", fontSize: "13px", color: "#334155", fontWeight: 500 }}>
                        {row.price ? `₦${Number(row.price).toLocaleString()}` : "—"}
                      </td>
                      <td style={{ padding: "14px", fontSize: "13px", color: !itemAvailable ? "#ef4444" : "#0f172a", fontWeight: 700 }}>
                        {stockQty} units
                      </td>
                      <td style={{ padding: "14px" }}>
                        <span className="inline-block transform hover:scale-105 transition-transform duration-200" style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: "20px",
                          whiteSpace: "nowrap",
                          background: badgeBg,
                          color: badgeColor
                        }}>
                          {statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}