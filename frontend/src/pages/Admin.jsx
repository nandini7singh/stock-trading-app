import { Link } from "react-router-dom";

function Admin() {
  return (
    <div style={{ padding: "30px" }}>
      <h2>Admin Dashboard</h2>

      <div style={{ marginTop: "20px", display: "flex", gap: "20px" }}>

        <Link to="/users">
          <button>View Users</button>
        </Link>

        <Link to="/orders">
          <button>View Orders</button>
        </Link>

        <Link to="/transactions">
          <button>View Transactions</button>
        </Link>

        <Link to="/admin-stocks">
          <button>Manage Stocks</button>
        </Link>

      </div>
    </div>
  );
}

export default Admin;