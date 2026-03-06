import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";
import { Link } from "react-router-dom";

function Portfolio() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  }, []);

  return (

    <div className="p-10 bg-gray-50 min-h-screen">

      <h2 className="text-2xl font-bold mb-6">My Portfolio</h2>

      {orders.length === 0 ? (
        <p>No trades yet</p>
      ) : (

        <table className="w-full bg-white shadow rounded-lg">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Stock</th>
              <th>Stock Name</th>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Total Value</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {orders.map(order => {

              const total = order.quantity * (order.stock?.price || 0);

              return (
                <tr key={order._id} className="border-t">

                  <td className="p-3">{order.stock?.symbol}</td>

                  <td>{order.stock?.name}</td>

                  <td>{order.stock?.symbol}</td>

                  <td>{order.quantity}</td>

                  <td>₹{total}</td>

                  <td>
                    <Link to={`/stock/${order.stock?._id}`}>
                      <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                        View Chart
                      </button>
                    </Link>
                  </td>

                </tr>
              );

            })}

          </tbody>

        </table>

      )}

    </div>

  );
}

export default Portfolio;