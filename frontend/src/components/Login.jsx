import { useState } from "react";
import axios from "./axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();

const submitHandler = async (e) => {
  e.preventDefault();

  try {

    const res = await axios.post("/users/login",{
      email,
      password
    });

    const token = res.data.token;

    // save token
    localStorage.setItem("token", token);

    const decoded = jwtDecode(token);

    alert("Login Success ✅");

    if(decoded.role === "admin"){
      navigate("/admin");
    } else {
      navigate("/home");   // 👈 this redirects to homepage
    }

  } catch (err) {
    alert("Login Failed ❌");
  }
};

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0a0014] to-black">

      <div className="w-[420px] bg-[#12061f] text-white rounded-xl p-8 shadow-2xl">

        {/* Tabs */}
        <div className="flex justify-between mb-6 border-b border-gray-700">
          <button className="pb-2 border-b-2 border-green-400 text-green-400">
            Sign In
          </button>

          <Link to="/register" className="pb-2 text-gray-400">
            Sign Up
          </Link>
        </div>

        <h2 className="text-2xl font-semibold mb-2 text-center">
          Welcome Back
        </h2>

        <p className="text-gray-400 text-sm text-center mb-6">
          Securely access your investment portfolio
        </p>

        <form onSubmit={submitHandler} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-400">
              Email Address
            </label>

            <input
              type="email"
              placeholder="name@example.com"
              className="w-full mt-1 p-3 rounded-md bg-[#1c0c2d] border border-gray-700 focus:outline-none focus:border-purple-500"
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          {/* Password */}

          <div>
            <label className="text-sm text-gray-400">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              className="w-full mt-1 p-3 rounded-md bg-[#1c0c2d] border border-gray-700 focus:outline-none focus:border-purple-500"
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          {/* Remember */}

          <div className="flex justify-between text-sm text-gray-400">
            <label>
              <input type="checkbox" className="mr-2"/>
              Remember me
            </label>

            <span className="text-green-400 cursor-pointer">
              Forgot?
            </span>
          </div>

          {/* Button */}

          <button className="w-full py-3 mt-2 rounded-md bg-purple-700 hover:bg-purple-600 transition">
            Sign In to Dashboard →
          </button>

        </form>

        <div className="text-center text-xs text-gray-500 mt-6">
          🔒 Encrypted • 🛡 Secure Login
        </div>

      </div>

    </div>

  );
}

export default Login;