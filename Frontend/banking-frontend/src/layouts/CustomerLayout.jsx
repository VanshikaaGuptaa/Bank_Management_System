// src/layouts/CustomerLayout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const MENU = [
  { key: "dashboard", label: "Dashboard", route: "/customer-dashboard" },
  { key: "profile", label: "Profile", route: "/customer/profile" },
  // { key: "accounts", label: "View Accounts", route: "/customer/accounts" },
  { key: "mini", label: "Mini Statement", route: "/customer/mini-statement" },
  { key: "deposit", label: "Deposit", route: "/customer/deposit" },
  { key: "withdraw", label: "Withdraw", route: "/customer/withdraw" },
  { key: "transfer", label: "Transfer", route: "/customer/transfer" },
  { key: "close", label: "Close Account", route: "/customer/close-account" },
  { key: "loans", label: "My Loans / EMI", route: "/customer/loans" },
  { key: "apply-loan", label: "Apply Loan", route: "/customer/apply-loan" },
];

export default function CustomerLayout({ active = "dashboard", children }) {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("fullName") || "Customer";

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const buttonBase =
    "w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition " +
    "bg-slate-100 text-slate-900 hover:-translate-y-0.5 hover:shadow-lg " +
    "focus:outline-none focus:ring-2 focus:ring-emerald-400";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-950/80 border-r border-slate-800 flex flex-col p-6">
        <div>
          <p className="text-xs tracking-[0.25em] text-emerald-400 uppercase mb-2 text-center">
            Customer Panel
          </p>
          <p className="text-xs text-slate-400 text-center mb-1">
            Logged in as
          </p>
          <p className="text-lg font-semibold text-center text-slate-50 mb-8">
            {fullName}
          </p>

          <div className="space-y-3">
            {MENU.map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item.route)}
                className={
                  buttonBase +
                  (active === item.key
                    ? " ring-2 ring-emerald-400/80"
                    : "")
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="mt-auto pt-6">
          <button
            onClick={logout}
            className="w-full px-4 py-2 rounded-xl bg-rose-500 text-white font-semibold shadow hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 text-slate-100">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
          Welcome back,{" "}
          <span className="text-emerald-400">{fullName}</span>
        </h1>

        <p className="text-sm text-slate-400 mb-8 max-w-2xl">
          Manage your accounts, transactions, loans and profile securely from
          one unified dashboard.
        </p>

        {/* Page Content */}
        <div>{children}</div>
      </main>
    </div>
  );
}
