import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import History from "./pages/History";
import Profile from "./pages/Profile";
import StockChart from "./pages/StockChart";

import Admin from "./pages/Admin";
import Users from "./pages/Users";
import AllOrders from "./pages/AllOrders";
import AllTransactions from "./pages/AllTransactions";
import AdminStockChart from "./pages/AdminStockChart";

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Dashboard */}
        <Route path="/home" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/stock/:id" element={<StockChart />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-stocks" element={<AdminStockChart />} />
        <Route path="/users" element={<Users />} />
        <Route path="/all-orders" element={<AllOrders />} />
        <Route path="/all-transactions" element={<AllTransactions />} />

      </Routes>
    </>
  );
}

export default App;