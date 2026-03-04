import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";

function History() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get("/transactions").then(res => setTransactions(res.data));
  }, []);

  return (
    <div>
      <h2>Transaction History</h2>
      {transactions.map(t => (
        <div key={t._id}>
          {t.type} - {t.amount}
        </div>
      ))}
    </div>
  );
}

export default History;