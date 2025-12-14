// src/pages/RM_Dashboard.jsx
import React from "react";
import RMLayout from "../layouts/RMLayout";

export default function RM_Dashboard() {
  const fullName = localStorage.getItem("fullName") || "Regional Manager";

  return (
    <RMLayout activeKey="dashboard">
      <div className="flex h-full items-center justify-center">
        <div className="max-w-2xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            RM Dashboard
          </p>
          <h1 className="mt-4 text-4xl font-bold text-slate-50">
            Welcome, <span className="text-emerald-400">{fullName}</span> 👋
          </h1>
          <p className="mt-4 text-slate-300 leading-relaxed">
            Use the navigation on the left to manage bank managers, review
            branches, create new branches and view detailed reports on accounts,
            transactions, customers, loans, and branch performance.
          </p>
        </div>
      </div>
    </RMLayout>
  );
}