import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("/users/profile")
      .then(res => setUser(res.data))
      .catch(() => alert("Login required"));
  }, []);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <p>Name: {user.id}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

export default Profile;