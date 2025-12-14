import { useState } from "react";
import { openAccountForExistingCustomer } from "../api/bankingApi";

export default function CreateAccount() {
  const [custId, setCustId] = useState("");
  const [accType, setAccType] = useState("Saving");
  const beId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await openAccountForExistingCustomer(Number(beId), Number(custId), accType);
      alert("Account opened for existing customer");
      setCustId("");
      setAccType("Saving");
    } catch (err) {
      console.error(err);
      alert("Failed to open account");
    }
  };

  return (
    <div className="container">
      <h2>Open Account for Existing Customer</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Customer ID
          <input
            value={custId}
            onChange={(e) => setCustId(e.target.value)}
            required
            type="number"
          />
        </label>
        <label>
          Account Type
          <select value={accType} onChange={(e) => setAccType(e.target.value)}>
            <option>Saving</option>
            <option>Current</option>
            <option>RD</option>
            <option>FD</option>
          </select>
        </label>
        <button type="submit">Open Account</button>
      </form>
    </div>
  );
}

