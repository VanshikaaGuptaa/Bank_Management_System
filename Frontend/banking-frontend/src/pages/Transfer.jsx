// src/pages/Transfer.jsx
import React, { useEffect, useState } from "react";
import { getAccountsByCustId, transfer } from "../api/customerApi";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";

export default function Transfer() {
  const custId = Number(localStorage.getItem("custId"));
  const [accounts, setAccounts] = useState([]);
  const [fromAcc, setFromAcc] = useState("");
  const [toAcc, setToAcc] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load accounts for dropdown
  useEffect(() => {
    async function load() {
      try {
        const res = await getAccountsByCustId(custId);
        const list = res.data || [];
        setAccounts(list);
        if (list.length) {
          setFromAcc(list[0].accNo ?? list[0].accountNo ?? "");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load accounts");
      }
    }
    if (custId) load();
  }, [custId]);

  async function handleTransfer(e) {
    e.preventDefault();
    if (!fromAcc || !toAcc || !amount) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await transfer({
        fromAcc,
        toAcc,
        amount: Number(amount),
      });

      alert("Transfer successful!");
      navigate("/customer-dashboard");
    } catch (err) {
      console.error(err);
      alert("Transfer failed");
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
    <CustomerLayout active="transfer">
      <div className="max-w-xl bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-2">Transfer Funds</h2>
        <p className="text-xs text-slate-400 mb-4">
          Move money from one of your accounts to another account by entering
          the recipient&apos;s account number and amount.
        </p>

        <form onSubmit={handleTransfer} className="space-y-4">
          {/* FROM ACCOUNT */}
          <div>
            <label className={labelClass}>From Account</label>
            <select
              value={fromAcc}
              onChange={(e) => setFromAcc(e.target.value)}
              className={inputClass}
            >
              <option value="">-- choose account --</option>
              {accounts.map((a) => {
                const acc = a.accNo ?? a.accountNo ?? "";
                const balance = a.balance ?? a.currentBalance;
                return (
                  <option key={acc} value={acc}>
                    {acc} — ₹ {balance}
                  </option>
                );
              })}
            </select>
          </div>

          {/* TO ACCOUNT */}
          <div>
            <label className={labelClass}>To Account Number</label>
            <input
              type="text"
              placeholder="Recipient account number"
              value={toAcc}
              onChange={(e) => setToAcc(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          {/* AMOUNT */}
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
              {loading ? "Processing..." : "Transfer"}
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