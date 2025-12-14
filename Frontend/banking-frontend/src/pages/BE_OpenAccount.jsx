// src/pages/BE_OpenAccount.jsx  (or your filename)
import React, { useEffect, useState } from "react";
import axios from "axios";
import BELayout from "../layouts/BELayout";

const API_BASE = "http://localhost:9191";

export default function OpenFirstAccount({ customerId }) {
  const [loading, setLoading] = useState(false);
  const [beId, setBeId] = useState(null);
  const [resolved, setResolved] = useState(false);
  const [error, setError] = useState("");
  const [accType, setAccountType] = useState("Saving");
  const [initialDeposit, setInitialDeposit] = useState("");

  useEffect(() => {
    const findBeId = async () => {
      const userIdRaw = localStorage.getItem("userId");
      const userId = userIdRaw ? Number(userIdRaw) : null;
      if (!userId) {
        setError("User not logged in (userId missing).");
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/bank-employees`);
        const list = res.data || [];

        const row = list.find((r) => {
          const uid = r.userId ?? r.user_id ?? r.userid;
          return Number(uid) === userId;
        });

        if (!row) {
          setError("Bank employee record not found for current user.");
          setResolved(true);
          return;
        }

        const id = row.beId ?? row.be_id ?? row.id;
        setBeId(Number(id));
        setResolved(true);
      } catch (err) {
        console.error("Failed to resolve BE id", err);
        setError("Failed to resolve bank-employee id. See console.");
      } finally {
        setLoading(false);
      }
    };

    findBeId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!resolved) {
      setError("Still resolving bank employee id. Wait a moment.");
      return;
    }
    if (!beId) {
      setError("Bank employee id not found for current user.");
      return;
    }

    let custId = customerId;
    if (!custId) {
      const v = window.prompt("Enter customer id to open first account for:");
      if (!v) return;
      custId = Number(v);
    }

    if (!custId || Number.isNaN(custId)) {
      setError("Invalid customer id.");
      return;
    }

    const dto = {
      accType: accType,
      initialDeposit: initialDeposit ? Number(initialDeposit) : 0,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const url = `${API_BASE}/api/bank-employees/${beId}/customers/${custId}/accounts`;
      const res = await axios.post(url, dto, { headers });

      alert("Account created: " + JSON.stringify(res.data));
    } catch (err) {
      console.error("open-first-account error", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Unknown error";
      setError("Failed to open account: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BELayout active="open-account">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-xl max-w-xl">
        <h2 className="text-2xl font-bold text-slate-50 mb-2">
          Open First Account
        </h2>
        <p className="text-sm text-slate-400 mb-5">
          Create the primary Savings or Current account for an existing
          customer.
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/50 px-4 py-2 text-sm text-rose-200">
            {error}
          </div>
        )}

        <p className="text-xs text-slate-400 mb-3">
          Resolved BE ID:{" "}
          <span className="font-semibold text-emerald-400">
            {resolved ? beId || "not found" : "resolving..."}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <label className="block">
            <span className="text-slate-300">Account type</span>
            <select
              value={accType}
              onChange={(e) => setAccountType(e.target.value)}
              className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/60"
            >
              <option>Saving</option>
              <option>Current</option>
            </select>
          </label>

          <label className="block">
            <span className="text-slate-300">Initial deposit</span>
            <input
              type="number"
              step="0.01"
              value={initialDeposit}
              onChange={(e) => setInitialDeposit(e.target.value)}
              className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/60"
            />
          </label>

          <label className="block">
            <span className="text-slate-300">Customer ID</span>
            <input
              type="number"
              defaultValue={customerId || ""}
              className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/60"
              placeholder="Leave blank to be asked on submit"
            />
          </label>

          <button
            type="submit"
            disabled={loading || !resolved}
            className="mt-2 rounded-2xl bg-slate-100 text-slate-900 px-4 py-2 text-sm font-semibold shadow hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Opening..." : "Open First Account"}
          </button>
        </form>
      </div>
    </BELayout>
  );
}