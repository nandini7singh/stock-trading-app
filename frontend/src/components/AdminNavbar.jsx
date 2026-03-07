export default function AdminNavbar() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 32px",
        borderBottom: "1px solid #3c2e4d",
        position: "sticky",
        top: 0,
        background: "rgba(25,17,33,0.85)",
        backdropFilter: "blur(12px)",
        zIndex: 20,
      }}
    >
      <h2 style={{ fontWeight: 700, fontSize: 20 }}>Platform Overview</h2>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <span
            className="material-symbols-outlined"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 18,
              color: "#94a3b8",
            }}
          >
            search
          </span>

          <input
            type="text"
            placeholder="Search accounts or trades..."
            style={{
              background: "#251b2e",
              border: "1px solid #3c2e4d",
              borderRadius: 8,
              padding: "8px 16px 8px 38px",
              fontSize: 13,
              color: "#f1f5f9",
              width: 240,
              outline: "none",
            }}
          />
        </div>

        {/* Icons */}
        {["notifications", "help"].map((icon) => (
          <button
            key={icon}
            style={{
              padding: 8,
              background: "#251b2e",
              border: "1px solid #3c2e4d",
              borderRadius: 8,
              cursor: "pointer",
              color: "#cbd5e1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="material-symbols-outlined">{icon}</span>
          </button>
        ))}
      </div>
    </header>
  );
}