import { useState } from "react";
import axios from "./axiosInstance";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    const { data } = await axios.post("/users/login", { email, password });

    localStorage.setItem("token", data.token);
    alert("Login Success ✅");
  };

  return (
    <form onSubmit={submitHandler}>
      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e)=>setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  );
}

export default Login;