// src/pages/CloseAccount.jsx
import React, { useEffect, useState } from "react";
import { closeAccount, getAccountsByCustId } from "../api/customerApi";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";

export default function CloseAccount() {
  const custId = Number(localStorage.getItem("custId"));
  const [accounts, setAccounts] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await getAccountsByCustId(custId);
        setAccounts(res.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load accounts");
      }
    }
    if (custId) load();
  }, [custId]);

  async function handleClose(e) {
    e.preventDefault();
    if (!selectedAcc) {
      alert("Select an account first");
      return;
    }

    const ok = window.confirm(
      "Are you sure you want to close this account? This action cannot be undone."
    );
    if (!ok) return;

    try {
      setLoading(true);
      await closeAccount({ accNo: selectedAcc, custId });
      alert("Account closed successfully!");
      navigate("/customer-dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Unable to close account");
    } finally {
      setLoading(false);
    }
  }

  const labelClass = "block text-xs text-slate-300 mb-1";
  const inputClass =
    "w-full bg-slate-100 text-slate-900 px-3 py-2 rounded-2xl text-sm " +
    "border border-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400";
  const buttonDanger =
    "px-5 py-2 rounded-2xl bg-red-500 text-slate-50 text-sm font-semibold " +
    "shadow hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-400";
  const buttonWhite =
    "px-4 py-2 rounded-2xl bg-slate-100 text-slate-900 text-sm font-medium " +
    "shadow hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400";

  return (
    <CustomerLayout active="close">
      <div className="max-w-xl bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-2">Close Account</h2>
        <p className="text-xs text-slate-400 mb-4">
          You can close an account only after clearing all dues and withdrawing
          the remaining balance. Closed accounts cannot be reactivated.
        </p>

        <form onSubmit={handleClose} className="space-y-4">
          <div>
            <label className={labelClass}>Select Account</label>
            <select
              value={selectedAcc}
              onChange={(e) => setSelectedAcc(e.target.value)}
              className={inputClass}
            >
              <option value="">-- choose account --</option>
              {accounts.map((a) => {
                const acc = a.accNo ?? a.accountNo ?? a.acc_no;
                const balance = a.balance ?? a.currentBalance ?? 0;
                const type = a.accType ?? a.accountType ?? "Account";
                return (
                  <option key={acc} value={acc}>
                    {acc} — {type} — ₹{balance}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading} className={buttonDanger}>
              {loading ? "Closing..." : "Close Account"}
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