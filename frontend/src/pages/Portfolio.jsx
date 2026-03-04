import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";

function Portfolio() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/orders").then(res => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>My Portfolio</h2>
      {orders.map(order => (
        <div key={order._id}>
          {order.stock.name} - {order.quantity} ({order.type})
        </div>
      ))}
    </div>
  );
}

export default Portfolio;