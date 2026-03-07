import { Link } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar";

const chartData = [
  { value: 20 },
  { value: 40 },
  { value: 30 },
  { value: 80 },
  { value: 60 },
  { value: 90 },
];

function Landing() {

  return (
    <div className="min-h-screen bg-[#0b051a] text-white">

      <Navbar />

      {/* HERO SECTION */}
      <div className="grid md:grid-cols-2 gap-10 px-16 py-20 items-center">
        

        <div>
          <p className="text-green-400 text-sm mb-3">
            • PAPER TRADING PLATFORM
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            Master the Market
            <br />
            With <span className="text-green-400">Zero Risk</span>
          </h1>

          <p className="text-gray-400 mt-6 max-w-xl">
            Practice trading with real-time US market data and virtual
            funds. Build confidence, refine strategies, and grow your
            financial skills without risking a single penny.
          </p>

          <div className="flex gap-4 mt-8">
            <button className="bg-green-500 text-black px-6 py-3 rounded-xl font-semibold">
              Start Trading Free
            </button>

            <button className="border border-gray-700 px-6 py-3 rounded-xl">
              View Demo
            </button>
          </div>

          {/* STATS */}
          <div className="flex gap-12 mt-10 text-sm text-gray-400">
            <div>
              <p className="text-white text-xl font-bold">$100k</p>
              Virtual Funds
            </div>

            <div>
              <p className="text-white text-xl font-bold">50k+</p>
              Active Traders
            </div>

            <div>
              <p className="text-white text-xl font-bold">&lt;100ms</p>
              Order Execution
            </div>
          </div>
        </div>


        {/* HERO CHART */}
        <div className="bg-[#151028] rounded-2xl p-6 shadow-xl">

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

      </div>



      {/* FEATURES */}
      <div className="px-16 py-20">

        <h2 className="text-3xl font-bold text-center mb-2">
          Professional Tools for Aspiring Traders
        </h2>

        <p className="text-gray-400 text-center mb-12">
          Experience the full power of a professional trading environment
        </p>

        <div className="grid md:grid-cols-4 gap-6">

          {[
            {
              title: "Real-time Market Data",
              desc: "Stay informed with live market updates and real-time insights."
            },
            {
              title: "Risk-Free Paper Trading",
              desc: "Test strategies using virtual funds in a real market environment."
            },
            {
              title: "Advanced Portfolio Tracking",
              desc: "Analyze your performance with powerful analytics."
            },
            {
              title: "Comprehensive Charts",
              desc: "Use advanced charting tools to make informed decisions."
            }
          ].map((item, index) => (

            <div
              key={index}
              className="bg-[#151028] p-6 rounded-2xl border border-purple-900"
            >

              <h3 className="font-semibold text-lg mb-3">
                {item.title}
              </h3>

              <p className="text-gray-400 text-sm">
                {item.desc}
              </p>

            </div>

          ))}

        </div>

      </div>



      {/* MONITOR SECTION */}
      <div className="grid md:grid-cols-2 gap-10 px-16 py-20 items-center">

        <div>

          <h2 className="text-3xl font-bold mb-6">
            Monitor Your Progress
          </h2>

          <p className="text-gray-400 mb-8">
            Our simulation engine mirrors real market conditions,
            accounting for slippage, fees, and liquidity.
          </p>

          <div className="space-y-4">

            <div className="bg-[#151028] p-4 rounded-xl">
              Market Sentiment Analysis
            </div>

            <div className="bg-[#151028] p-4 rounded-xl">
              Custom Price Alerts
            </div>

          </div>

        </div>


        {/* CHART */}
        <div className="bg-[#151028] p-6 rounded-2xl">

          <p className="text-gray-400 text-sm">
            Portfolio Value
          </p>

          <h3 className="text-3xl font-bold mb-6">
            $124,500.00
          </h3>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

      </div>



      {/* CTA */}
      <div className="px-16 py-20">

        <div className="bg-green-500 text-black rounded-2xl p-12 text-center">

          <h2 className="text-3xl font-bold mb-4">
            Ready to become a more confident investor?
          </h2>

          <p className="mb-6">
            Join thousands of traders practicing every day.
          </p>

          <div className="flex justify-center gap-4">

            <button className="bg-black text-white px-6 py-3 rounded-xl">
              Start Trading for Free
            </button>

            <button className="border border-black px-6 py-3 rounded-xl">
              Learn More
            </button>

          </div>

        </div>

      </div>



      {/* FOOTER */}
      <div className="border-t border-purple-900 px-16 py-10 text-sm text-gray-400">

        <div className="grid md:grid-cols-4 gap-10">

          <div>
            <h3 className="text-white font-semibold mb-3">
              SB Stocks
            </h3>

            <p>
              The world's most advanced paper trading platform.
            </p>
          </div>

          <div>
            <h3 className="text-white mb-3">Platform</h3>
            <p>Market Data</p>
            <p>Paper Trading</p>
            <p>Portfolio Tracking</p>
          </div>

          <div>
            <h3 className="text-white mb-3">Company</h3>
            <p>About</p>
            <p>Careers</p>
            <p>Contact</p>
          </div>

          <div>
            <h3 className="text-white mb-3">Legal</h3>
            <p>Privacy Policy</p>
            <p>Terms</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Landing;