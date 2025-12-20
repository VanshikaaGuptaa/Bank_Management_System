// src/pages/Customer_Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAccountsByCustId,
  getCustomerByCustId,
  getAllCustomers,
} from "../api/customerApi";
import CustomerLayout from "../layouts/CustomerLayout";

export default function Customer_Dashboard() {
  const navigate = useNavigate();
  const [custId, setCustId] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const load = async () => {
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        // 1) resolve custId from userId
        const resAll = await getAllCustomers();
        const list = resAll.data || [];
        const row = list.find(
          (c) => (c.userId ?? c.user_id ?? c.userid) === userId
        );
        if (!row) {
          alert("Customer row not found for current user");
          return;
        }
        const id = row.custId ?? row.cust_id ?? row.id;
        setCustId(id);
        localStorage.setItem("custId", String(id));

        // 2) load customer details
        try {
          const resCust = await getCustomerByCustId(id);
          setCustomer(resCust.data);
        } catch (e) {
          console.error("failed getCustomerByCustId", e);
        }

        // 3) load accounts
        try {
          const accRes = await getAccountsByCustId(id);
          setAccounts(accRes.data || []);
        } catch (e) {
          console.error("failed getAccountsByCustId", e);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load customer data");
      }
    };

    load();
  }, [userId, navigate]);

  const fullNameFromStorage = localStorage.getItem("fullName");
  const effectiveName =
    fullNameFromStorage ||
    customer?.user?.fullName ||
    customer?.fullName ||
    "Customer";

  return (
    <CustomerLayout active="dashboard">
      {/* Small summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3">
          <p className="text-xs text-slate-400 mb-1">Customer ID</p>
          <p className="text-lg font-semibold text-emerald-400">
            {custId ?? "—"}
          </p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3">
          <p className="text-xs text-slate-400 mb-1">Primary Holder</p>
          <p className="text-lg font-semibold">{effectiveName}</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3">
          <p className="text-xs text-slate-400 mb-1">Total Accounts</p>
          <p className="text-lg font-semibold">
            {accounts ? accounts.length : 0}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-3">Your Accounts</h2>

      {accounts.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-6 text-sm text-slate-300">
          No accounts found yet. Visit your branch or contact support to open
          your first account.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="px-4 py-3 text-left text-slate-300 font-medium">
                  Account No
                </th>
                <th className="px-4 py-3 text-left text-slate-300 font-medium">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-slate-300 font-medium">
                  Balance
                </th>
                <th className="px-4 py-3 text-left text-slate-300 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a, idx) => {
                const accNo = a.accountNo ?? a.accNo ?? a.accno;
                const type = a.type ?? a.accountType ?? a.accType ?? "—";
                const bal = a.balance ?? a.currentBalance ?? "0";
                return (
                  <tr
                    key={accNo || idx}
                    className="border-t border-slate-800/80 hover:bg-slate-900/70"
                  >
                    <td className="px-4 py-3">{accNo}</td>
                    <td className="px-4 py-3">{type}</td>
                    <td className="px-4 py-3">₹ {bal}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => navigate("/customer/close-account")}
                        className="px-3 py-1 rounded-xl bg-slate-100 text-slate-900 text-xs font-medium hover:bg-slate-200"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => navigate("/customer/loans")}
                        className="px-3 py-1 rounded-xl bg-slate-100 text-slate-900 text-xs font-medium hover:bg-slate-200"
                      >
                        Loans / EMI
                      </button>
                      <button
                        onClick={() => navigate("/customer/apply-loan")}
                        className="px-3 py-1 rounded-xl bg-slate-100 text-slate-900 text-xs font-medium hover:bg-slate-200"
                      >
                        Apply Loan
                      </button>
                     
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </CustomerLayout>
  );
}