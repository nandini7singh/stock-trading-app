import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

const SEED_STOCKS = [
  { _id: "1", symbol: "AAPL", name: "Apple Inc.",       sector: "Technology",    status: "Active",   price: 192.42 },
  { _id: "2", symbol: "TSLA", name: "Tesla, Inc.",      sector: "Automotive",    status: "Active",   price: 248.48 },
  { _id: "3", symbol: "AMZN", name: "Amazon.com Inc.",  sector: "E-commerce",    status: "Inactive", price: 153.42 },
  { _id: "4", symbol: "MSFT", name: "Microsoft Corp.",  sector: "Software",      status: "Active",   price: 374.07 },
  { _id: "5", symbol: "NVDA", name: "NVIDIA Corp.",     sector: "Semiconductors",status: "Active",   price: 495.22 },
];

const TABS = ["All Stocks", "Active Listings", "Inactive / Hidden", "Pending Approval"];
const PAGE_SIZE = 5;

// ── Modal ─────────────────────────────────────────────────────────
function StockModal({ mode, stock, onClose, onSave }) {
  const [name,   setName]   = useState(stock?.name   ?? "");
  const [symbol, setSymbol] = useState(stock?.symbol ?? "");
  const [price,  setPrice]  = useState(stock?.price  ?? "");
  const [sector, setSector] = useState(stock?.sector ?? "");
  const [status, setStatus] = useState(stock?.status ?? "Active");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, symbol, price: parseFloat(price), sector, status });
  };

  const inputStyle = {
    background: "#1a1025", border: "1px solid #3c2e4d", borderRadius: 8,
    padding: "10px 14px", fontSize: 13, color: "#f1f5f9", outline: "none",
    width: "100%", boxSizing: "border-box",
  };
  const labelStyle = { fontSize: 12, color: "#94a3b8", marginBottom: 6, display: "block", fontWeight: 500 };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(10,6,18,0.72)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#1a1025", border: "1px solid #3c2e4d", borderRadius: 16,
          padding: 32, width: 460, boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>
            {mode === "add" ? "Add New Stock" : "Edit Stock"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 22, lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Company Name</label>
              <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Apple Inc." required />
            </div>
            <div>
              <label style={labelStyle}>Symbol</label>
              <input style={inputStyle} value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} placeholder="AAPL" required />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Price (USD)</label>
              <input style={inputStyle} type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" required />
            </div>
            <div>
              <label style={labelStyle}>Sector</label>
              <input style={inputStyle} value={sector} onChange={e => setSector(e.target.value)} placeholder="Technology" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={status} onChange={e => setStatus(e.target.value)}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending Approval</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button
              type="button" onClick={onClose}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid #3c2e4d",
                background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 14, fontWeight: 500,
              }}
            >Cancel</button>
            <button
              type="submit"
              style={{
                flex: 1, padding: "10px 0", borderRadius: 8, border: "none",
                background: "linear-gradient(135deg, #7c3aed, #0bda73)",
                color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700,
              }}
            >{mode === "add" ? "Add Stock" : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export default function AdminStocks() {
  const [stocks,      setStocks]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [activeTab,   setActiveTab]   = useState("All Stocks");
  const [activeNav,   setActiveNav]   = useState("Stock Management");
  const [currentPage, setCurrentPage] = useState(1);
  const [modal,       setModal]       = useState(null);

  // ── Fetch all stocks on mount ──────────────────────────────────
  const fetchStocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get("/stocks");
      // Normalize: backend may not have sector/status fields yet
      const normalized = data.map(s => ({
        ...s,
        sector: s.sector ?? "",
        status: s.status ?? "Active",
      }));
      setStocks(normalized);
    } catch (err) {
      console.error("Failed to fetch stocks:", err);
      setError("Could not load stocks from server. Showing sample data.");
      setStocks(SEED_STOCKS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStocks(); }, []);

  // ── Create / Update ────────────────────────────────────────────
  const handleSave = async ({ name, symbol, price, sector, status }) => {
    try {
      if (modal.mode === "add") {
        const { data } = await axios.post("/stocks", { name, symbol, price, sector, status });
        setStocks(prev => [...prev, { sector: "", status: "Active", ...data }]);
      } else {
        const { data } = await axios.put(`/stocks/${modal.stock._id}`, { name, symbol, price, sector, status });
        setStocks(prev => prev.map(s => s._id === modal.stock._id ? { ...s, ...data } : s));
      }
      setModal(null);
    } catch (err) {
      console.error("Failed to save stock:", err);
      alert("Failed to save stock. Please try again.");
    }
  };

  // ── Delete ─────────────────────────────────────────────────────
  const deleteStock = async (id) => {
    if (!window.confirm("Delete this stock?")) return;
    try {
      await axios.delete(`/stocks/${id}`);
      setStocks(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error("Failed to delete stock:", err);
      alert("Failed to delete stock. Please try again.");
    }
  };

  // ── Toggle visibility (Active ↔ Inactive) ──────────────────────
  const toggleVisibility = async (stock) => {
    const newStatus = stock.status === "Inactive" ? "Active" : "Inactive";
    try {
      const { data } = await axios.put(`/stocks/${stock._id}`, { ...stock, status: newStatus });
      setStocks(prev => prev.map(s => s._id === stock._id ? { ...s, ...data, status: newStatus } : s));
    } catch (err) {
      console.error("Failed to toggle visibility:", err);
      alert("Failed to update stock status. Please try again.");
    }
  };

  // ── Filtering & pagination ─────────────────────────────────────
  const filtered = stocks.filter(s => {
    if (activeTab === "Active Listings")   return s.status === "Active";
    if (activeTab === "Inactive / Hidden") return s.status === "Inactive";
    if (activeTab === "Pending Approval")  return s.status === "Pending";
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = {
    total:   stocks.length,
    active:  stocks.filter(s => s.status === "Active").length,
    flagged: stocks.filter(s => s.status === "Pending").length,
  };

  // ── Status badge ───────────────────────────────────────────────
  const statusBadge = (status) => {
    const cfg = {
      Active:   { bg: "rgba(11,218,115,0.12)",  color: "#0bda73", icon: "check_circle" },
      Inactive: { bg: "rgba(100,116,139,0.15)", color: "#94a3b8", icon: "cancel" },
      Pending:  { bg: "rgba(234,179,8,0.15)",   color: "#eab308", icon: "schedule" },
    };
    const c = cfg[status] || cfg.Active;
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        background: c.bg, color: c.color,
        borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 20" }}>{c.icon}</span>
        {status}
      </span>
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0e0a16", color: "#f1f5f9", fontFamily: "'Inter', sans-serif" }}>
      <AdminSidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <AdminNavbar title="Stock Management" />

        <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>

          {/* ── Page Header ───────────────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: 28, margin: 0, letterSpacing: "-0.02em" }}>Stock Management</h1>
              <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 6, maxWidth: 460, lineHeight: 1.5 }}>
                Control listings, monitor availability, and edit company profiles across the platform.
              </p>
            </div>
            <button
              onClick={() => setModal({ mode: "add" })}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
                color: "#fff", border: "none", borderRadius: 10,
                padding: "11px 20px", cursor: "pointer", fontSize: 14, fontWeight: 700,
                boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 20" }}>add</span>
              Add New Stock
            </button>
          </div>

          {/* ── Error banner ──────────────────────────────────────── */}
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 10, padding: "12px 16px", marginBottom: 20,
              fontSize: 13, color: "#fca5a5", display: "flex", alignItems: "center", gap: 8,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 20" }}>warning</span>
              {error}
            </div>
          )}

          {/* ── Tabs ──────────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #3c2e4d", marginBottom: 24 }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "10px 20px",
                  fontSize: 14, fontWeight: activeTab === tab ? 600 : 400,
                  color: activeTab === tab ? "#f1f5f9" : "#64748b",
                  borderBottom: activeTab === tab ? "2px solid #f1f5f9" : "2px solid transparent",
                  marginBottom: -1, transition: "color 0.15s",
                }}
              >{tab}</button>
            ))}
          </div>

          {/* ── Table ─────────────────────────────────────────────── */}
          <div style={{ background: "rgba(38,10,66,0.10)", border: "1px solid #3c2e4d", borderRadius: 14, overflow: "hidden" }}>

            {/* Table Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "120px 1fr 160px 160px 140px 130px",
              padding: "14px 24px", borderBottom: "1px solid #3c2e4d",
              background: "rgba(255,255,255,0.02)",
            }}>
              {["SYMBOL", "COMPANY NAME", "SECTOR", "STATUS", "PRICE (USD)", "ACTIONS"].map(h => (
                <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</div>
              ))}
            </div>

            {/* Loading state */}
            {loading && (
              <div style={{ padding: "40px 24px", textAlign: "center", color: "#64748b" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 28, display: "block", marginBottom: 8, opacity: 0.5 }}>hourglass_empty</span>
                Loading stocks…
              </div>
            )}

            {/* Empty state */}
            {!loading && paginated.length === 0 && (
              <div style={{ padding: "40px 24px", textAlign: "center", color: "#64748b" }}>No stocks found.</div>
            )}

            {/* Rows */}
            {!loading && paginated.map((stock, i) => (
              <div
                key={stock._id}
                style={{
                  display: "grid", gridTemplateColumns: "120px 1fr 160px 160px 140px 130px",
                  padding: "20px 24px", alignItems: "center",
                  borderBottom: i < paginated.length - 1 ? "1px solid #251b2e" : "none",
                  transition: "background 0.12s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontWeight: 700, fontSize: 14, color: "#f1f5f9", letterSpacing: "0.04em" }}>
                  {stock.symbol}
                </div>
                <div style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 500 }}>{stock.name}</div>
                <div style={{ fontSize: 14, color: "#94a3b8" }}>{stock.sector || "—"}</div>
                <div>{statusBadge(stock.status)}</div>
                <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>
                  ${parseFloat(stock.price).toFixed(2)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    onClick={() => setModal({ mode: "edit", stock })}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, lineHeight: 0 }}
                    title="Edit"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>edit</span>
                  </button>
                  <button
                    onClick={() => deleteStock(stock._id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: 4, lineHeight: 0 }}
                    title="Delete"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>delete</span>
                  </button>
                  <button
                    onClick={() => toggleVisibility(stock)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, lineHeight: 0 }}
                    title={stock.status === "Inactive" ? "Show" : "Hide"}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
                      {stock.status === "Inactive" ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination footer */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 24px", borderTop: "1px solid #3c2e4d",
              background: "rgba(255,255,255,0.01)",
            }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>
                Showing {filtered.length === 0 ? 0 : Math.min((currentPage - 1) * PAGE_SIZE + 1, filtered.length)} to {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} entries
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: "6px 14px", borderRadius: 8, border: "1px solid #3c2e4d",
                    background: "transparent", color: currentPage === 1 ? "#3c2e4d" : "#94a3b8",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer", fontSize: 13,
                  }}
                >Previous</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p} onClick={() => setCurrentPage(p)}
                    style={{
                      width: 34, height: 34, borderRadius: 8,
                      border: p === currentPage ? "none" : "1px solid #3c2e4d",
                      background: p === currentPage ? "#7c3aed" : "transparent",
                      color: p === currentPage ? "#fff" : "#94a3b8",
                      cursor: "pointer", fontSize: 13, fontWeight: p === currentPage ? 700 : 400,
                    }}
                  >{p}</button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  style={{
                    padding: "6px 14px", borderRadius: 8, border: "1px solid #3c2e4d",
                    background: "transparent",
                    color: (currentPage === totalPages || totalPages === 0) ? "#3c2e4d" : "#94a3b8",
                    cursor: (currentPage === totalPages || totalPages === 0) ? "not-allowed" : "pointer", fontSize: 13,
                  }}
                >Next</button>
              </div>
            </div>
          </div>

          {/* ── Stats Row ─────────────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 24 }}>
            {[
              {
                label: "Total Listings", value: stats.total.toLocaleString(), sub: "+12 this month",
                subColor: "#0bda73", icon: "database", iconColor: "#7c3aed", iconBg: "rgba(124,58,237,0.15)",
              },
              {
                label: "Active Stocks", value: stats.active.toLocaleString(),
                sub: `${((stats.active / Math.max(stats.total, 1)) * 100).toFixed(1)}% of total platform`,
                subColor: "#94a3b8", icon: "cell_tower", iconColor: "#0bda73", iconBg: "rgba(11,218,115,0.12)",
              },
              {
                label: "Flagged Issues", value: String(stats.flagged).padStart(2, "0"),
                sub: "Requires immediate action", subColor: "#ef4444",
                icon: "warning", iconColor: "#f59e0b", iconBg: "rgba(245,158,11,0.12)",
              },
            ].map(({ label, value, sub, subColor, icon, iconColor, iconBg }) => (
              <div key={label} style={{
                background: "rgba(38,10,66,0.10)", border: "1px solid #3c2e4d",
                borderRadius: 14, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 10,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>{label}</span>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, background: iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: iconColor, fontVariationSettings: "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 20" }}>{icon}</span>
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 28, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 12, color: subColor, display: "flex", alignItems: "center", gap: 4 }}>
                  {subColor === "#0bda73" && <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 20" }}>trending_up</span>}
                  {subColor === "#ef4444" && <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 20" }}>warning</span>}
                  {sub}
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>

      {modal && (
        <StockModal
          mode={modal.mode}
          stock={modal.stock}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}