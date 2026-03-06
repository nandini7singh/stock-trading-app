import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";

function Profile() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    axios.get("/users/profile")
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.log(err.response?.data);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);

  if (loading) return <p style={{padding:"30px"}}>Loading...</p>;

  if (!user) return <p style={{padding:"30px"}}>No user data</p>;

  return (
    <div style={{padding:"30px"}}>

      <h2>My Account</h2>

      <div
        style={{
          background:"#f5f5f5",
          padding:"20px",
          borderRadius:"10px",
          width:"400px",
          marginTop:"20px"
        }}
      >

        <p><b>Name:</b> {user?.name}</p>

        <p><b>Email:</b> {user?.email}</p>

        <p style={{fontSize:"18px", marginTop:"10px"}}>
          <b>Balance:</b> ₹{user?.balance || 5000}
        </p>

      </div>

    </div>
  );
}

export default Profile;