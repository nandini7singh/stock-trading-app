import { useState } from "react";
import {
  LayoutDashboard, Briefcase, BarChart2,
  History, Settings, Bell, ChevronDown,
  TrendingUp, TrendingDown, MoreVertical,
  Search, Info, Flame, Newspaper
} from "lucide-react";
import Sidebar from "../components/Sidebar";
/* ── Palette & tokens ─────────────────────────────────────── */
const C = {
  bg:       "#0d0d14",
  surface:  "#13131f",
  card:     "#181826",
  border:   "#252538",
  accent:   "#7c5cfc",
  accentHi: "#9b7ffe",
  green:    "#00e676",
  greenDim: "#00c65344",
  red:      "#ff4560",
  redDim:   "#ff456044",
  text:     "#e8e8f0",
  muted:    "#6b6b8a",
  label:    "#9494b8",
};

/* ── Mock data ────────────────────────────────────────────── */
const CANDLES = (() => {
  const times = ["09:30","10:00","10:30","11:00","11:30","12:00","12:30","01:00","01:30","02:00","02:30","03:00","03:30","04:00"];
  let p = 185;
  return times.map((t) => {
    const open  = p + (Math.random() - 0.48) * 4;
    const close = open + (Math.random() - 0.45) * 5;
    const high  = Math.max(open, close) + Math.random() * 2;
    const low   = Math.min(open, close) - Math.random() * 2;
    p = close;
    return { time: t, open, close, high, low, up: close >= open };
  });
})();

const WATCHLIST = [
  { sym: "TSLA", name: "Tesla Inc.",     sector: "Automotive",    price: 175.22, chg: -2.14, data: [180,176,174,175,173,175] },
  { sym: "NVDA", name: "NVIDIA Corp.",   sector: "Semiconductors", price: 822.79, chg: +4.56, data: [800,808,815,819,820,823] },
  { sym: "MSFT", name: "Microsoft",      sector: "Software",       price: 415.50, chg: +0.88, data: [410,412,413,414,415,416] },
  { sym: "AMZN", name: "Amazon",         sector: "E-Commerce",     price: 186.30, chg: -0.54, data: [188,187,186,187,186,186] },
];

const NEWS = [
  { headline: "Fed signals potential rate cuts by late 2024 as inflation cools down.", time: "2 hours ago", src: "Bloomberg" },
  { headline: 'Apple\'s new AI initiative "Project Titan" gets significant internal push.', time: "4 hours ago", src: "Reuters" },
  { headline: "Crude oil prices stabilize amid Middle East supply concerns.", time: "6 hours ago", src: "Yahoo Finance" },
];

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Briefcase,       label: "Portfolio" },
  { icon: BarChart2,       label: "Market Watch" },
  { icon: History,         label: "History" },
];

/* ── Candlestick SVG renderer ─────────────────────────────── */
function CandleChart({ candles, width = 480, height = 280 }) {
  const pad = { top: 12, right: 12, bottom: 28, left: 44 };
  const W = width - pad.left - pad.right;
  const H = height - pad.top - pad.bottom;

  const prices = candles.flatMap(c => [c.high, c.low]);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const scaleY = v => H - ((v - minP) / (maxP - minP)) * H;

  const barW  = W / candles.length;
  const candW = barW * 0.55;

  const lineData = candles.map((c, i) => ({
    x: pad.left + i * barW + barW / 2,
    y: pad.top + scaleY(c.close),
  }));

  const pathD = lineData.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");
  const areaD = `${pathD} L${lineData[lineData.length-1].x},${pad.top + H} L${lineData[0].x},${pad.top + H} Z`;

  const ticks = 5;
  const yTicks = Array.from({ length: ticks }, (_, i) => minP + (maxP - minP) * (i / (ticks - 1)));

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={C.accent} stopOpacity="0.25" />
          <stop offset="100%" stopColor={C.accent} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor={C.accentHi} />
          <stop offset="100%" stopColor={C.green} />
        </linearGradient>
      </defs>

      {yTicks.map((v, i) => {
        const y = pad.top + scaleY(v);
        return (
          <g key={i}>
            <line x1={pad.left} x2={pad.left + W} y1={y} y2={y} stroke={C.border} strokeWidth="1" strokeDasharray="4 4" />
            <text x={pad.left - 6} y={y + 4} textAnchor="end" fill={C.muted} fontSize="10" fontFamily="'DM Mono', monospace">
              {v.toFixed(0)}
            </text>
          </g>
        );
      })}

      <path d={areaD} fill="url(#areaGrad)" />

      {candles.map((c, i) => {
        const cx  = pad.left + i * barW + barW / 2;
        const x   = cx - candW / 2;
        const top = pad.top + scaleY(Math.max(c.open, c.close));
        const bot = pad.top + scaleY(Math.min(c.open, c.close));
        const ht  = pad.top + scaleY(c.high);
        const lt  = pad.top + scaleY(c.low);
        const col = c.up ? C.green : C.red;
        const h   = Math.max(bot - top, 2);
        return (
          <g key={i}>
            <line x1={cx} x2={cx} y1={ht} y2={lt} stroke={col} strokeWidth="1.5" />
            <rect x={x} y={top} width={candW} height={h} fill={col} rx="1" opacity="0.9" />
          </g>
        );
      })}

      <path d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="1.5" opacity="0.5" />

      {candles.filter((_, i) => i % 2 === 0).map((c, i) => {
        const x = pad.left + (i * 2) * barW + barW / 2;
        return (
          <text key={i} x={x} y={height - 6} textAnchor="middle" fill={C.muted} fontSize="10" fontFamily="'DM Mono', monospace">
            {c.time}
          </text>
        );
      })}
    </svg>
  );
}

