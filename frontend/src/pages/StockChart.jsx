import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";

function StockChart() {
  const { id } = useParams();
  const [stock, setStock] = useState(null);

  useEffect(() => {
    axios.get(`/stocks`)
      .then(res => {
        const found = res.data.find(s => s._id === id);
        setStock(found);
      });
  }, [id]);

  if (!stock) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{stock.name}</h2>
      <p>Symbol: {stock.symbol}</p>
      <p>Price: ₹{stock.price}</p>
    </div>
  );
}

export default StockChart;