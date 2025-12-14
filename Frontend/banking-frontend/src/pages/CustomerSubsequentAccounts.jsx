import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAccountsByCustId } from "../api/customerApi";

const API_BASE = "http://localhost:9191";

export default function CustomerSubsequentAccounts() {
  // custId can come from localStorage OR mini-login
  const [custId, setCustId] = useState(
    Number(localStorage.getItem("custId")) || null
  );

  const [primaryAccounts, setPrimaryAccounts] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);

  // mini login fields
  const [loginCustId, setLoginCustId] = useState("");
  const [loginPassword, setLoginPassword] = useState(""); // UI only, not used

  const [form, setForm] = useState({
    accountNo: "",
    type: "FD",
    amount: "",
    interestRate: "",
    startDate: "",
    maturityDate: "",
  });

  // reusable loader
  const loadData = async (cid) => {
    if (!cid) return;
    setLoading(true);
    try {
      // primary accounts
      const accRes = await getAccountsByCustId(cid);
      const accs = accRes.data || [];
      setPrimaryAccounts(accs);

      if (accs.length) {
        const firstNo = accs[0].accNo ?? accs[0].accountNo;
        setForm((f) => ({ ...f, accountNo: firstNo }));
      }

      // FD/RD accounts
      const subRes = await axios.get(`${API_BASE}/api/subsequent/all`);
      setSubs(subRes.data.filter((s) => s.customerId === cid));
    } finally {
      setLoading(false);
    }
  };

  // load if we already have custId (from localStorage)
  useEffect(() => {
    if (custId) loadData(custId);
  }, [custId]);

  const refreshSubs = async () => {
    if (!custId) return;
    const res = await axios.get(`${API_BASE}/api/subsequent/all`);
    setSubs(res.data.filter((s) => s.customerId === custId));
  };

  // mini "login" – just uses customer id to fetch data
  const handleMiniLogin = async (e) => {
    e.preventDefault();
    const cid = Number(loginCustId);
    if (!cid) {
      alert("Enter a valid Customer ID");
      return;
    }
    // optional: here you could call /api/auth/login for real password validation
    setCustId(cid);
    localStorage.setItem("custId", String(cid));
    await loadData(cid);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!custId) {
      alert("Please enter Customer ID above first.");
      return;
    }
    try {
      await axios.post(`${API_BASE}/api/subsequent/create`, {
        customerId: custId,
        accountNo: form.accountNo,
        type: form.type,
        amount: Number(form.amount),
        interestRate: Number(form.interestRate),
        startDate: form.startDate,
        maturityDate: form.maturityDate,
      });

      alert("FD / RD Created");
      setForm((f) => ({
        ...f,
        amount: "",
        interestRate: "",
        startDate: "",
        maturityDate: "",
      }));
      refreshSubs();
    } catch (err) {
      alert(err.response?.data || "Create failed");
    }
  };

  const handleDeposit = async (id) => {
    const amt = Number(prompt("Deposit amount:"));
    if (!amt || amt <= 0) return;

    await axios.post(`${API_BASE}/api/subsequent/deposit/${id}`, null, {
      params: { amount: amt },
    });
    alert("Deposit done");
    refreshSubs();
  };

  const handleWithdraw = async (id) => {
    const amt = Number(prompt("Withdraw amount:"));
    if (!amt || amt <= 0) return;

    await axios.post(`${API_BASE}/api/subsequent/withdraw/${id}`, null, {
      params: { amount: amt },
    });
    alert("Withdraw done");
    refreshSubs();
  };

  const handleSoftDelete = async (id) => {
    if (!window.confirm("Close FD/RD (soft delete)?")) return;

    await axios.put(`${API_BASE}/api/subsequent/soft-delete/${id}`, null, {
      params: { performedBy: custId },
    });
    alert("Soft deleted");
    refreshSubs();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hard delete? Only when balance is 0.")) return;

    await axios.delete(`${API_BASE}/api/subsequent/${id}`);
    alert("Deleted");
    refreshSubs();
  };

  return (
    <div
      className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-6"
      style={{ overflow: "auto" }}
    >
      {/* Mini customer login */}
      <div className="w-full max-w-5xl mb-6">
        <form
          onSubmit={handleMiniLogin}
          className="flex flex-col md:flex-row items-center gap-3 bg-slate-900 rounded-2xl border border-slate-800 px-4 py-3"
        >
          <span className="text-sm text-slate-300 mr-auto">
            Quick Customer Login (for FD/RD only)
          </span>

          <input
            type="number"
            placeholder="Customer ID"
            value={loginCustId}
            onChange={(e) => setLoginCustId(e.target.value)}
            className="bg-slate-800 rounded-xl px-3 py-2 text-sm outline-none border border-slate-700"
          />

          <input
            type="password"
            placeholder="Password (optional UI)"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="bg-slate-800 rounded-xl px-3 py-2 text-sm outline-none border border-slate-700"
          />

          <button
            type="submit"
            className="bg-emerald-400 text-slate-900 font-semibold px-4 py-2 rounded-xl text-sm"
          >
            Fetch Accounts
          </button>
        </form>
      </div>

      {/* Main FD/RD section */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        {/* Left Form */}
        <div className="w-full md:w-1/3 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h2 className="text-xl text-emerald-400 font-semibold mb-4">
            Open FD / RD
          </h2>

          {!custId && (
            <p className="text-xs text-amber-300 mb-3">
              Enter a Customer ID above and click <b>Fetch Accounts</b> first.
            </p>
          )}

          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="text-xs">Primary Account</label>
              <select
                value={form.accountNo}
                onChange={(e) =>
                  setForm({
                    ...form,
                    accountNo: e.target.value,
                  })
                }
                className="w-full bg-slate-800 rounded-xl p-2 mt-1"
                disabled={!primaryAccounts.length}
              >
                {primaryAccounts.map((a, idx) => {
                  const no = a.accNo ?? a.accountNo;
                  const bal = a.balance ?? a.currentBalance;
                  return (
                    <option key={idx} value={no}>
                      {no} — ₹{bal}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-xs">Type</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                  })
                }
                className="w-full bg-slate-800 rounded-xl p-2 mt-1"
              >
                <option value="FD">FD</option>
                <option value="RD">RD</option>
              </select>
            </div>

            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) =>
                setForm({
                  ...form,
                  amount: e.target.value,
                })
              }
              className="w-full bg-slate-800 rounded-xl p-2"
            />

            <input
              type="number"
              placeholder="Interest Rate (%)"
              value={form.interestRate}
              onChange={(e) =>
                setForm({
                  ...form,
                  interestRate: e.target.value,
                })
              }
              className="w-full bg-slate-800 rounded-xl p-2"
            />

            <input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  startDate: e.target.value,
                })
              }
              className="w-full bg-slate-800 rounded-xl p-2"
            />

            <input
              type="date"
              value={form.maturityDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  maturityDate: e.target.value,
                })
              }
              className="w-full bg-slate-800 rounded-xl p-2"
            />

            <button
              type="submit"
              disabled={!custId}
              className="w-full bg-emerald-400 text-slate-900 font-semibold py-2 rounded-xl mt-2 disabled:opacity-50"
            >
              Create FD / RD
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="flex-1 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h2 className="text-xl text-emerald-400 font-semibold mb-4">
            Your FD / RD Accounts
          </h2>

          {loading && <p className="text-sm text-slate-400">Loading…</p>}

          {!loading && (!custId || subs.length === 0) && (
            <p className="text-slate-400 text-sm">
              {custId
                ? "You do not have any FD/RD accounts yet."
                : "Enter a Customer ID above to see FD/RD accounts."}
            </p>
          )}

          {!loading && custId && subs.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400">
                  <th>ID</th>
                  <th>Acc No</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Rate</th>
                  <th>Start</th>
                  <th>Maturity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {subs.map((s) => (
                  <tr key={s.subAccId} className="border-t border-slate-700">
                    <td>{s.subAccId}</td>
                    <td>{s.accountNo}</td>
                    <td>{s.type}</td>
                    <td>₹{s.amount}</td>
                    <td>{s.interestRate}%</td>
                    <td>{s.startDate}</td>
                    <td>{s.maturityDate}</td>
                    <td>{s.status}</td>
                    <td className="space-x-2">
                      <button
                        onClick={() => handleDeposit(s.subAccId)}
                        className="bg-emerald-400 text-black px-2 py-1 rounded"
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => handleWithdraw(s.subAccId)}
                        className="bg-amber-300 text-black px-2 py-1 rounded"
                      >
                        Withdraw
                      </button>
                      <button
                        onClick={() => handleSoftDelete(s.subAccId)}
                        className="bg-sky-400 text-black px-2 py-1 rounded"
                      >
                        Soft Delete
                      </button>
                      <button
                        onClick={() => handleDelete(s.subAccId)}
                        className="bg-rose-500 text-white px-2 py-1 rounded"
                      >
                        Hard Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}