import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../components/axiosInstance";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

// ─────────────────────────────────────────────
// SVG Line Chart for Platform Growth
// ─────────────────────────────────────────────
function PlatformGrowthChart() {
  const points = [
    [0, 180], [30, 140], [60, 160], [90, 110], [120, 130], [150, 90],
    [180, 120], [210, 60], [240, 100], [270, 50], [300, 30], [330, 70], [360, 20],
  ];
  const pathD = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const areaD = `${pathD} L 360 200 L 0 200 Z`;

  return (
    <svg viewBox="0 0 360 200" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0bda73" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0bda73" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#areaGrad)" />
      <path d={pathD} fill="none" stroke="#0bda73" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────
// Bar Chart for Trading Volume
// ─────────────────────────────────────────────
const bars = [
  { h: "40%", val: "12k", active: false },
  { h: "65%", val: "28k", active: false },
  { h: "35%", val: "11k", active: false },
  { h: "90%", val: "45k", active: true  },
  { h: "55%", val: "22k", active: false },
];

function TradingVolumeChart() {
  return (
    <div className="h-64 flex items-end justify-between gap-4 px-2">
      {bars.map((bar, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
          <div className="relative w-full group" style={{ height: bar.h }}>
            {bar.active && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded text-slate-100 whitespace-nowrap">
                {bar.val}
              </div>
            )}
            <div
              className={`w-full h-full rounded-t-lg transition-all ${
                bar.active ? "bg-[#0bda73]/80" : "bg-[#260a42]/60 hover:bg-[#0bda73]/40"
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Static Stats (replace values with API if available)
// ─────────────────────────────────────────────
const stats = [
  {
    label: "Total Active Users",
    value: "12,840",
    icon: "person_check",
    iconColor: "#0bda73",
    sub: { color: "#0bda73", icon: "trending_up", text: "+5.2%" },
  },
  {
    label: "Virtual Trades Today",
    value: "45,201",
    icon: "equalizer",
    iconColor: "#60a5fa",
    sub: { color: "#0bda73", icon: "trending_up", text: "+12.4%" },
  },
  {
    label: "System Status",
    value: "Operational",
    valueColor: "#0bda73",
    icon: "check_circle",
    iconColor: "#0bda73",
    sub: { color: "#94a3b8", text: "Uptime: 99.99%" },
  },
  {
    label: "Pending Support",
    value: "14",
    icon: "confirmation_number",
    iconColor: "#fb923c",
    sub: { color: "#fb923c", icon: "priority_high", text: "High Priority" },
  },
];

// ─────────────────────────────────────────────
// Avatar fallback — renders initials when no image
// ─────────────────────────────────────────────
function Avatar({ name, src }) {
  const [imgError, setImgError] = useState(false);
  const initials = name
    ? name.split(/[\s_]/).map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, objectFit: "cover" }}
      />
    );
  }
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
      background: "#3c2e4d", display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#c4b5fd",
    }}>
      {initials}
    </div>
  );
}

// ─────────────────────────────────────────────
// Admin Page
// ─────────────────────────────────────────────
export default function Admin() {
  const [activeNav,   setActiveNav]   = useState("Platform Analytics");
  const [users,       setUsers]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [page,        setPage]        = useState(1);
  const PAGE_SIZE = 8;

  // ── Fetch users ──────────────────────────────────────────────
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get("/users");
      // Normalize — your schema may use different field names
      const normalized = data.map(u => ({
        ...u,
        username: u.username ?? u.name    ?? u.email?.split("@")[0] ?? "Unknown",
        email:    u.email    ?? "—",
        status:   u.status   ?? (u.isActive ? "Active" : "Inactive"),
        activity: u.activity ?? u.lastAction ?? "No recent activity",
        avatar:   u.avatar   ?? u.profilePic ?? null,
      }));
      setUsers(normalized);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Could not load users from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ── Pagination ───────────────────────────────────────────────
  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const paginated  = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#191121", color: "#f1f5f9",
      fontFamily: "'Inter', sans-serif", overflow: "hidden",
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        rel="stylesheet"
      />

      <AdminSidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflowY: "auto" }}>
        <AdminNavbar title="Platform Overview" />

        <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {stats.map(({ label, value, valueColor, icon, iconColor, sub }) => (
              <div key={label} style={{
                background: "#251b2e", border: "1px solid #3c2e4d",
                borderRadius: 12, padding: 24,
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                    {label}
                  </p>
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: iconColor, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                    {icon}
                  </span>
                </div>
                <p style={{ fontSize: 30, fontWeight: 700, color: valueColor || "#f1f5f9", lineHeight: 1 }}>{value}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: sub.color }}>
                  {sub.icon && (
                    <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                      {sub.icon}
                    </span>
                  )}
                  <span>{sub.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: "#251b2e", border: "1px solid #3c2e4d", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 16 }}>Platform Growth</h3>
                  <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>User registrations over the last 30 days</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#0bda73" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#cbd5e1" }}>+15% vs LY</span>
                </div>
              </div>
              <div style={{ height: 200, width: "100%" }}>
                <PlatformGrowthChart />
              </div>
            </div>

            <div style={{ background: "#251b2e", border: "1px solid #3c2e4d", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 16 }}>Trading Volume</h3>
                  <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>Trade counts per week</p>
                </div>
                <select style={{
                  background: "rgba(38,10,66,0.5)", border: "1px solid #3c2e4d",
                  borderRadius: 8, fontSize: 11, fontWeight: 700,
                  color: "#e2e8f0", padding: "4px 10px", cursor: "pointer",
                }}>
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </div>
              <TradingVolumeChart />
            </div>
          </div>

          {/* User Management Table */}
          <div style={{ background: "#251b2e", border: "1px solid #3c2e4d", borderRadius: 12, overflow: "hidden" }}>

            {/* Table Header */}
            <div style={{
              padding: "20px 24px", borderBottom: "1px solid #3c2e4d",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 16 }}>User Management</h3>
                <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>Review and manage account access</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", background: "#260a42", color: "#fff",
                  border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>person_add</span>
                  Add New User
                </button>
                <button style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", background: "#251b2e", color: "#cbd5e1",
                  border: "1px solid #3c2e4d", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>download</span>
                  Export CSV
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)", borderBottom: "1px solid rgba(239,68,68,0.25)",
                padding: "12px 24px", fontSize: 13, color: "#fca5a5",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>warning</span>
                {error}
              </div>
            )}

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(38,10,66,0.12)" }}>
                    {["Username", "Email", "Status", "Recent Activity", "Actions"].map((h, i) => (
                      <th key={h} style={{
                        padding: "12px 24px",
                        textAlign: i === 4 ? "right" : "left",
                        fontSize: 11, fontWeight: 700, color: "#94a3b8",
                        textTransform: "uppercase", letterSpacing: "0.08em",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>

                  {/* Loading skeleton rows */}
                  {loading && Array.from({ length: 4 }).map((_, i) => (
                    <tr key={`skel-${i}`} style={{ borderTop: "1px solid #3c2e4d" }}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} style={{ padding: "14px 24px" }}>
                          <div style={{
                            height: 14, borderRadius: 6,
                            background: "rgba(255,255,255,0.05)",
                            width: j === 0 ? 120 : j === 4 ? 32 : "80%",
                          }} />
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Empty state */}
                  {!loading && paginated.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: "40px 24px", textAlign: "center", color: "#64748b" }}>
                        No users found.
                      </td>
                    </tr>
                  )}

                  {/* User rows */}
                  {!loading && paginated.map(user => (
                    <tr
                      key={user._id ?? user.username}
                      style={{ borderTop: "1px solid #3c2e4d", transition: "background 0.1s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(38,10,66,0.08)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "14px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar name={user.username} src={user.avatar} />
                          <span style={{ fontWeight: 500, fontSize: 14 }}>{user.username}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 24px", fontSize: 14, color: "#cbd5e1" }}>{user.email}</td>
                      <td style={{ padding: "14px 24px" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center",
                          padding: "2px 10px", borderRadius: 999,
                          fontSize: 11, fontWeight: 700,
                          background: user.status === "Active" ? "rgba(11,218,115,0.1)" : "rgba(251,146,60,0.1)",
                          color: user.status === "Active" ? "#0bda73" : "#fb923c",
                          border: `1px solid ${user.status === "Active" ? "rgba(11,218,115,0.25)" : "rgba(251,146,60,0.25)"}`,
                        }}>
                          {user.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 24px", fontSize: 13, color: "#94a3b8" }}>{user.activity}</td>
                      <td style={{ padding: "14px 24px", textAlign: "right" }}>
                        <button style={{
                          background: "none", border: "none", color: "#94a3b8",
                          cursor: "pointer", padding: 4, display: "inline-flex",
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 22, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{
              padding: "16px 24px", borderTop: "1px solid #3c2e4d",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <p style={{ fontSize: 13, color: "#94a3b8" }}>
                {loading
                  ? "Loading users…"
                  : `Showing ${paginated.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, users.length)} of ${users.length} users`
                }
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  style={{
                    padding: "4px 14px", background: "#251b2e",
                    border: "1px solid #3c2e4d", borderRadius: 6,
                    fontSize: 13, color: "#94a3b8",
                    cursor: page === 1 || loading ? "not-allowed" : "pointer",
                    opacity: page === 1 || loading ? 0.5 : 1,
                  }}
                >Previous</button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0 || loading}
                  style={{
                    padding: "4px 14px", background: "#260a42",
                    border: "none", borderRadius: 6, fontSize: 13,
                    color: "#fff", fontWeight: 600,
                    cursor: page === totalPages || loading ? "not-allowed" : "pointer",
                    opacity: page === totalPages || loading ? 0.5 : 1,
                  }}
                >Next</button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}