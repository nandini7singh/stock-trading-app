import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import History from "./pages/History";
import Admin from "./pages/Admin";
import Login from "./components/LOgin";
import Register from "./components/Register";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import AdminStockChart from "./pages/AdminStockChart";
import AllOrders from "./pages/AllOrders";
import AllTransactions from "./pages/AllTransactions";
import Users from "./pages/Users";
import StockChart from "./pages/StockChart";



function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
<Route path="/profile" element={<Profile />} />
<Route path="/admin-stocks" element={<AdminStockChart />} />
<Route path="/all-orders" element={<AllOrders />} />
<Route path="/all-transactions" element={<AllTransactions />} />
<Route path="/users" element={<Users />} />
<Route path="/stock/:id" element={<StockChart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;