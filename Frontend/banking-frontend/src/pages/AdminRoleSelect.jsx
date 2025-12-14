import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminRoleSelect() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  function submitRole() {
    if (!role) {
      alert("Please select a role first!");
      return;
    }
    navigate(`/admin-login/${role}`);
  }

  const roles = [
    { id: "rm", label: "Regional Manager", description: "Manage branches in your region." },
    { id: "bm", label: "Branch Manager", description: "Oversee branch operations and staff." },
    { id: "be", label: "Bank Employee", description: "Serve customers and manage accounts." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
        <h1 className="text-3xl font-semibold text-white text-center mb-2">
          Select Admin Role
        </h1>
        <p className="text-slate-300 text-center mb-8 text-sm">
          Choose how you want to log in to the banking dashboard.
        </p>

        <div className="space-y-4 mb-6">
          {roles.map((r) => (
            <label
              key={r.id}
              className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition 
              ${
                role === r.id
                  ? "border-emerald-400 bg-emerald-500/10 shadow-lg"
                  : "border-slate-600/60 hover:border-emerald-300/80 hover:bg-slate-800/50"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r.id}
                checked={role === r.id}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 h-4 w-4 text-emerald-400 border-slate-500 focus:ring-emerald-400"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-lg">{r.label}</span>
                  {role === r.id && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-slate-300 text-sm mt-1">{r.description}</p>
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={submitRole}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 
                     text-slate-900 font-semibold text-base shadow-lg shadow-emerald-500/30
                     disabled:opacity-60 disabled:cursor-not-allowed transition"
          disabled={!role}
        >
          Continue →
        </button>

        <p className="text-xs text-slate-400 text-center mt-4">
          You’ll be redirected to the appropriate admin login page.
        </p>
      </div>
    </div>
  );
}