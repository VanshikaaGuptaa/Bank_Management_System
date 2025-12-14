// src/pages/BM_Dashboard.jsx
import React, { useEffect, useState } from "react";
import BMLayout from "../../layouts/BMLayout";

export default function BM_Dashboard() {
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    setFullName(localStorage.getItem("fullName") || "Bank Manager");
  }, []);

  return (
    <BMLayout active="dashboard">
      <div className="h-full flex flex-col items-center justify-center">
        <div className="max-w-xl w-full bg-slate-900/70 border border-slate-800 rounded-3xl px-8 py-10 shadow-xl text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-emerald-400 mb-2">
            Welcome, {fullName} 👋
          </h2>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed mt-2">
            Use the navigation on the left to approve or disapprove bank
            employees and loans, and to manage your profile. This dashboard is
            dedicated to branch-level operations and approvals.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 py-4 text-xs text-slate-300">
              <p className="font-semibold text-slate-100 mb-1">
                Pending Employees
              </p>
              <p className="text-slate-400">Review new employee requests.</p>
            </div>

            <div className="rounded-2xl bg-slate-950/60 border border-slate-800 py-4 text-xs text-slate-300">
              <p className="font-semibold text-slate-100 mb-1">
                Pending Loans
              </p>
              <p className="text-slate-400">
                Approve or disapprove customer loans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </BMLayout>
  );
}