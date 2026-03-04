import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";

function AdminStockChart() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    axios.get("/stocks")
      .then(res => setStocks(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Stocks</h2>

      {stocks.map(stock => (
        <div key={stock._id} className="border p-4 mb-2 rounded-lg">
          {stock.name} - ₹{stock.price}
        </div>
      ))}
    </div>
  );
}

export default AdminStockChart;