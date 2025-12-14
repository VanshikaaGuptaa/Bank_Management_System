// src/pages/ApproveLoan.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import BMLayout from "../layouts/BMLayout";

const API_BASE = "http://localhost:9191";

export default function ApproveLoan() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE}/api/bank-managers/pending-loans`
      );
      setLoans(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load loans");
    } finally {
      setLoading(false);
    }
  }

  async function action(tempLoanId, approve = true) {
    const userId = Number(localStorage.getItem("userId"));
    try {
      const path = `${API_BASE}/api/bank-managers/${
        approve ? "approve-loan" : "disapprove-loan"
      }/${tempLoanId}`;
      await axios.post(path, null, { params: { userId } });
      alert(`${approve ? "Approved" : "Disapproved"} successfully`);
      load();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  }

  return (
    <BMLayout active="loans">
      <h1 className="text-3xl font-bold text-emerald-400 mb-6">
        Pending Loans
      </h1>

      {loading && <p className="text-slate-300">Loading loans…</p>}

      {!loading && loans.length === 0 && (
        <p className="text-slate-300">No pending loans.</p>
      )}

      {!loading && loans.length > 0 && (
        <div className="space-y-4">
          {loans.map((l) => (
            <div
              key={l.tempLoanId}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow"
            >
              <div>
                <p className="text-sm text-slate-400">
                  Loan ID:{" "}
                  <span className="text-slate-100 font-semibold">
                    {l.tempLoanId}
                  </span>
                </p>
                <p className="text-sm text-slate-300">
                  Amount:{" "}
                  <span className="font-semibold text-emerald-300">
                    {l.amount}
                  </span>{" "}
                  • Type:{" "}
                  <span className="font-semibold text-slate-100">
                    {l.loanType}
                  </span>
                </p>
                {l.custId && (
                  <p className="text-xs text-slate-400 mt-1">
                    Customer ID: {l.custId}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => action(l.tempLoanId, true)}
                  className="rounded-xl bg-slate-100 text-slate-950 px-4 py-1.5 text-xs font-semibold shadow hover:bg-slate-200"
                >
                  Approve
                </button>
                <button
                  onClick={() => action(l.tempLoanId, false)}
                  className="rounded-xl bg-slate-100 text-slate-950 px-4 py-1.5 text-xs font-semibold shadow hover:bg-slate-200"
                >
                  Disapprove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </BMLayout>
  );
}