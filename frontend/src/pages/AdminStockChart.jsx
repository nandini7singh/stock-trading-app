import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../components/axiosInstance";   // ← real axios instance
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";

// ─── Feed Events (static — replace with API if you have an endpoint) ──────────
const feedEvents = [
  { ts: "2023-11-24 10:15:32", source: "Polygon.io Main",   price: "₹182.41", vol: 4502, status: "Verified" },
  { ts: "2023-11-24 10:15:31", source: "Finnhub Websocket", price: "₹182.38", vol: 1210, status: "Verified" },
  { ts: "2023-11-24 10:15:30", source: "AlphaVantage REST", price: "₹189.50", vol: 0,    status: "Anomaly"  },
  { ts: "2023-11-24 10:15:29", source: "IEX Cloud",         price: "₹182.40", vol: 890,  status: "Verified" },
];

// ─── Sparkline SVG ────────────────────────────────────────────────────────────
function Sparkline({ up }) {
  const pts = up
    ? "0,28 12,24 24,26 36,18 48,20 60,12 72,14 84,8 96,10 108,4"
    : "0,4  12,8  24,6  36,14 48,12 60,20 72,18 84,24 96,22 108,28";
  return (
    <svg width={110} height={32} viewBox="0 0 110 32" fill="none">
      <polyline
        points={pts}
        stroke={up ? "#0bda73" : "#f87171"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray="220"
        style={{ animation: "dash 1.2s ease forwards" }}
      />
    </svg>
  );
}

// ─── Donut Ring ───────────────────────────────────────────────────────────────
function DonutRing({ value }) {
  const r = 14, circ = 2 * Math.PI * r;
  const fill = (value / 100) * circ;
  return (
    <svg width={36} height={36} viewBox="0 0 36 36">
      <circle cx={18} cy={18} r={r} stroke="#3c2e4d" strokeWidth={4} fill="none" />
      <circle cx={18} cy={18} r={r} stroke="#0bda73" strokeWidth={4} fill="none"
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 18 18)"
        style={{ transition: "stroke-dasharray 1s ease" }} />
    </svg>
  );
}

