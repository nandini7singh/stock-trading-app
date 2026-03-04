import { useState } from "react";
import axios from "./axiosInstance";

function Register() {
  const [form, setForm] = useState({});

  const submitHandler = async (e) => {
    e.preventDefault();
    await axios.post("/users/register", form);
    alert("Registered Successfully ✅");
  };

  return (
    <form onSubmit={submitHandler}>
      <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})} />
      <input placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})} />
      <input type="password" placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})} />
      <button>Register</button>
    </form>
  );
}

export default Register;