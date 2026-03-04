import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";

function AllTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get("/transactions/all")
      .then(res => setTransactions(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Transactions</h2>

      {transactions.map(t => (
        <div key={t._id} className="border p-4 mb-2 rounded-lg">
          {t.type} - {t.amount}
        </div>
      ))}
    </div>
  );
}

export default AllTransactions;