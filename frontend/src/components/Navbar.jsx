import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);

      try {
        const decoded = jwtDecode(token);

        if (decoded.role === "admin") {
          setIsAdmin(true);
        }
      } catch {
        setIsLoggedIn(false);
      }
    }
  }, []);

  const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
  };

  return (
    <nav className="bg-[#1b1325] text-white px-10 py-4 flex items-center justify-between">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
        <div className="w-7 h-7 bg-purple-600 rounded flex items-center justify-center">
          <span className="text-xs font-bold">↗</span>
        </div>
        SB Stocks
      </Link>

      {/* Center Links */}
      <div className="hidden md:flex gap-8 text-gray-300 text-sm">
        <Link to="/markets" className="hover:text-white transition">
          Markets
        </Link>
        <Link to="/features" className="hover:text-white transition">
          Features
        </Link>
        <Link to="/pricing" className="hover:text-white transition">
          Pricing
        </Link>
        <Link to="/education" className="hover:text-white transition">
          Education
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">

        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="text-gray-300 text-sm hover:text-white transition"
            >
              Log In
            </Link>

            <Link
              to="/register"
              className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Start Trading
            </Link>
          </>
        ) : isAdmin ? (
          <Link
            to="/admin"
            className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-md text-sm"
          >
            Admin Panel
          </Link>
        ) : (
          <>
            <Link
              to="/profile"
              className="text-gray-300 text-sm hover:text-white"
            >
              Profile
            </Link>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md text-sm"
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;