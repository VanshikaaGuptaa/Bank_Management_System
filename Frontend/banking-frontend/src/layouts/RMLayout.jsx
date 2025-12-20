// src/layouts/RMLayout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { key: "dashboard", label: "Dashboard", path: "/rm-dashboard" },
  { key: "approve-bm", label: "Approve Bank Managers", path: "/approve-bank-manager" },
  { key: "view-branches", label: "View Branches", path: "/view-branches" },
  { key: "create-branch", label: "Create Branch", path: "/create-branch" },
  { key: "profile", label: "Profile", path: "/profile" },
  { key: "report-account", label: "Account Summary Report", path: "/rm/reports/account-summary" },
  { key: "report-trends", label: "Transaction Trends Report", path: "/rm/reports/transaction-trends" },
  { key: "report-demo", label: "Customer Demographics", path: "/rm/reports/customer-demographics" },
  { key: "report-branch", label: "Branch Performance", path: "/rm/reports/branch-performance" },
  { key: "report-loan", label: "Loan Status Report", path: "/rm/reports/loan-status" },
];

export default function RMLayout({ activeKey, children }) {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("fullName") || "Regional Manager";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen w-screen bg-[#050816] flex items-center justify-center">
      <div className="w-[95vw] h-[90vh] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl shadow-2xl flex overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 bg-black/40 border-r border-slate-800 flex flex-col px-6 py-6">
          <div className="mb-8">
            <p className="text-xs tracking-[0.25em] text-emerald-300 uppercase">
              Regional Manager Panel
            </p>
            <p className="mt-4 text-xs text-slate-400">Logged in as</p>
            <p className="text-xl font-semibold text-slate-100">{fullName}</p>
          </div>

          <nav className="flex-1 space-y-3 overflow-y-auto pr-1">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={
                  "w-full text-left px-4 py-2.5 rounded-2xl text-sm font-medium border transition-all " +
                  (activeKey === item.key
                    ? "bg-emerald-400 text-black border-emerald-500 shadow-lg shadow-emerald-500/30"
                    : "bg-slate-100 text-black border-slate-300 hover:-translate-y-[1px] hover:shadow-md")
                }
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-6 w-full px-4 py-2.5 rounded-2xl text-sm font-semibold border border-rose-500 text-rose-100 bg-rose-600/80 hover:bg-rose-500 transition-colors"
          >
            Logout
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex items-center justify-center px-10 py-8">
          <div className="w-full h-full bg-slate-900/60 border border-slate-800 rounded-3xl p-8 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
