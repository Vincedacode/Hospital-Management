import { useEffect, useRef, useState } from "react";

// ── Recharts ──────────────────────────────────────────────────────────────────
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from "recharts";

// ── Data ─────────────────────────────────────────────────────────────────────
const purchaseData = [
  { day: "Mon-14", value: 1800 },
  { day: "Tue-15", value: 2212 },
  { day: "Wed-16", value: 1600 },
  { day: "Thu-17", value: 2000 },
  { day: "Fri-18", value: 1400 },
  { day: "Sat-19", value: 1700 },
  { day: "Sun-20", value: 1500 },
];

const sellsData = [
  { name: "Chrome", value: 30, color: "#FFD700" },
  { name: "IE", value: 20, color: "#1E90FF" },
  { name: "FireFox", value: 20, color: "#FF6347" },
  { name: "Safari", value: 15, color: "#32CD32" },
  { name: "Opera", value: 15, color: "#FF4500" },
];

const stockData = [
  { name: "FireFox", value: 9000, color: "#00BFFF" },
  { name: "Chrome", value: 13212, color: "#FFD700" },
  { name: "Opera", value: 8000, color: "#FF4500" },
  { name: "Safari", value: 10000, color: "#1E90FF" },
  { name: "IE", value: 6000, color: "#7CFC00" },
];

