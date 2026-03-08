import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import MarketWatch from "./pages/MarketWatch";
import History from "./pages/History";
import Profile from "./pages/Profile";

import Markets from "./pages/Markets";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Education from "./pages/Education";

import Admin from "./pages/Admin";
import Users from "./pages/Users";
import AllOrders from "./pages/AllOrders";
import AllTransactions from "./pages/AllTransactions";
import AdminStockChart from "./pages/AdminStockChart";
import AdminRoute from "./components/AdminRoute";
import AdminStocks from "./pages/AdminStocks";

/* LOGIN CHECK */
const isLoggedIn = () => {
  return localStorage.getItem("token");
};

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/education" element={<Education />} />

        {/* User Dashboard */}

        <Route
          path="/home"
          element={isLoggedIn() ? <Home /> : <Navigate to="/login" />}
        />

        <Route
          path="/portfolio"
          element={isLoggedIn() ? <Portfolio /> : <Navigate to="/login" />}
        />

        <Route
          path="/marketwatch"
          element={isLoggedIn() ? <MarketWatch /> : <Navigate to="/login" />}
        />

        <Route
          path="/history"
          element={isLoggedIn() ? <History /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile"
          element={isLoggedIn() ? <Profile /> : <Navigate to="/login" />}
        />

        <Route path="/stock/:id" element={<Navigate to="/marketwatch" />} />

        {/* Admin Panel */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route
          path="/users"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />

        <Route
          path="/all-orders"
          element={
            <AdminRoute>
              <AllOrders />
            </AdminRoute>
          }
        />

        <Route
          path="/all-transactions"
          element={
            <AdminRoute>
              <AllTransactions />
            </AdminRoute>
          }
        />

        <Route
          path="/stocks-management"
          element={<AdminStocks />}
        />

        <Route
          path="/chart"
          element={<AdminStockChart />}
        />

      </Routes>
    </>
  );
}

export default App;