/* ── Mini sparkline ───────────────────────────────────────── */
function Spark({ data, up }) {
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 60;
    const y = 18 - ((v - min) / (max - min + 0.001)) * 16;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width="64" height="22" viewBox="0 0 64 22">
      <polyline points={pts} fill="none" stroke={up ? C.green : C.red} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Main Dashboard component ─────────────────────────────── */
export default function Dashboard() {
  const [activeNav, setActiveNav]   = useState("Dashboard");
  const [activeTab, setActiveTab]   = useState("buy");
  const [orderType, setOrderType]   = useState("Market Order");
  const [shares, setShares]         = useState(10);
  const [timeframe, setTimeframe]   = useState("1D");
  const [selectedStock, setSelected] = useState(WATCHLIST[0]);

  const price    = 189.45;
  const estTotal = (shares * price).toFixed(2);
  const tradeFee = (estTotal * 0.001).toFixed(2);
  const total    = (parseFloat(estTotal) + parseFloat(tradeFee)).toFixed(2);

  const tickers = ["AAPL +0.65%", "TSLA -2.14%", "NVDA +4.56%", "MSFT +0.88%", "GOOGL +1.22%", "AMZN -0.54%", "META +2.91%", "BRK.B +0.34%"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.surface}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
        input:focus { outline: none; }
        select { appearance: none; cursor: pointer; }

        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-inner { animation: ticker 28s linear infinite; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease forwards; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .live-dot { animation: pulse 1.6s ease-in-out infinite; }

        .nav-item { transition: background 0.18s, color 0.18s; border-radius: 10px; }
        .nav-item:hover { background: ${C.border}; }
        .nav-item.active { background: ${C.accent}22; color: ${C.accentHi}; }

        .tf-btn { transition: background 0.15s, color 0.15s; }
        .tf-btn:hover { background: ${C.border}; }
        .tf-btn.active { background: ${C.accent}; color: #fff; }

        .trade-tab { transition: background 0.18s; cursor: pointer; }
        .trade-btn { transition: all 0.18s; }
        .trade-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .trade-btn:active { transform: translateY(0); }

        .watch-row { transition: background 0.15s; }
        .watch-row:hover { background: ${C.border}22; }
      `}</style>

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>

        {/* Topbar */}
        <header style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 28px", height: 60, display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.muted }} />
            <input style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 12px 8px 34px", color: C.text, fontSize: 13, width: "100%", maxWidth: 360 }} placeholder="Search stocks, indices, ETFs..." />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: C.green }} />
            <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>Market Open</span>
          </div>

          <button style={{ width: 36, height: 36, borderRadius: 10, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
            <Bell size={16} color={C.label} />
            <span style={{ position: "absolute", top: 7, right: 7, width: 6, height: 6, borderRadius: "50%", background: C.red }} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Alex Rivers</div>
              <div style={{ fontSize: 10, color: C.accent, fontWeight: 700, letterSpacing: 0.5 }}>PRO TRADER</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.green})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>AR</div>
          </div>
        </header>

        {/* Ticker tape */}
        <div style={{ background: "#0a0a12", borderBottom: `1px solid ${C.border}`, padding: "6px 0", overflow: "hidden" }}>
          <div className="ticker-inner" style={{ display: "flex", gap: 40, width: "200%", whiteSpace: "nowrap" }}>
            {[...tickers, ...tickers].map((t, i) => {
              const up = t.includes("+");
              return (
                <span key={i} style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: up ? C.green : C.red, fontWeight: 500 }}>
                  {t}
                </span>
              );
            })}
          </div>
        </div>

        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Portfolio Stats */}
          <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[
              { label: "Total Portfolio Value", value: "$105,420.00", badge: "+5.42%", up: true },
              { label: "Today's P/L", value: "+$2,635.00", badge: "+2.5%", up: true, large: true },
              { label: "Buying Power", value: "$94,200.00", info: true },
            ].map((s, i) => (
              <div key={i} style={{ background: C.card, borderRadius: 16, padding: "20px 24px", border: `1px solid ${C.border}`, position: "relative" }}>
                <div style={{ color: C.muted, fontSize: 12, marginBottom: 8 }}>{s.label}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: s.large ? 30 : 26, fontWeight: 700, color: s.large ? C.green : C.text, letterSpacing: -0.5 }}>{s.value}</div>
                  {s.badge && (
                    <span style={{ background: s.up ? C.greenDim : C.redDim, color: s.up ? C.green : C.red, borderRadius: 8, padding: "3px 8px", fontSize: 12, fontWeight: 700 }}>{s.badge}</span>
                  )}
                  {s.info && <Info size={16} color={C.muted} />}
                </div>
              </div>
            ))}
          </div>

          {/* Chart + Quick Trade */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>

            {/* Chart Card */}
            <div className="fade-up" style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: "20px 24px", animationDelay: "0.08s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: `${C.accent}22`, border: `1px solid ${C.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: C.accentHi }}>AAPL</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>Apple Inc.</div>
                    <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>NASDAQ · Technology</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: C.muted, fontSize: 11, marginBottom: 3 }}>Price</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 20 }}>$189.45</div>
                  <div style={{ color: C.green, fontWeight: 700, fontSize: 13, marginTop: 2 }}>+1.24 (0.65%)</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {["1D","1W","1M","1Y","ALL"].map(tf => (
                  <button key={tf} className={`tf-btn ${timeframe === tf ? "active" : ""}`}
                    onClick={() => setTimeframe(tf)}
                    style={{ padding: "5px 12px", borderRadius: 8, border: "none", background: timeframe === tf ? C.accent : C.surface, color: timeframe === tf ? "#fff" : C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  >{tf}</button>
                ))}
              </div>

              <CandleChart candles={CANDLES} width={520} height={260} />
            </div>

            {/* Quick Trade */}
            <div className="fade-up" style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: "20px 20px", display: "flex", flexDirection: "column", gap: 16, animationDelay: "0.14s" }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Quick Trade</div>

              <div style={{ display: "flex", background: C.surface, borderRadius: 10, padding: 4, gap: 4 }}>
                {["buy","sell"].map(t => (
                  <button key={t} className="trade-tab"
                    onClick={() => setActiveTab(t)}
                    style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5, cursor: "pointer",
                      background: activeTab === t ? (t === "buy" ? C.green : C.red) : "transparent",
                      color: activeTab === t ? "#0d0d14" : C.muted }}
                  >{t}</button>
                ))}
              </div>

              <div>
                <div style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Order Type</div>
                <div style={{ position: "relative" }}>
                  <select value={orderType} onChange={e => setOrderType(e.target.value)}
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 34px 10px 12px", color: C.text, fontSize: 13 }}>
                    <option>Market Order</option>
                    <option>Limit Order</option>
                    <option>Stop Loss</option>
                  </select>
                  <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: C.muted, pointerEvents: "none" }} />
                </div>
              </div>

              <div>
                <div style={{ color: C.muted, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Amount (Shares)</div>
                <div style={{ display: "flex", alignItems: "center", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                  <input type="number" value={shares} min={1}
                    onChange={e => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{ flex: 1, background: "transparent", border: "none", padding: "10px 12px", color: C.text, fontSize: 14, fontFamily: "'DM Mono', monospace", fontWeight: 600 }} />
                  <span style={{ padding: "10px 12px", color: C.muted, fontSize: 11, fontWeight: 600, borderLeft: `1px solid ${C.border}` }}>UNIT</span>
                </div>
              </div>

              <div style={{ background: C.surface, borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["Estimated Price", `$${estTotal}`],
                  ["Trading Fee (0.1%)", `$${tradeFee}`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted }}>
                    <span>{k}</span>
                    <span style={{ color: C.label, fontFamily: "'DM Mono', monospace" }}>{v}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: C.border, margin: "2px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700 }}>
                  <span>Total</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", color: activeTab === "buy" ? C.green : C.red }}>${total}</span>
                </div>
              </div>

              <button className="trade-btn"
                style={{ width: "100%", padding: "14px 0", borderRadius: 12, border: "none", fontWeight: 800, fontSize: 13, letterSpacing: 1.2, textTransform: "uppercase", cursor: "pointer", marginTop: "auto",
                  background: activeTab === "buy" ? `linear-gradient(135deg, ${C.green}, #00b894)` : `linear-gradient(135deg, ${C.red}, #c0392b)`,
                  color: activeTab === "buy" ? "#0d0d14" : "#fff",
                  boxShadow: activeTab === "buy" ? `0 4px 20px ${C.greenDim}` : `0 4px 20px ${C.redDim}` }}
              >
                Place {activeTab === "buy" ? "Buy" : "Sell"} Order
              </button>
            </div>
          </div>

          {/* Watchlist + News */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            {/* Watchlist */}
            <div className="fade-up" style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: "20px 22px", animationDelay: "0.18s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Flame size={15} color={C.accent} />
                <span style={{ fontWeight: 700, fontSize: 15 }}>Watchlist</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {WATCHLIST.map((s) => {
                  const up = s.chg >= 0;
                  return (
                    <div key={s.sym} className="watch-row"
                      style={{ display: "flex", alignItems: "center", padding: "11px 10px", borderRadius: 12, cursor: "pointer" }}
                      onClick={() => setSelected(s)}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${C.accent}22`, border: `1px solid ${C.accent}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: C.accentHi, marginRight: 12, flexShrink: 0 }}>{s.sym.slice(0,3)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                        <div style={{ color: C.muted, fontSize: 11 }}>{s.sector}</div>
                      </div>
                      <div style={{ marginRight: 16 }}>
                        <Spark data={s.data} up={up} />
                      </div>
                      <div style={{ textAlign: "right", marginRight: 12 }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 13 }}>${s.price.toFixed(2)}</div>
                        <div style={{ color: up ? C.green : C.red, fontSize: 11, fontWeight: 700 }}>{up ? "+" : ""}{s.chg.toFixed(2)}%</div>
                      </div>
                      <MoreVertical size={14} color={C.muted} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Market News */}
            <div className="fade-up" style={{ background: C.card, borderRadius: 18, border: `1px solid ${C.border}`, padding: "20px 22px", animationDelay: "0.22s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Newspaper size={15} color={C.accent} />
                <span style={{ fontWeight: 700, fontSize: 15 }}>Market News</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {NEWS.map((n, i) => (
                  <div key={i} style={{ padding: "14px 0", borderBottom: i < NEWS.length - 1 ? `1px solid ${C.border}` : "none", cursor: "pointer" }}>
                    <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.5, marginBottom: 6 }}>{n.headline}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ color: C.muted, fontSize: 11 }}>{n.time}</span>
                      <span style={{ width: 3, height: 3, borderRadius: "50%", background: C.border, display: "inline-block" }} />
                      <span style={{ color: C.accent, fontSize: 11, fontWeight: 600 }}>{n.src}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <footer style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
          <span style={{ color: C.muted, fontSize: 12 }}>© 2024 SB Stocks Paper Trading. For educational purposes only.</span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy","Terms of Service","Help Center"].map(l => (
              <a key={l} href="#" style={{ color: C.muted, fontSize: 12, textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}