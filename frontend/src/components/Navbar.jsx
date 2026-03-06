import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function Navbar() {

  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
      try {

        const decoded = jwtDecode(token);

        if (decoded.role === "admin") {
          setIsAdmin(true);
        }

      } catch (error) {
        console.log("Invalid token");
      }
    }

  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (

    <div className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">

      <h2 className="font-bold text-lg">SB Stocks</h2>

      <div className="flex gap-6 items-center">

        <Link to="/home" className="hover:underline">Home</Link>
        <Link to="/portfolio" className="hover:underline">Portfolio</Link>
        <Link to="/history" className="hover:underline">History</Link>
        <Link to="/profile" className="hover:underline">Profile</Link>

        {isAdmin && (
          <>
            <Link to="/admin/users" className="hover:underline">Users</Link>
            <Link to="/admin/orders" className="hover:underline">Orders</Link>
            <Link to="/admin/stocks" className="hover:underline">Stocks</Link>
          </>
        )}

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>

    </div>

  );
}

export default Navbar;