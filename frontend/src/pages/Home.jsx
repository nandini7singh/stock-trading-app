import {
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";
import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Home() {

  const [stocks, setStocks] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStocks();
    checkRole();
  }, []);

  const checkRole = () => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);

      if (decoded.role === "admin") {
        setIsAdmin(true);
      }
    }
  };

  const fetchStocks = async () => {
    try {
      const { data } = await axios.get("/stocks");
      setStocks(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (stockId, value) => {
    setQuantities({
      ...quantities,
      [stockId]: value
    });
  };

  const placeOrder = async (stockId, type) => {
    const quantity = quantities[stockId] || 1;

    try {

      await axios.post("/orders", {
        stockId,
        quantity,
        type
      });

      alert(`${type.toUpperCase()} Order Placed ✅`);

    } catch (error) {

      alert("Login required or error occurred ❌");

    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

      {/* 🔹 NAVBAR */}
      <div className="flex justify-between items-center px-8 py-4 bg-black/30 backdrop-blur border-b border-gray-700">

        <h1 className="text-2xl font-bold">SB Stocks</h1>

        <div className="flex gap-6 items-center">

          <Link to="/home">Home</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/history">History</Link>
          <Link to="/profile">Profile</Link>

          {/* Admin Links */}
          {isAdmin && (
            <>
              <Link to="/admin/users">Users</Link>
              <Link to="/admin/orders">Orders</Link>
            </>
          )}

          <button
            onClick={logout}
            className="bg-red-500 px-4 py-1 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>

        </div>

      </div>


      {/* DASHBOARD TITLE */}
      <h2 className="text-4xl font-bold text-center mt-10 mb-10 tracking-wide">
        📈 SB Stocks Trading Dashboard
      </h2>

      {/* MARKET STATUS */}
        <div className="bg-black text-green-400 py-2 text-center text-sm">
          Market Open • Live Trading
        </div>

      {/* STOCK CARDS */}
      <div className="flex p-8 gap-8">

        {/* WATCHLIST */}
        <div className="w-1/4 bg-black/30 rounded-2xl p-4 border border-gray-700 h-fit">
        
        <h3 className="text-xl font-bold mb-4">Watchlist</h3>

        <input
        type="text"
        placeholder="Search Stock..."
        className="w-full mb-3 px-3 py-2 rounded bg-gray-800 border border-gray-600 text-sm"
        />
        
        {stocks.slice(0,5).map((stock) => (
          <Link
            key={stock._id}
            to={`/stock/${stock._id}`}
            className="block p-3 mb-2 rounded-lg hover:bg-gray-800"
         >
          <div className="flex justify-between">
            <span>{stock.symbol}</span>
            
            <span className="text-gray-400">
              ₹{stock.price}
            </span>
          </div>
        </Link>
      ))}
      </div>

        {loading ? (
          <p className="text-center text-gray-400 animate-pulse">
            Loading market data...
          </p>

        ) : stocks.length === 0 ? (
          <p className="text-center text-gray-500">
            No Stocks Available
          </p>

        ) : (
        <>
        {/* MARKET AREA */}
        <div className="w-3/4">
        <h3 className="text-xl font-bold mb-4">Trending Stocks</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {stocks.map((stock) => {
              const quantity = quantities[stock._id] || 0;
              const totalValue = quantity * stock.price;
              const isUp = Math.random() > 0.5;
              const chartData = [
                { price: stock.price - 40 },
                { price: stock.price - 25 },
                { price: stock.price - 15 },
                { price: stock.price - 5 },
                { price: stock.price },
              ];

              return (

                <div
                  key={stock._id}
                  className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-lg p-6 hover:scale-105 transition-all duration-300"
                >

                  {/* STOCK HEADER */}
                  <div className="flex justify-between items-center mb-4">

                    <div>
                      <h3 className="text-xl font-semibold">
                        {stock.name}
                      </h3>

                      <p className="text-gray-400 text-sm">
                        {stock.symbol}
                      </p>
                    </div>

                    <div className={`flex items-center gap-1 ${isUp ? "text-green-400" : "text-red-400"}`}>
                      <>
                      {isUp ? <ArrowUpRight size={20}/> : <ArrowDownRight size={20}/>}
                      <span className="text-xs">
                        {isUp ? "+1.2%" : "-0.8%"}
                        </span>
                      </>
                    </div>

                  </div>


                  {/* PRICE */}
                  <p className="text-3xl font-bold mb-4">
                    ₹{stock.price}
                    </p>
                    {/* MINI CHART */}
                    <div className="h-16 mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke={isUp ? "#22c55e" : "#ef4444"}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>


                  {/* QUANTITY */}
                  <input
                    type="number"
                    min="1"
                    value={quantities[stock._id] || ""}
                    onChange={(e) =>
                      handleQuantityChange(stock._id, e.target.value)
                    }
                    placeholder="Enter Quantity"
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />


                  {/* TOTAL VALUE */}
                  {quantity > 0 && (
                    <p className="text-sm text-gray-300 mb-4">
                      Total Value:
                      <span className="font-semibold ml-1">
                        ₹{totalValue}
                      </span>
                    </p>
                  )}


                  {/* ACTION BUTTONS */}
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-4">
                      <button
                      onClick={() => placeOrder(stock._id, "buy")}
                      className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded-xl font-semibold"
                      >
                        Buy
                        </button>
                        <button
                        onClick={() => placeOrder(stock._id, "sell")}
                        className="flex-1 bg-red-500 hover:bg-red-600 py-2 rounded-xl font-semibold"
                        >
                          Sell
                          </button>
                          </div>
                          <Link to={`/stock/${stock._id}`}>
                            <button className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-xl font-semibold">
                              View Chart
                            </button>
                          </Link>
                          </div>

                </div>

              );
            })}

          </div>

        </div>
        </>

        )}

      </div>

    </div>
  );
}

export default Home;