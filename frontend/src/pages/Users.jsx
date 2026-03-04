import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/users")
      .then(res => setUsers(res.data))
      .catch(() => alert("Admin only"));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Registered Users</h2>

      {users.map(user => (
        <div key={user._id} className="border p-4 mb-2 rounded-lg">
          {user.email} - {user.role}
        </div>
      ))}
    </div>
  );
}

export default Users;