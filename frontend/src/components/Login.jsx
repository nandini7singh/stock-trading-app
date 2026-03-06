import { useState } from "react";
import axios from "./axiosInstance";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
  e.preventDefault();

  try {

    const res = await axios.post("/users/login", {
      email,
      password
    });

    console.log("LOGIN RESPONSE:", res.data);

    localStorage.setItem("token", res.data.token);

    alert("Login success ✅");

    navigate("/home");

  } catch (err) {

    console.log(err.response?.data);
    alert("Login failed");

  }
};

  return(
    <form onSubmit={submitHandler}>
      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  );
}

export default Login;