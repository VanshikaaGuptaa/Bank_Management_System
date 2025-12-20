import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";
import { getAccountsByCustId } from "../api/customerApi";

const API_BASE = "http://localhost:9191/api/customers";

export default function Close_Account() {
  const navigate = useNavigate();
  const custId = Number(localStorage.getItem("custId"));
  const [accounts, setAccounts] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
   

    const loadAccounts = async () => {
      try {
        const res = await getAccountsByCustId(custId);
        setAccounts(res.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load accounts");
      }
    };

    loadAccounts();
  }, [custId, navigate]);

  const handleCloseAccount = async () => {
    if (!selectedAcc) {
      alert("Please select an account");
      return;
    }

    const confirm = window.confirm(
      "Are you sure you want to close this account? This action is irreversible."
    );
    if (!confirm) return;

    try {
      setLoading(true);

      await axios.delete(`${API_BASE}/delete-account`, {
        data: { accNo: selectedAcc },
      });

      alert("Account closed successfully");

// clear local state safely
setAccounts(prev => prev.filter(a => a.accountNo !== selectedAcc));

// THEN navigate
navigate("/customer/dashboard", { replace: true });

    } catch (err) {
        console.error(err);
      
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setAccounts([]);
        }
      }
       finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout active="dashboard">
      <div className="max-w-xl mx-auto mt-10 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4 text-red-400">
          Close Bank Account
        </h2>

        <p className="text-sm text-slate-400 mb-4">
          Select the account you want to permanently close.
        </p>

        <select
          className="w-full mb-4 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
          value={selectedAcc}
          onChange={(e) => setSelectedAcc(e.target.value)}
        >
          <option value="">-- Select Account --</option>
          {accounts.map((a, i) => {
            const accNo = a.accountNo ?? a.accNo ?? a.accno;
            const type = a.type ?? a.accountType ?? "Account";
            return (
              <option key={i} value={accNo}>
                {accNo} ({type})
              </option>
            );
          })}
        </select>

        <button
          onClick={handleCloseAccount}
          disabled={loading}
          className="w-full py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-400 disabled:opacity-50"
        >
          {loading ? "Closing..." : "Close Account"}
        </button>

        <button
          onClick={() => navigate("/customer/dashboard")}
          className="w-full mt-3 py-2 rounded-xl bg-slate-200 text-slate-900 font-medium hover:bg-slate-300"
        >
          Cancel
        </button>
      </div>
    </CustomerLayout>
  );
}
