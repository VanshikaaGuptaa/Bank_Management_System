import React, { useEffect, useState } from "react";
import { getAccountsByCustId } from "../api/customerApi";
import { useNavigate } from "react-router-dom";


export default function ViewAccounts() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);

  const custId = localStorage.getItem("custId") ;

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    try {
      const res = await getAccountsByCustId(custId);
      setAccounts(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load accounts");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Accounts</h2>

      {accounts.length === 0 ? (
        <p>No accounts found</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Account No</th>
              <th>Account Type</th>
              <th>Balance</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {accounts.map((acc,idx) => (
              <tr key={idx}>
                <td>{acc.accNo ?? acc.acc_no}</td>
                <td>{acc.accType?? acc.acc_type}</td>
                <td>{acc.balance}</td>
                <td>
                  <button onClick={() => navigate(`/customer/account/${acc.accNo?? acc.acc_no}`)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button style={{ marginTop: 20 }} onClick={() => navigate("/customer-dashboard")}>
        Back
      </button>
    </div>
  );
}