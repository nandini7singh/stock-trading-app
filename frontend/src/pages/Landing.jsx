import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 items-center px-10">

        {/* Left Section */}
        <div>
          <h1 className="text-5xl font-bold mb-4">SB Stock Trading</h1>

          <p className="mb-6 text-lg">
            Experience seamless stock market trading with our user-friendly
            platform, offering real-time data, advanced analytics and fast
            execution.
          </p>

          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-black px-6 py-3 rounded-lg shadow"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Right Section (Image) */}
        <div className="hidden md:block">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="stock trading"
            className="w-full"
          />
        </div>

      </div>

    </div>
  );
}

export default Landing;