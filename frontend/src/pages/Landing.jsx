import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <h1 className="text-5xl font-bold mb-6">SB Stocks</h1>
      <p className="mb-8 text-lg">Virtual Stock Trading Platform</p>

      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-black px-6 py-2 rounded-lg"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default Landing;