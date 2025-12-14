import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStatement } from "../api/customerApi";
import { getMiniStatement } from "../api/CustomerApi";

export default function ViewAccount() {
  const { accNo } = useParams();
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getMiniStatement(accNo);
        setTransactions(res.data || []);
      } catch (e) {
        console.error(e);
        alert("Failed to load account statement");
      }
    }

    if (accNo) loadData();
  }, [accNo]);

  return (
    <div style={{ padding: 20 }}>
      <h3>Account {accNo}</h3>
      <button onClick={() => navigate(-1)}>Back</button>
      <div style={{ marginTop: 12 }}>
        <h4>Last transactions</h4>
        {transactions.length === 0 ? (
          <div>No transactions</div>
        ) : (
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, idx) => (
                <tr key={idx}>
                  <td>
  {t.transDate ? new Date(t.transDate).toLocaleString() : ""}
</td>

<td>
  {t.transType?.toLowerCase().includes("credit") ? "Cr" : "Db"}
</td>

<td>{t.amount}</td>

<td>{t.balanceAfter}</td>
  
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}