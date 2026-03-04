import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";

function Admin() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get("/transactions/all")
      .then(res => setTransactions(res.data));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {transactions.map(t => (
        <div key={t._id}>
          {t.type} - {t.amount}
        </div>
      ))}
    </div>
  );
}

export default Admin;