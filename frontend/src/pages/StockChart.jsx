import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function StockChart() {

  const { id } = useParams();
  const [stock, setStock] = useState(null);

  useEffect(() => {

  axios.get("/stocks")
    .then(res => {

      const selectedStock = res.data.find(
        (s) => s._id === id
      );

      setStock(selectedStock);

    })
    .catch(err => console.log(err));

}, [id]);

  if (!stock) {
  return (
    <p className="p-10 text-lg">
      Loading chart...
    </p>
  );
}

  // Fake price history for demo
  const data = [
    { time: "9:00", price: stock.price - 50 },
    { time: "10:00", price: stock.price - 20 },
    { time: "11:00", price: stock.price + 10 },
    { time: "12:00", price: stock.price - 5 },
    { time: "1:00", price: stock.price + 30 },
    { time: "2:00", price: stock.price + 10 },
    { time: "3:00", price: stock.price }
  ];

  return (

    <div className="p-10">

      <h2 className="text-2xl font-bold mb-6">
        {stock.name} Stock Chart
      </h2>

      <div className="bg-white p-6 rounded-lg shadow">

        <ResponsiveContainer width="100%" height={400}>

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="time" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default StockChart;