// ── Custom tooltip for purchase chart ─────────────────────────────────────────
const PurchaseTooltip = ({ active, payload }) => {
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

// ── Custom tooltip for stock chart ────────────────────────────────────────────
const StockTooltip = ({ active, payload }) => {
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

// ── Custom bar shape with individual color ────────────────────────────────────
const ColoredBar = (props) => {
  const { x, y, width, height, fill } = props;
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={3} />;
};

// ── Legend dot ────────────────────────────────────────────────────────────────
const Dot = ({ color }) => (
  <span style={{
    display: "inline-block", width: 10, height: 10,
    borderRadius: "50%", background: color, marginRight: 4,
  }} />
);

// ── Main component ────────────────────────────────────────────────────────────
export default function PharmacyManagement() {
  const [purchasePeriod, setPurchasePeriod] = useState("7 days");
  const [sellsPeriod, setSellsPeriod] = useState("All");
  const [stockPeriod, setStockPeriod] = useState("7 days");

  const cardStyle = {
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
    padding: "16px 20px",
  };

  const sectionTitle = {
    fontSize: 13,
    fontWeight: 700,
    color: "#333",
    marginBottom: 4,
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
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );

  return (
    <div style={{
      fontFamily: "'Segoe UI', sans-serif",
      background: "#f4f5fb",
      minHeight: "100vh",
      padding: "24px",
    }}>
      {/* ── Page title ── */}
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#222", marginBottom: 20 }}>
        Pharmacy Management
      </h2>

      {/* ── Stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
        {[
          { label: "Total Customer", value: 25 },
          { label: "Total Medicine", value: 25 },
          { label: "Total Manufactures", value: 25 },
        ].map(({ label, value }) => (
          <div key={label} style={{ ...cardStyle, textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#222", marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#222" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Action buttons ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
        {["Create Invoice", "Supplier", "Medicine"].map(label => (
          <button
            key={label}
            style={{
              background: "linear-gradient(135deg, #a78fe8 0%, #7c5cbf 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "14px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: 0.2,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Purchase Reports */}
        <div style={{ ...cardStyle }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
            <span style={sectionTitle}>Purches Reports</span>
            {periodSelect(purchasePeriod, setPurchasePeriod)}
          </div>
          <div style={{ fontSize: 11, color: "#aaa", marginBottom: 12 }}>14.10.2021 - 20.10.2021</div>

          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={purchaseData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
                domain={[0, 3000]} ticks={[0, 500, 1000, 1500, 2000, 2500, 3000]}
              />
              <Tooltip content={<PurchaseTooltip />} />
              <Area
                type="monotone" dataKey="value"
                stroke="#5B8DEF" strokeWidth={2.5} strokeDasharray="6 3"
                fill="url(#purchaseGrad)"
                dot={{ r: 4, fill: "#5B8DEF", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Summary row */}
          <div style={{ display: "flex", gap: 24, marginTop: 12, borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
            {[
              { label: "All time", value: "41 234" },
              { label: "30 days", value: "41 234" },
              { label: "7 days", value: "41 234" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#222" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sells Reports */}
        <div style={{ ...cardStyle }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={sectionTitle}>Sells Reports</span>
            {periodSelect(sellsPeriod, setSellsPeriod, ["All", "7 days", "30 days"])}
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={sellsData}
                cx="45%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                label={false}
              >
                {sellsData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label overlay — absolute positioned via wrapper */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute",
              top: -100, left: "38%",
              transform: "translateX(-50%)",
              textAlign: "center",
              pointerEvents: "none",
            }}>
              <div style={{
                background: "#222", color: "#fff",
                fontSize: 11, fontWeight: 700,
                padding: "3px 8px", borderRadius: 5,
              }}>13 212</div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8, paddingLeft: 8 }}>
            {sellsData.map(({ name, color }) => (
              <div key={name} style={{ fontSize: 12, color: "#555", display: "flex", alignItems: "center" }}>
                <Dot color={color} /> {name}
              </div>
            ))}
          </div>
        </div>

        {/* Stock Reports — full width bottom */}
        <div style={{ ...cardStyle, gridColumn: "2 / 3" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={sectionTitle}>Stock Reports</span>
            {periodSelect(stockPeriod, setStockPeriod)}
          </div>

          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={stockData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barSize={32}>
              <CartesianGrid strokeDasharray="4 4" stroke="#eee" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false} hide />
              <YAxis tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? `${v / 1000}K` : v}
              />
              <Tooltip content={<StockTooltip />} />
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {stockData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
            {stockData.map(({ name, color }) => (
              <div key={name} style={{ fontSize: 11, color: "#555", display: "flex", alignItems: "center" }}>
                <Dot color={color} /> {name}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Out of Stock Table ── */}
      <div style={{
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
        padding: "20px 24px",
        marginTop: 16,
      }}>
        <div style={{ marginBottom: 4 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#222" }}>Out of Stock</div>
          <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
          <thead>
            <tr style={{ background: "#f4f5fb" }}>
              {["ID", "Drug Name", "Expire Date", "Manufacture Date", "Price", "QTY", "Status"].map(h => (
                <th key={h} style={{
                  padding: "10px 14px",
                  textAlign: h === "ID" ? "center" : "left",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#333",
                  borderBottom: "1px solid #eee",
                  whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { id: 1, drug: "Vitamin C", expire: "2025-04-13", manufacture: "2021-12-13", price: "1500.00", qty: 150, status: "Available" },
              { id: 2, drug: "Paracetamol", expire: "2025-05-13", manufacture: "2022-04-04", price: "4500.00", qty: 225, status: "Out Of Stack" },
              { id: 3, drug: "Actos", expire: "2026-01-16", manufacture: "2020-06-08", price: "5000.00", qty: 65, status: "Available" },
              { id: 4, drug: "Amoxicillin", expire: "2024-12-13", manufacture: "2021-01-13", price: "1200.00", qty: 275, status: "Out Of Stack" },
            ].map((row, i) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #f0f0f0", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "12px 14px", textAlign: "center", fontSize: 13, color: "#333" }}>{row.id}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "#222" }}>{row.drug}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "#333" }}>{row.expire}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "#333" }}>{row.manufacture}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "#333" }}>{row.price}</td>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "#333" }}>{row.qty}</td>
                <td style={{
                  padding: "12px 14px", fontSize: 13, fontWeight: 700,
                  color: row.status === "Available" ? "#22a06b" : "#e53e3e"
                }}>
                  {row.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}