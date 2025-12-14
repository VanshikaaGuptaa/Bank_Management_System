// src/layouts/BELayout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function BELayout({ active = "dashboard", children }) {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("fullName") || "Bank Employee";

  const navItems = [
    { id: "dashboard", label: "Dashboard", path: "/be-dashboard" },
    { id: "profile", label: "Profile", path: "/be/profile" },
    { id: "approve-customers", label: "Approve Customers", path: "/be/approve-customers" },
    { id: "open-account", label: "Open First Account", path: "/be/open-account" },
  ];

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("custId");
  }

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col">
        <div className="px-5 py-4 border-b border-slate-800">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
            Bank Employee Panel
          </p>
          <p className="mt-2 text-sm text-slate-400">Logged in as</p>
          <p className="font-semibold text-lg text-slate-50 truncate">
            {fullName}
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={
                  "w-full text-left rounded-2xl px-4 py-2.5 text-sm font-medium transition " +
                  (isActive
                    ? "bg-slate-100 text-slate-900 shadow-lg shadow-emerald-500/20"
                    : "bg-slate-800/80 text-slate-900 hover:bg-slate-700/80")
                }
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 pb-4 pt-1 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full rounded-2xl bg-rose-500 text-black py-2 text-sm font-semibold hover:bg-rose-600 transition shadow-md shadow-rose-500/30"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}