import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import MarketWatch from "./pages/MarketWatch";
import History from "./pages/History";
import Profile from "./pages/Profile";

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

  const location = useLocation();

  const hideNavbarRoutes = [
    "/home",
    "/portfolio",
    "/marketwatch",
    "/history",
    "/profile",
    "/admin",
    "/users",
    "/all-orders",
    "/all-transactions"
  ];

  return (
    <>
      <Routes>

        {/* Landing */}
        <Route
          path="/"
          element={isLoggedIn() ? <Navigate to="/home" /> : <Landing />}
        />
        
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}

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

        {/* Admin */}

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

        <Route path="/stocks-management" element={<AdminStocks />} />
        <Route path="/chart" element={<AdminStockChart />} />

      </Routes>

    </>
  );
}

export default App;