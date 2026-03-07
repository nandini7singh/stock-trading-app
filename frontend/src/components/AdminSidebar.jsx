import { Link } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { icon: "group", label: "User Management", path: "/users" },
  { icon: "monitoring", label: "Stocks Management", path: "/stocks-management" },
  { icon: "analytics", label: "Platform Analytics", path: "/admin" },
  { icon: "analytics", label: "Stock Chart", path: "/chart" },
];

export default function AdminSidebar({ activeNav, setActiveNav }) {

  const [hovered, setHovered] = useState(null);

  return (
    <aside
      style={{
        width: 272,
        minWidth: 272,
        background: "rgba(38,10,66,0.18)",
        borderRight: "1px solid #3c2e4d",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "linear-gradient(135deg, #260a42, #0bda73)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 14,
              color: "#fff",
            }}
          >
            SB
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>SB Stocks</div>
            <div
              style={{
                fontSize: 10,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Admin Panel
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {(navItems || []).map(({ icon, label, path }) => {

            const isActive = activeNav === label;
            const isHover = hovered === label;

            return (
              <Link
                key={label}
                to={path}
                onClick={() => setActiveNav(label)}
                onMouseEnter={() => setHovered(label)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 16px",
                  borderRadius: 12,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive ? "#fff" : "#cbd5e1",
                  background:
                    isActive || isHover ? "#260a42" : "transparent",
                  transition: "all 0.2s ease",
                }}
              >
                <span className="material-symbols-outlined">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin Profile */}
      <div
        style={{
          background: "#251b2e",
          border: "1px solid #3c2e4d",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#475569",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#94a3b8",
            }}
          >
            AR
          </div>

          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Alex Rivera</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Senior Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}