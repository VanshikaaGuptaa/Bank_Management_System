// src/layouts/CustomerLayout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const MENU = [
  { key: "dashboard", label: "Dashboard", route: "/customer-dashboard" },
  { key: "profile", label: "Profile", route: "/customer/profile" },
  { key: "accounts", label: "View Accounts", route: "/customer/accounts" },
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

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    localStorage.removeItem("custId");
  }

  const handleClick = (item) => {
    if (item.key === "logout") return; // we handle logout button separately
    navigate(item.route);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const buttonBase =
    "w-full text-left px-4 py-2 rounded-2xl bg-slate-100 text-slate-900 " +
    "text-sm font-medium shadow transition hover:-translate-y-0.5 " +
    "hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400";

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center py-6">
      <div className="w-11/12 max-w-6xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex overflow-hidden">
        {/* Left side: navigation */}
        <aside className="w-72 bg-slate-950/60 border-r border-slate-800 flex flex-col justify-between p-6">
          <div>
            <p className="text-xs tracking-[0.25em] text-emerald-400/80 uppercase mb-2 text-center">
              Customer Panel
            </p>
            <p className="text-xs text-slate-400 text-center mb-1">
              Logged in as
            </p>
            <p className="text-lg font-semibold text-center text-slate-50 mb-6">
              {fullName}
            </p>

            <div className="space-y-3">
              {MENU.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleClick(item)}
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

          <div className="pt-4">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 rounded-2xl bg-rose-500/90 text-slate-50 text-sm font-semibold shadow hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Right side: main content */}
        <main className="flex-1 p-8 text-slate-100 overflow-y-auto max-h-[80vh]">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Welcome back,{" "}
            <span className="text-emerald-400">{fullName}</span>
          </h1>
          <p className="text-sm text-slate-400 mb-6 max-w-xl">
            Use the navigation on the left to manage your accounts, view
            statements, apply for loans and update your profile – all from one
            secure dashboard.
          </p>

          <div className="mt-4">{children}</div>
        </main>
      </div>
    </div>
  );
}


