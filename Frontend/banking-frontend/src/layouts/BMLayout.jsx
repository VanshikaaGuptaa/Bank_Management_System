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
    navigate("/login", { replace: true });
  };

  const navBtnBase =
    "w-full mb-4 rounded-2xl bg-slate-100 text-slate-950 font-semibold py-2.5 px-3 text-sm shadow hover:bg-slate-200 transition";

  const navBtnActive =
    "ring-2 ring-emerald-400 shadow-lg translate-x-1";

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex justify-center items-stretch">
      <div className="w-full max-w-6xl flex bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl md:rounded-3xl overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-slate-950/70 border-r border-slate-800 flex flex-col justify-between py-6 px-4">
          {/* Top brand / title */}
          <div>
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Bank Manager Panel
              </p>
              <h1 className="mt-3 text-3xl font-extrabold leading-none">
                <span className="block text-slate-100">BM</span>
                <span className="block text-emerald-400">Dashboard</span>
              </h1>

              <div className="mt-6 text-xs text-slate-400">
                <p>Logged in as:</p>
                <p className="text-emerald-300 font-semibold">
                  {fullName}
                </p>
              </div>
            </div>

            {/* Nav buttons */}
            <nav className="mt-2">
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

          {/* Bottom logout */}
          <div className="mt-4">
            <button
              onClick={logout}
              className="w-full rounded-2xl bg-slate-100 text-slate-950 font-semibold py-2.5 text-sm shadow hover:bg-slate-200 transition"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}