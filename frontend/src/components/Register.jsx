import { useState } from "react";
import axios from "./axiosInstance";
import { useNavigate, Link } from "react-router-dom";

function Register() {

  const [form,setForm] = useState({});
  const navigate = useNavigate();

  const submitHandler = async (e) => {

    e.preventDefault();

    await axios.post("/users/register",form);

    alert("Registered Successfully ✅");

    navigate("/login");
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0a0014] to-black">

      <div className="w-[420px] bg-[#12061f] text-white rounded-xl p-8 shadow-2xl">

        {/* Tabs */}

        <div className="flex justify-between mb-6 border-b border-gray-700">

          <Link to="/login" className="pb-2 text-gray-400">
            Sign In
          </Link>

          <button className="pb-2 border-b-2 border-green-400 text-green-400">
            Sign Up
          </button>

        </div>

        <h2 className="text-2xl font-semibold mb-2 text-center">
          Create Account
        </h2>

        <p className="text-gray-400 text-sm text-center mb-6">
          Start managing your investments
        </p>

        <form onSubmit={submitHandler} className="space-y-4">

          <input
            placeholder="Name"
            className="w-full p-3 rounded-md bg-[#1c0c2d] border border-gray-700 focus:outline-none focus:border-purple-500"
            onChange={(e)=>setForm({...form,name:e.target.value})}
          />

          <input
            placeholder="Email"
            className="w-full p-3 rounded-md bg-[#1c0c2d] border border-gray-700 focus:outline-none focus:border-purple-500"
            onChange={(e)=>setForm({...form,email:e.target.value})}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-md bg-[#1c0c2d] border border-gray-700 focus:outline-none focus:border-purple-500"
            onChange={(e)=>setForm({...form,password:e.target.value})}
          />

          <button className="w-full py-3 rounded-md bg-purple-700 hover:bg-purple-600 transition">
            Create Account →
          </button>

        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          By signing up you agree to Terms & Privacy
        </p>

      </div>

    </div>

  );
}

export default Register;