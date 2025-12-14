// src/pages/MiniStatement.jsx
import React, { useEffect, useState } from "react";
import { getAccountsByCustId, getMiniStatement } from "../api/customerApi";
import CustomerLayout from "../layouts/CustomerLayout";

export default function MiniStatement() {
  const custId = Number(localStorage.getItem("custId"));

  const [accounts, setAccounts] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState("");
  const [txns, setTxns] = useState([]);

  // load accounts once
  useEffect(() => {
    async function loadAccounts() {
      try {
        const res = await getAccountsByCustId(custId);
        setAccounts(res.data || []);
      } catch (e) {
        console.error(e);
        alert("Failed to load accounts");
      }
    }
    if (custId) loadAccounts();
  }, [custId]);

  // load mini statement whenever selectedAcc changes
  useEffect(() => {
    if (!selectedAcc) {
      setTxns([]);
      return;
    }

    async function loadMini() {
      try {
        const res = await getMiniStatement(selectedAcc);
        setTxns(res.data || []);
      } catch (e) {
        console.error(e);
        alert("Failed to load mini statement");
      }
    }

    loadMini();
  }, [selectedAcc]);

  function printPage() {
    window.print();
  }

  const selectClass =
    "w-full md:w-80 bg-slate-100 text-slate-900 px-3 py-2 rounded-2xl text-sm " +
    "border border-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400";

  const buttonWhite =
    "px-4 py-2 rounded-2xl bg-slate-100 text-slate-900 text-sm font-medium " +
    "shadow hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400";

  return (
    <CustomerLayout active="mini">
      <div className="max-w-4xl bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Mini Statement</h2>
            <p className="text-xs text-slate-400">
              View the latest transactions for your selected account (typically
              last 10 entries).
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Select Account
              </label>
              <select
                value={selectedAcc}
                onChange={(e) => setSelectedAcc(e.target.value)}
                className={selectClass}
              >
                <option value="">-- choose account --</option>
                {accounts.map((a) => {
                  const accNo =
                    a.accountNo ?? a.accNo ?? a.account_no ?? "";
                  return (
                    <option key={accNo} value={accNo}>
                      {accNo}
                    </option>
                  );
                })}
              </select>
            </div>

            <button onClick={printPage} className={buttonWhite}>
              Print Statement
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 mt-4">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900/80">
              <tr>
                <th className="px-4 py-3 text-left text-slate-300 font-medium">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-slate-300 font-medium">
                  Cr / Dr
                </th>
                <th className="px-4 py-3 text-left text-slate-300 font-medium">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-slate-300 font-medium">
                  Final Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {txns.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-slate-400"
                  >
                    No transactions to show.
                  </td>
                </tr>
              ) : (
                txns.map((t, idx) => {
                  // figure out Cr/Dr label
                  let crdr = "";
                  if (typeof t.credit !== "undefined") {
                    crdr = t.credit ? "Cr" : "Dr";
                  } else if (t.transType) {
                    crdr = t.transType.toLowerCase().includes("credit")
                      ? "Cr"
                      : "Dr";
                  } else if (t.type) {
                    crdr = String(t.type)
                      .toLowerCase()
                      .includes("credit")
                      ? "Cr"
                      : "Dr";
                  }

                  return (
                    <tr
                      key={idx}
                      className="border-t border-slate-800/80 hover:bg-slate-900/70"
                    >
                      <td className="px-4 py-3">
                        {t.transDate ?? t.txnDate ?? t.date}
                      </td>
                      <td className="px-4 py-3">{crdr}</td>
                      <td className="px-4 py-3">
                        ₹ {t.amount ?? t.txnAmount ?? t.value ?? ""}
                      </td>
                      <td className="px-4 py-3">
                        ₹ {t.balanceAfter ?? t.finalBalance ?? ""}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CustomerLayout>
  );
}