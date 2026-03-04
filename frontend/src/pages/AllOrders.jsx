import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";

function AllOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/orders")
      .then(res => setOrders(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>

      {orders.map(order => (
        <div key={order._id} className="border p-4 mb-2 rounded-lg">
          {order.stock?.name} - {order.quantity} ({order.type})
        </div>
      ))}
    </div>
  );
}

export default AllOrders;