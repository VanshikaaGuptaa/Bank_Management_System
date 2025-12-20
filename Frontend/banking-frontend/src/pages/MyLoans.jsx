import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerLayout from "../layouts/CustomerLayout";

const API_BASE = "http://localhost:9191/api/loans";

export default function MyLoans() {
  const navigate = useNavigate();
  const custId = Number(localStorage.getItem("custId"));

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingLoanId, setPayingLoanId] = useState(null);

  useEffect(() => {
    if (!custId) {
      navigate("/login");
      return;
    }

    loadLoans();
  }, [custId]);

  const loadLoans = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/customer/${custId}`);
      setLoans(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const payEmi = async (loanId) => {
    const confirmPay = window.confirm("Do you want to pay this month's EMI?");
    if (!confirmPay) return;
  
    const input = window.prompt("Enter EMI amount to pay:");
    if (!input) return;
  
    const amount = parseFloat(input);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid EMI amount");
      return;
    }
  
    try {
      setPayingLoanId(loanId);
  
      await axios.post(`${API_BASE}/pay-emi`, {
        loanId,
        amount, // ✅ correct key name
      });
  
      alert("EMI paid successfully");
      loadLoans(); // refresh loan details
    } catch (err) {
      console.error(err);
      alert("Failed to pay EMI");
    } finally {
      setPayingLoanId(null);
    }
  };
  

  return (
    <CustomerLayout active="loans">
      <div className="max-w-6xl mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-6 text-slate-200">
          My Loans
        </h1>

        {loading ? (
          <p className="text-slate-400">Loading loans...</p>
        ) : loans.length === 0 ? (
          <div className="bg-slate-900 p-6 rounded-xl text-slate-400">
            No active loans found.
          </div>
        ) : (
          <div className="space-y-6">
            {loans.map((loan) => (
              <div
                key={loan.loanId}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-300">
                  <div>
                    <span className="text-slate-400">Loan ID</span>
                    <p className="font-semibold">{loan.loanId}</p>
                  </div>

                  <div>
                    <span className="text-slate-400">Type</span>
                    <p className="font-semibold">{loan.loanType}</p>
                  </div>

                  <div>
                    <span className="text-slate-400">Amount</span>
                    <p className="font-semibold">₹{loan.loanAmount}</p>
                  </div>

                  <div>
                    <span className="text-slate-400">Interest</span>
                    <p className="font-semibold">{loan.interestRate}%</p>
                  </div>

                  <div>
                    <span className="text-slate-400">Tenure</span>
                    <p className="font-semibold">{loan.tenureMonths} months</p>
                  </div>

                  <div>
                    <span className="text-slate-400">EMI</span>
                    <p className="font-semibold">₹{loan.emiAmount}</p>
                  </div>

                  <div>
                    <span className="text-slate-400">Remaining</span>
                    <p className="font-semibold">₹{loan.remainingAmount}</p>
                  </div>

                  <div>
                    <span className="text-slate-400">Status</span>
                    <p
                      className={`font-semibold ${
                        loan.status === "ACTIVE"
                          ? "text-green-400"
                          : "text-slate-400"
                      }`}
                    >
                      {loan.status}
                    </p>
                  </div>
                </div>

                {loan.status === "Approved" && (
                  <div className="mt-4">
                    <button
                      onClick={() => payEmi(loan.loanId)}
                      disabled={payingLoanId === loan.loanId}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-400 disabled:opacity-50"
                    >
                      {payingLoanId === loan.loanId
                        ? "Processing..."
                        : "Pay EMI"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
