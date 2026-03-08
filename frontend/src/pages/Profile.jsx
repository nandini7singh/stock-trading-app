import { useEffect, useState } from "react";
import axios from "../components/axiosInstance";
import Sidebar from "../components/Sidebar";

function Profile() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("Settings");

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

    <div style={{display:"flex", minHeight:"100vh", background:"#0d0d14", color:"#e8e8f0"}}>

      {/* Sidebar */}
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      {/* Page Content */}
      <div style={{padding:"40px", width:"100%"}}>

        <h2 style={{fontSize:"26px", marginBottom:"20px"}}>
          My Account
        </h2>

        <div
          style={{
            background:"#181826",
            padding:"30px",
            borderRadius:"14px",
            width:"420px",
            border:"1px solid #252538"
          }}
        >

          <p style={{marginBottom:"12px"}}>
            <b>Name:</b> {user?.name}
          </p>

          <p style={{marginBottom:"12px"}}>
            <b>Email:</b> {user?.email}
          </p>

          <p style={{fontSize:"18px", marginTop:"10px"}}>
            <b>Balance:</b> ₹{user?.balance || 5000}
          </p>

        </div>

      </div>

    </div>

  );
}

export default Profile;