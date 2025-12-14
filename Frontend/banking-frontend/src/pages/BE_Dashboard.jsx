// src/pages/BE_Dashboard.jsx
import React from "react";
import BELayout from "../layouts/BELayout";

export default function BE_Dashboard() {
  const name = localStorage.getItem("fullName") || "Bank Employee";

  return (
    <BELayout active="dashboard">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl px-10 py-8 shadow-2xl shadow-slate-900/50 text-slate-100">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-400 mb-2">
          Employee Console
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Welcome,{" "}
          <span className="bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-500 bg-clip-text text-transparent">
            {name}
          </span>
          👋
        </h1>
        <p className="mt-4 text-slate-300 max-w-2xl">
          Use the navigation on the left to approve customers, open first
          accounts, manage customer profiles, and keep your own profile up to
          date. All your daily operations live here in one secure dashboard.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Today&apos;s focus
            </p>
            <p className="mt-1 font-semibold text-slate-50">
              Approve new customers
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Quick task
            </p>
            <p className="mt-1 font-semibold text-slate-50">
              Open first accounts
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Keep secure
            </p>
            <p className="mt-1 font-semibold text-slate-50">
              Update your profile & password
            </p>
          </div>
        </div>
      </div>
    </BELayout>
  );
}