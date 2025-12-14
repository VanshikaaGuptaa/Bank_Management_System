// src/pages/Deposit.jsx
import React, { useState, useEffect } from "react";
import { getAccountsByCustId, deposit } from "../api/customerApi";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";

export default function Deposit() {
  const custId = Number(localStorage.getItem("custId"));
  const [accounts, setAccounts] = useState([]);
  const [accNo, setAccNo] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const r = await getAccountsByCustId(custId);
        const list = r.data || [];
        setAccounts(list);
        if (list.length) {
          const firstNo = list[0].accountNo ?? list[0].accNo;
          setAccNo(firstNo);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load accounts");
      }
    }
    if (custId) load();
  }, [custId]);

  async function handleDeposit(e) {
    e.preventDefault();
    if (!accNo || !amount) {
      alert("Please select an account and enter amount");
      return;
    }

    try {
      setLoading(true);
      const res = await deposit({ accNo, amount: Number(amount) });
      alert("Deposit successful. New balance: " + res.data);
      navigate("/customer-dashboard");
    } catch (err) {
      console.error(err);
      alert("Deposit failed");
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
    <CustomerLayout active="deposit">
      <div className="max-w-xl bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-2">Deposit Amount</h2>
        <p className="text-xs text-slate-400 mb-4">
          Choose an account and enter the amount you want to deposit. Deposits
          are processed instantly.
        </p>

        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className={labelClass}>Account</label>
            <select
              value={accNo}
              onChange={(e) => setAccNo(e.target.value)}
              className={inputClass}
            >
              <option value="">-- choose account --</option>
              {accounts.map((a) => {
                const number = a.accountNo ?? a.accNo;
                const balance = a.balance ?? a.currentBalance;
                return (
                  <option key={number} value={number}>
                    {number} — ₹ {balance}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className={labelClass}>Amount</label>
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading} className={buttonPrimary}>
              {loading ? "Processing..." : "Submit Deposit"}
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