// ─── Price Chart ──────────────────────────────────────────────────────────────
function PriceChart() {
  const [range, setRange] = useState("1W");
  const points = "40,120 80,105 120,115 160,90 200,95 240,75 280,80 320,60 360,65 400,45 440,50 480,35 520,40";
  return (
    <div style={{ background: "#160d20", borderRadius: 16, padding: 24, border: "1px solid #3c2e4d" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: "#f1f5f9" }}>
          Price Performance (Historical vs Correction)
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["1H", "1D", "1W", "1M"].map(r => (
            <button key={r} onClick={() => setRange(r)} style={{
              padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600,
              cursor: "pointer", border: "1px solid #3c2e4d",
              background: range === r ? "#7c3aed" : "transparent",
              color: range === r ? "#fff" : "#94a3b8",
              transition: "all 0.2s",
            }}>{r}</button>
          ))}
        </div>
      </div>
      <svg width="100%" height="160" viewBox="0 0 560 160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={`${points} 520,160 40,160`} fill="url(#chartGrad)" stroke="none" />
        <polyline points={points} fill="none"
          stroke="#7c3aed" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="1000"
          style={{ animation: "dash 2s ease forwards" }} />
        <polyline
          points="40,115 120,110 200,100 280,88 360,72 440,58 520,42"
          fill="none" stroke="#0bda73" strokeWidth="1.5"
          strokeDasharray="6 4" strokeLinecap="round" opacity={0.7} />
      </svg>
      <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
        {[["#7c3aed", "Historical"], ["#0bda73", "Corrected"]].map(([c, l]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 20, height: 2, background: c, display: "inline-block", borderRadius: 2 }} />
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function AdminStockChart() {
  const [stocks,    setStocks]    = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [activeNav, setActiveNav] = useState("Stocks Management");
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // ── Fetch stocks from backend ──────────────────────────────────
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get("/stocks");

        // Normalize fields that the chart page needs but schema may not have
        const normalized = data.map(s => ({
          ...s,
          ticker:    s.symbol    ?? s.ticker    ?? "—",
          change:    s.change    ?? 0,
          volume:    s.volume    ?? "—",
          latency:   s.latency   ?? "—",
          integrity: s.integrity ?? 100,
          status:    s.status    ?? "Active",
        }));

        setStocks(normalized);
        setSelected(normalized[0] ?? null);
      } catch (err) {
        console.error("Failed to fetch stocks:", err);
        setError("Could not load stocks from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const sel = selected ?? stocks[0];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes dash { to { stroke-dashoffset: 0; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:none; } }
        .stock-row:hover { background: #1a0d2a !important; }
        input::placeholder { color: #64748b; }
      `}</style>

      <div style={{
        display: "flex", minHeight: "100vh",
        background: "#0f0a1a", color: "#f1f5f9",
      }}>
        <AdminSidebar activeNav={activeNav} setActiveNav={setActiveNav} />

        <main style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflowY: "auto" }}>
          <AdminNavbar title="Stocks Management" />

          <div style={{ padding: "28px 32px" }}>

            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, color: "#64748b" }}>
              {["Admin", "Market Data", "Stocks Management"].map((crumb, i, arr) => (
                <span key={crumb} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: i === arr.length - 1 ? "#cbd5e1" : "#64748b", cursor: i < arr.length - 1 ? "pointer" : "default" }}>
                    {crumb}
                  </span>
                  {i < arr.length - 1 && <span>›</span>}
                </span>
              ))}
            </div>

            {/* Loading state */}
            {loading && (
              <div style={{ color: "#94a3b8", textAlign: "center", marginTop: 60 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32, display: "block", marginBottom: 10, opacity: 0.4 }}>hourglass_empty</span>
                Loading stocks…
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10, padding: "12px 16px", marginBottom: 20,
                fontSize: 13, color: "#fca5a5", display: "flex", alignItems: "center", gap: 8,
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>warning</span>
                {error}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && stocks.length === 0 && (
              <div style={{ color: "#64748b", textAlign: "center", marginTop: 60 }}>No stocks found.</div>
            )}

            {/* Main content — only render when we have data */}
            {!loading && stocks.length > 0 && sel && (
              <>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
                  <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
                      {sel.ticker} – {sel.name}
                    </h1>
                    <p style={{ color: "#94a3b8", fontSize: 13 }}>
                      Real-time management dashboard. Correction of data anomalies, historical verification, and trading volume synchronization.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button style={{
                      padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                      border: "1px solid #3c2e4d", background: "#251b2e", color: "#cbd5e1",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span> Export TSV
                    </button>
                    <button style={{
                      padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                      border: "none", background: "linear-gradient(135deg,#7c3aed,#5b21b6)", color: "#fff",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span> Edit Records
                    </button>
                  </div>
                </div>

                {/* Stock selector pills */}
                <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
                  {stocks.map(s => (
                    <button key={s._id} onClick={() => setSelected(s)} style={{
                      padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                      cursor: "pointer", transition: "all 0.2s",
                      border: sel._id === s._id ? "1px solid #7c3aed" : "1px solid #3c2e4d",
                      background: sel._id === s._id ? "#260a42" : "transparent",
                      color: sel._id === s._id ? "#c4b5fd" : "#64748b",
                    }}>{s.ticker}</button>
                  ))}
                </div>

                {/* Stat cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                  {[
                    {
                      label: "Current Exchange Price",
                      value: `$${parseFloat(sel.price).toFixed(2)}`,
                      sub: `${sel.change > 0 ? "▲" : "▼"} ${Math.abs(sel.change)}%`,
                      subColor: sel.change > 0 ? "#0bda73" : "#f87171",
                      sparkUp: sel.change > 0,
                    },
                    {
                      label: "Platform Trading Vol.",
                      value: sel.volume !== "—" ? sel.volume : "N/A",
                      sub: "▼ 0.5%",
                      subColor: "#f87171",
                      sparkUp: false,
                    },
                    {
                      label: "API Feed Latency",
                      value: sel.latency !== "—" ? sel.latency : "N/A",
                      sub: "● Stable",
                      subColor: "#0bda73",
                    },
                    {
                      label: "Data Integrity Score",
                      value: `${sel.integrity}%`,
                      donut: true,
                      integrity: sel.integrity,
                    },
                  ].map((card, i) => (
                    <div key={i} style={{
                      background: "#160d20", border: "1px solid #3c2e4d", borderRadius: 16,
                      padding: "20px 24px", animation: `fadeUp 0.4s ease ${i * 0.07}s both`,
                    }}>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>{card.label}</div>
                      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", color: "#fff" }}>
                            {card.value}
                          </div>
                          {card.sub && (
                            <div style={{ fontSize: 13, color: card.subColor, marginTop: 4, fontWeight: 600 }}>
                              {card.sub}
                            </div>
                          )}
                        </div>
                        {card.sparkUp !== undefined && <Sparkline up={card.sparkUp} />}
                        {card.donut && <DonutRing value={card.integrity} />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div style={{ marginBottom: 24 }}>
                  <PriceChart />
                </div>

                {/* Feed Events Table */}
                <div style={{ background: "#160d20", border: "1px solid #3c2e4d", borderRadius: 16, padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: "#f1f5f9" }}>Recent Raw Feed Events</div>
                    <div style={{ display: "flex", gap: 10 }}>
                      {["Filter by Source", "Batch Correct"].map(btn => (
                        <button key={btn} style={{
                          padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                          border: "1px solid #3c2e4d", background: "transparent",
                          color: "#94a3b8", cursor: "pointer",
                        }}>{btn}</button>
                      ))}
                    </div>
                  </div>

                  {/* Table header */}
                  <div style={{
                    display: "grid", gridTemplateColumns: "2fr 2fr 1.2fr 1fr 1fr 1.2fr",
                    padding: "8px 16px", fontSize: 11, fontWeight: 700,
                    color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase",
                    borderBottom: "1px solid #3c2e4d",
                  }}>
                    {["Timestamp", "Feed Source", "Price Point", "Volume", "Status", "Action"].map(h => (
                      <span key={h}>{h}</span>
                    ))}
                  </div>

                  {feedEvents.map((ev, i) => (
                    <div key={i} className="stock-row" style={{
                      display: "grid", gridTemplateColumns: "2fr 2fr 1.2fr 1fr 1fr 1.2fr",
                      padding: "14px 16px", borderBottom: "1px solid #1e1530",
                      fontSize: 13, color: "#cbd5e1", alignItems: "center",
                      transition: "background 0.15s",
                      animation: `fadeUp 0.4s ease ${i * 0.06}s both`,
                    }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#94a3b8" }}>{ev.ts}</span>
                      <span>{ev.source}</span>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{ev.price}</span>
                      <span>{ev.vol.toLocaleString()}</span>
                      <span>
                        <span style={{
                          padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                          background: ev.status === "Verified" ? "rgba(11,218,115,0.12)" : "rgba(248,113,113,0.12)",
                          color: ev.status === "Verified" ? "#0bda73" : "#f87171",
                          border: `1px solid ${ev.status === "Verified" ? "rgba(11,218,115,0.3)" : "rgba(248,113,113,0.3)"}`,
                        }}>{ev.status}</span>
                      </span>
                      <span>
                        {ev.status === "Anomaly" ? (
                          <button style={{
                            padding: "5px 12px", borderRadius: 7, fontSize: 11, fontWeight: 600,
                            background: "#3b1f5e", border: "1px solid #7c3aed",
                            color: "#c4b5fd", cursor: "pointer",
                          }}>Discard Point</button>
                        ) : (
                          <span style={{ fontSize: 12, color: "#475569" }}>—</span>
                        )}
                      </span>
                    </div>
                  ))}

                  <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>Showing 4 of 285 raw feed points for last 5 minutes</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      {["chevron_left", "chevron_right"].map(ic => (
                        <button key={ic} style={{
                          width: 32, height: 32, borderRadius: 8,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: "#251b2e", border: "1px solid #3c2e4d", cursor: "pointer",
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#94a3b8" }}>{ic}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default AdminStockChart;