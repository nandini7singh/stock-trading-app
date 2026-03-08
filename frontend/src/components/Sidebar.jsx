import {
  LayoutDashboard,
  Briefcase,
  BarChart2,
  History,
  Settings,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const C = {
  surface: "#13131f",
  card: "#181826",
  border: "#252538",
  accent: "#7c5cfc",
  accentHi: "#9b7ffe",
  text: "#e8e8f0",
  muted: "#6b6b8a",
  label: "#9494b8",
  green: "#00e676",
};

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Briefcase, label: "Portfolio" },
  { icon: BarChart2, label: "Market Watch" },
  { icon: History, label: "History" },
];

export default function Sidebar({ activeNav, onNavChange }) {
  const navigate = useNavigate();
  return (
    <aside
      style={{
        width: 210,
        background: C.surface,
        borderRight: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "0 20px 28px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${C.accent}, ${C.green})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TrendingUp size={18} color="#fff" />
        </div>

        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>
            SB Stocks
          </div>
          <div style={{ color: C.muted, fontSize: 11 }}>
            Paper Trading
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 12px" }}>
        {NAV.map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => {
              onNavChange(label);
              if (label === "Dashboard") navigate("/home");
              if (label === "Portfolio") navigate("/portfolio");
              if (label === "Market Watch") navigate("/marketwatch");
              if (label === "History") navigate("/history");
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 12px",
              marginBottom: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
              borderRadius: 10,
              color: activeNav === label ? C.accentHi : C.label,
              fontWeight: activeNav === label ? 600 : 400,
            }}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}

        <div
          style={{
            padding: "20px 12px 8px",
            color: C.muted,
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          Preferences
        </div>

        <button
        onClick={() => navigate("/profile")}
        style={{
           width: "100%",
           display: "flex",
           alignItems: "center",
           gap: 10,
           padding: "11px 12px",
           background: "none",
           border: "none",
           cursor: "pointer",
           color: C.label,
           }}
        >
          <Settings size={17} />
          Settings
        </button>
      </nav>

      {/* Funds */}
      <div
        style={{
          padding: "16px 20px",
          margin: "0 12px 8px",
          background: C.card,
          borderRadius: 14,
          border: `1px solid ${C.border}`,
        }}
      >
        <div style={{ color: C.muted, fontSize: 11 }}>
          Available Funds
        </div>

        <div
          style={{
            fontWeight: 600,
            fontSize: 18,
            margin: "6px 0 12px",
          }}
        >
          $100,000.00
        </div>

        <button
          style={{
            width: "100%",
            padding: "9px 0",
            background: `${C.accent}22`,
            border: `1px solid ${C.accent}55`,
            borderRadius: 8,
            color: C.accentHi,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Deposit Virtual
        </button>
      </div>
    </aside>
  );
}