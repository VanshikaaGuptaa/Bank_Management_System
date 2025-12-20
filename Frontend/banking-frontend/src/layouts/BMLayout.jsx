// src/layouts/BMLayout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function BMLayout({ active = "dashboard", children }) {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("fullName") || "Bank Manager";

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("custId");
    localStorage.removeItem("tempUsername");
    navigate("/", { replace: true });
  };

  const navBtnBase =
    "w-full mb-3 rounded-xl bg-slate-100 text-slate-950 font-semibold py-2.5 px-3 text-sm " +
    "shadow hover:bg-slate-200 transition";

  const navBtnActive = "ring-2 ring-emerald-400 shadow-lg translate-x-1";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950/80 border-r border-slate-800 flex flex-col justify-between py-6 px-5">
        
        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Bank Manager Panel
          </p>

          <h1 className="mt-3 text-3xl font-extrabold leading-none">
            <span className="block text-slate-100">BM</span>
            <span className="block text-emerald-400">Dashboard</span>
          </h1>

          <div className="mt-6 text-xs text-slate-400">
            <p>Logged in as</p>
            <p className="text-emerald-300 font-semibold">{fullName}</p>
          </div>

          {/* Navigation */}
          <nav className="mt-8">
            <button
              onClick={() => navigate("/bm-dashboard")}
              className={`${navBtnBase} ${
                active === "dashboard" ? navBtnActive : ""
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => navigate("/bm/approve-employees")}
              className={`${navBtnBase} ${
                active === "employees" ? navBtnActive : ""
              }`}
            >
              Approve Employees
            </button>

            <button
              onClick={() => navigate("/bm/approve-loans")}
              className={`${navBtnBase} ${
                active === "loans" ? navBtnActive : ""
              }`}
            >
              Approve Loans
            </button>

            <button
              onClick={() => navigate("/bm/profile")}
              className={`${navBtnBase} ${
                active === "profile" ? navBtnActive : ""
              }`}
            >
              Profile
            </button>
          </nav>
        </div>

        {/* Logout */}
        <div>
          <button
            onClick={logout}
            className="w-full rounded-xl bg-rose-500 text-white font-semibold py-2.5 text-sm
                       hover:bg-rose-400 transition focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
