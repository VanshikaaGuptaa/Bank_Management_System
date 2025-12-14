import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-900 flex items-center justify-center px-4">
      {/* Main card */}
      <div className="max-w-6xl w-full bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 md:p-10 lg:p-12 flex flex-col lg:flex-row gap-10 text-slate-100">
        {/* Left: Hero & actions */}
        <div className="flex-1 flex flex-col justify-between gap-8">
          <div>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-300 px-3 py-1 text-xs font-medium border border-emerald-400/30">
              Secure • Modern • Reliable
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Welcome to <span className="text-indigo-300">Banking System</span>
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl">
              Manage accounts, approvals and transactions from a single,
              secure dashboard. Designed for customers, employees and admins.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition"
                onClick={() => navigate("/login?role=CUSTOMER")}
              >
                Login as Customer
              </button>

              <button
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition"
                onClick={() => navigate("/admin-role")}
              >
                Login as Admin
              </button>

              <button
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition"
                onClick={() => navigate("/register")}
              >
                Register as new User
              </button>
              <button
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition"
                onClick={() => navigate("/customer/fd-rd")}
              >
                Open RD/FD
              </button>
            </div>
          </div>

          {/* Small highlights row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm mt-4">
            
            <div className="bg-slate-800/70 rounded-2xl p-3 border border-slate-700/70">
              <p className="text-slate-400">Avg. Approval Time</p>
              <p className="mt-1 font-semibold text-slate-100">2 min</p>
            </div>
            <div className="bg-slate-800/70 rounded-2xl p-3 border border-slate-700/70">
              <p className="text-slate-400">24/7 Monitoring</p>
              <p className="mt-1 font-semibold text-slate-100">Real-time</p>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}