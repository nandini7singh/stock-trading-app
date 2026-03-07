import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../components/axiosInstance";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockUsers = [
  {
    _id: "1",
    userId: "SB-9842",
    name: "Alexander Wright",
    email: "a.wright@example.com",
    joinDate: "Oct 12, 2023",
    portfolioValue: "$45,210.50",
    role: "active",
  },
  {
    _id: "2",
    userId: "SB-8711",
    name: "Elena Rodriguez",
    email: "elena.rod@fintech.net",
    joinDate: "Nov 05, 2023",
    portfolioValue: "$128,400.00",
    role: "active",
  },
  {
    _id: "3",
    userId: "SB-7521",
    name: "Marcus Thorne",
    email: "m.thorne@services.com",
    joinDate: "Aug 18, 2023",
    portfolioValue: "$2,150.00",
    role: "suspended",
  },
  {
    _id: "4",
    userId: "SB-6419",
    name: "Sarah Jenkins",
    email: "jenkins.s@cloud.io",
    joinDate: "Dec 02, 2023",
    portfolioValue: "$18,720.00",
    role: "active",
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const HistoryIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
  </svg>
);
const BanIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ChevronLeft = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const FilterIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="12" y1="18" x2="12" y2="18" strokeLinecap="round" />
  </svg>
);
const DownloadIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const UserPlusIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const navItems = [
  { icon: "group", label: "User Management", path: "/users" },
  {
    icon: "monitoring",
    label: "Stocks Management",
    path: "/stocks-management",
  },
  { icon: "analytics", label: "Platform Analytics", path: "#" },
  { icon: "settings", label: "Settings", path: "#" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
function Users() {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeNav, setActiveNav] = useState("User Management");

  useEffect(() => {
    axios
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => setUsers(mockUsers));
  }, []);

  const displayUsers = users.length > 0 ? users : mockUsers;
  const filteredUsers = displayUsers.filter((u) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return u.role === "active";
    if (activeTab === "suspended") return u.role === "suspended";
    if (activeTab === "premium") return u.role === "premium";
    return true;
  });

  const tabs = [
    { id: "all", label: "All Users" },
    { id: "active", label: "Active" },
    { id: "suspended", label: "Suspended" },
    { id: "premium", label: "Premium" },
  ];

  const stats = [
    { label: "Total Registered Users", value: "12,840", badge: "+12%" },
    { label: "Active Investors", value: "1,204", badge: "+5.2%" },
    { label: "New Registrations (24h)", value: "156", badge: "+8.1%" },
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        rel="stylesheet"
      />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        input::placeholder { color: #64748b; }
      `}</style>

      <div
  style={{
    display: "flex",
    minHeight: "100vh",
    background: "#0f0a1a",
    color: "#e2e0ea",
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
  }}
>
  {/* Sidebar */}
  <AdminSidebar
    activeNav={activeNav}
    setActiveNav={setActiveNav}
  />

  {/* Main */}
  <main
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      overflowY: "auto",
    }}
  >
    {/* Navbar */}
    <AdminNavbar title="User Management" />

    {/* Page Content */}
    <div style={{ padding: "32px 28px" }}>
            {/* Page header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "28px",
              }}
            >
              <div>
                <h1
                  style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "#f0eeff",
                    margin: "0 0 6px 0",
                    letterSpacing: "-0.5px",
                  }}
                >
                  User Management
                </h1>
                <p style={{ color: "#6b6880", fontSize: "14px", margin: 0 }}>
                  Manage, monitor, and support all registered platform
                  investors.
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "10px 18px",
                    backgroundColor: "#1a1724",
                    border: "1px solid #2a2538",
                    borderRadius: "8px",
                    color: "#c0bcd0",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  <DownloadIcon /> Export CSV
                </button>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "10px 18px",
                    background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  <UserPlusIcon /> Add New User
                </button>
              </div>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
                marginBottom: "28px",
              }}
            >
              {stats.map((stat, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#1a1724",
                    border: "1px solid #2a2538",
                    borderRadius: "12px",
                    padding: "22px 24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <span style={{ color: "#9890b0", fontSize: "13px" }}>
                      {stat.label}
                    </span>
                    <span
                      style={{
                        backgroundColor: "#14532d",
                        color: "#4ade80",
                        fontSize: "11px",
                        fontWeight: "600",
                        padding: "3px 8px",
                        borderRadius: "20px",
                      }}
                    >
                      {stat.badge}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: "800",
                      color: "#f0eeff",
                      letterSpacing: "-1px",
                      marginBottom: "10px",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      height: "3px",
                      background:
                        "linear-gradient(90deg, #7c3aed 60%, #2a2538 100%)",
                      borderRadius: "2px",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Table card */}
            <div
              style={{
                backgroundColor: "#1a1724",
                border: "1px solid #2a2538",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              {/* Tabs + filter */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderBottom: "1px solid #2a2538",
                }}
              >
                <div style={{ display: "flex", gap: "4px" }}>
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        padding: "7px 16px",
                        borderRadius: "7px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: activeTab === tab.id ? "600" : "400",
                        backgroundColor:
                          activeTab === tab.id ? "#7c3aed" : "transparent",
                        color: activeTab === tab.id ? "#fff" : "#9890b0",
                        transition: "all 0.15s",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 14px",
                    backgroundColor: "transparent",
                    border: "1px solid #2a2538",
                    borderRadius: "7px",
                    color: "#9890b0",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  <FilterIcon /> More Filters
                </button>
              </div>

              {/* Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #2a2538" }}>
                      {[
                        "USER ID",
                        "NAME & EMAIL",
                        "JOIN DATE",
                        "PORTFOLIO VALUE",
                        "STATUS",
                        "ACTIONS",
                      ].map((col) => (
                        <th
                          key={col}
                          style={{
                            padding: "12px 20px",
                            textAlign: "left",
                            fontSize: "11px",
                            fontWeight: "600",
                            letterSpacing: "1px",
                            color: "#6b6880",
                          }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, idx) => {
                      const isSuspended = user.role === "suspended";
                      return (
                        <tr
                          key={user._id}
                          style={{
                            borderBottom:
                              idx < filteredUsers.length - 1
                                ? "1px solid #221f2e"
                                : "none",
                            transition: "background 0.1s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#1f1c2e")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                        >
                          <td
                            style={{
                              padding: "16px 20px",
                              fontSize: "13px",
                              color: "#9890b0",
                            }}
                          >
                            #
                            {user.userId ||
                              user._id?.slice(-4)?.toUpperCase() ||
                              "----"}
                          </td>
                          <td style={{ padding: "16px 20px" }}>
                            <div
                              style={{
                                fontWeight: "600",
                                fontSize: "14px",
                                color: "#f0eeff",
                              }}
                            >
                              {user.name || user.email?.split("@")[0]}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#6b6880",
                                marginTop: "2px",
                              }}
                            >
                              {user.email}
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "16px 20px",
                              fontSize: "13px",
                              color: "#9890b0",
                            }}
                          >
                            {user.joinDate || "—"}
                          </td>
                          <td
                            style={{
                              padding: "16px 20px",
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#f0eeff",
                            }}
                          >
                            {user.portfolioValue || "—"}
                          </td>
                          <td style={{ padding: "16px 20px" }}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "5px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "600",
                                backgroundColor: isSuspended
                                  ? "#2a2538"
                                  : "#0f2e1a",
                                color: isSuspended ? "#9890b0" : "#4ade80",
                              }}
                            >
                              <span
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  borderRadius: "50%",
                                  backgroundColor: isSuspended
                                    ? "#6b6880"
                                    : "#4ade80",
                                  display: "inline-block",
                                }}
                              />
                              {isSuspended ? "Suspended" : "Active"}
                            </span>
                          </td>
                          <td style={{ padding: "16px 20px" }}>
                            <div
                              style={{
                                display: "flex",
                                gap: "6px",
                                alignItems: "center",
                              }}
                            >
                              <button
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "6px",
                                  border: "1px solid #2a2538",
                                  backgroundColor: "transparent",
                                  color: "#9890b0",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <EyeIcon />
                              </button>
                              <button
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "6px",
                                  border: "1px solid #2a2538",
                                  backgroundColor: "transparent",
                                  color: "#9890b0",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <HistoryIcon />
                              </button>
                              {isSuspended ? (
                                <button
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "6px",
                                    border: "1px solid #14532d",
                                    backgroundColor: "transparent",
                                    color: "#4ade80",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <CheckIcon />
                                </button>
                              ) : (
                                <button
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "6px",
                                    border: "1px solid #450a0a",
                                    backgroundColor: "transparent",
                                    color: "#ef4444",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <BanIcon />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 20px",
                  borderTop: "1px solid #2a2538",
                }}
              >
                <span style={{ fontSize: "13px", color: "#6b6880" }}>
                  Showing 1 to 10 of 12,840 users
                </span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "6px",
                      border: "1px solid #2a2538",
                      backgroundColor: "transparent",
                      color: "#9890b0",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChevronLeft />
                  </button>
                  {[1, 2, 3].map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "6px",
                        border:
                          currentPage === p ? "none" : "1px solid #2a2538",
                        backgroundColor:
                          currentPage === p ? "#7c3aed" : "transparent",
                        color: currentPage === p ? "#fff" : "#9890b0",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                  <span
                    style={{
                      color: "#6b6880",
                      fontSize: "13px",
                      padding: "0 4px",
                    }}
                  >
                    ...
                  </span>
                  <button
                    style={{
                      width: "42px",
                      height: "30px",
                      borderRadius: "6px",
                      border: "1px solid #2a2538",
                      backgroundColor: "transparent",
                      color: "#9890b0",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    1,284
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "6px",
                      border: "1px solid #2a2538",
                      backgroundColor: "transparent",
                      color: "#9890b0",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            </div>

          </div>
      </main>
    </div>
    </>
  );
}

export default Users;
