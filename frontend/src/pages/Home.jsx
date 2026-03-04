import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

function Home() {
  const [stocks, setStocks] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStocks();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 text-white">
      
      <h2 className="text-4xl font-bold text-center mb-10 tracking-wide">
        📈 SB Stocks Trading Dashboard gvhgul
      </h2>

      {loading ? (
        <p className="text-center text-gray-400 animate-pulse">
          Loading market data...
        </p>
      ) : stocks.length === 0 ? (
        <p className="text-center text-gray-500">
          No Stocks Available
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stocks.map((stock) => {
            const quantity = quantities[stock._id] || 0;
            const totalValue = quantity * stock.price;
            const isUp = Math.random() > 0.5; // temporary random change indicator

            return (
              <div
                key={stock._id}
                className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-lg p-6 hover:scale-105 transition-all duration-300"
              >
                {/* Stock Name */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {stock.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {stock.symbol}
                    </p>
                  </div>

                  <div className={`flex items-center ${isUp ? "text-green-400" : "text-red-400"}`}>
                    {isUp ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                  </div>
                </div>

                {/* Price */}
                <p className="text-3xl font-bold mb-4">
                  ₹{stock.price}
                </p>

                {/* Quantity Input */}
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

                {/* Total Value */}
                {quantity > 0 && (
                  <p className="text-sm text-gray-300 mb-4">
                    Total Value: <span className="font-semibold">₹{totalValue}</span>
                  </p>
                )}

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => placeOrder(stock._id, "buy")}
                    className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded-xl font-semibold transition duration-300"
                  >
                    Buy
                  </button>

                  <button
                    onClick={() => placeOrder(stock._id, "sell")}
                    className="flex-1 bg-red-500 hover:bg-red-600 py-2 rounded-xl font-semibold transition duration-300"
                  >
                    Sell
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Home;