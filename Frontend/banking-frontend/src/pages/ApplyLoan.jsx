// src/pages/ApplyLoan.jsx
import React, { useState } from "react";
import { applyLoan } from "../api/customerApi";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";

export default function ApplyLoan() {
  const custId = Number(localStorage.getItem("custId"));
  const [loanType, setLoanType] = useState("");
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleApply(e) {
    e.preventDefault();
    if (!loanType || !amount || !tenure) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const dto = {
        custId,
        loanType,
        amount: Number(amount),
        tenureMonths: Number(tenure),
      };

      await applyLoan(dto);
      alert("Loan application submitted successfully!");
      navigate("/customer-dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Loan apply failed");
    } finally {
      setLoading(false);
    }
  }

  const labelClass = "block text-xs text-slate-300 mb-1";
  const inputClass =
    "w-full bg-slate-100 text-slate-900 px-3 py-2 rounded-2xl text-sm " +
    "border border-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400";
  const buttonPrimary =
    "px-5 py-2 rounded-2xl bg-emerald-500 text-slate-50 text-sm font-semibold " +
    "shadow hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400";
  const buttonWhite =
    "px-4 py-2 rounded-2xl bg-slate-100 text-slate-900 text-sm font-medium " +
    "shadow hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400";

  return (
    <CustomerLayout active="loans">
      <div className="max-w-xl bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-2">Apply for Loan</h2>
        <p className="text-xs text-slate-400 mb-4">
          Submit a loan request with your preferred loan type, amount, and
          tenure. Your request will be reviewed by the bank manager.
        </p>

        <form onSubmit={handleApply} className="space-y-4">
          <div>
            <label className={labelClass}>Loan Type</label>
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              className={inputClass}
            >
              <option value="">-- select loan type --</option>
              <option value="home">Home Loan</option>
              <option value="personal">Personal Loan</option>
              <option value="car">Car Loan</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Amount (₹)</label>
            <input
              type="number"
              min="1000"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter loan amount"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Tenure (months)</label>
            <input
              type="number"
              min="6"
              step="1"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder="e.g. 12, 24, 36"
              className={inputClass}
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading} className={buttonPrimary}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/customer-dashboard")}
              className={buttonWhite}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
}