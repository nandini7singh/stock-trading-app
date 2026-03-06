import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";

function History() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="p-10">

      <h2 className="text-2xl font-bold mb-6">Trade History</h2>

      {orders.length === 0 ? (
        <p>No trades yet</p>
      ) : (
        orders.map(order => (
          <div
            key={order._id}
            className="border rounded-lg p-4 mb-3 shadow"
          >

            <h3 className="font-semibold">
              {order.stock?.name}
            </h3>

            <p>Quantity: {order.quantity}</p>

            <p>
              Type:
              <span
                className={
                  order.type === "buy"
                    ? "text-green-600 ml-2"
                    : "text-red-600 ml-2"
                }
              >
                {order.type}
              </span>
            </p>

          </div>
        ))
      )}

    </div>
  );
}

export default History;