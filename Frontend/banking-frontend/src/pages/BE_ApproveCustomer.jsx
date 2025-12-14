// src/pages/BE_ApproveCustomers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import BELayout from "../layouts/BELayout";

const API_BASE = "http://localhost:9191";

const thBase =
  "border border-slate-700 bg-slate-900/70 px-3 py-2 text-left text-sm text-slate-200";
const tdBase =
  "border border-slate-700 px-3 py-2 text-sm text-slate-100";

export default function BE_ApproveCustomers() {
  const userId = Number(localStorage.getItem("userId"));

  const [beId, setBeId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const resolveBeIdAndLoad = async () => {
      if (!userId) return;

      try {
        const resAll = await axios.get(`${API_BASE}/api/bank-employees`);
        const list = resAll.data || [];

        const row = list.find((r) => {
          const uid = r.userId ?? r.user_id ?? r.userid;
          return uid === userId;
        });

        if (!row) {
          alert("Bank Employee not found for current user");
          return;
        }

        const id = row.beId ?? row.be_id ?? row.id;
        setBeId(id);
        await loadCustomers(id);
      } catch (err) {
        console.error(err);
        alert("Failed to resolve Bank Employee ID");
      }
    };

    resolveBeIdAndLoad();
  }, [userId]);

  async function loadCustomers(idParam) {
    const id = idParam ?? beId;
    if (!id) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE}/api/bank-employees/${id}/temp-customers`
      );
      setCustomers(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(cust, approve = true) {
    if (!beId) {
      alert("Bank Employee not resolved yet");
      return;
    }

    const ok = window.confirm(
      `Are you sure you want to ${
        approve ? "APPROVE" : "DISAPPROVE"
      } this customer?`
    );
    if (!ok) return;

    try {
      const path = approve
        ? `${API_BASE}/api/bank-employees/temp-customers/${cust.tempCustId}/approve`
        : `${API_BASE}/api/bank-employees/temp-customers/${cust.tempCustId}/disapprove`;

      await axios.post(path);
      alert(approve ? "Customer approved" : "Customer disapproved");

      console.log("------ DUMMY EMAIL ------");
      console.log("To      :", cust.email);
      console.log(
        "Subject :",
        approve ? "customer approved" : "customer disapproved"
      );
      console.log(
        "Message :",
        approve
          ? "Your Account has been approved by Bank Employee"
          : "Your Account has been disapproved by Bank Employee"
      );
      console.log("-------------------------");

      await loadCustomers();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  }

  return (
    <BELayout active="approve-customers">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-50 mb-4">
          Approve / Disapprove Customers
        </h2>

        {loading && <p className="text-slate-300">Loading...</p>}

        {!loading && customers.length === 0 && (
          <p className="text-slate-400">No pending customers for your branch.</p>
        )}

        {!loading && customers.length > 0 && (
          <div className="overflow-x-auto mt-3">
            <table className="w-full border border-slate-700 rounded-xl overflow-hidden">
              <thead>
                <tr>
                  <th className={thBase}>Temp ID</th>
                  <th className={thBase}>Name</th>
                  <th className={thBase}>Email</th>
                  <th className={thBase}>Phone</th>
                  <th className={thBase}>Created At</th>
                  <th className={thBase}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.tempCustId}>
                    <td className={tdBase}>{c.tempCustId}</td>
                    <td className={tdBase}>
                      {c.fullName ?? c.full_name ?? c.username}
                    </td>
                    <td className={tdBase}>{c.email}</td>
                    <td className={tdBase}>{c.phone}</td>
                    <td className={tdBase}>
                      {c.createdAt ?? c.created_at}
                    </td>
                    <td className={tdBase}>
                      <button
                        onClick={() => handleAction(c, true)}
                        className="rounded-xl bg-slate-100 text-slate-900 px-3 py-1.5 text-xs font-semibold mr-2 hover:bg-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(c, false)}
                        className="rounded-xl bg-rose-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-rose-600"
                      >
                        Disapprove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </BELayout>
  );
}