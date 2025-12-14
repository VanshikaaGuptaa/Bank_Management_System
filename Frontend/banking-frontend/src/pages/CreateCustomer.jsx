import { useState } from "react";
import { createCustomerWithAccount } from "../api/bankingApi";

export default function CreateCustomer() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    fullName: "",
    branchId: "",
    accType: "Saving",
  });

  const beId = localStorage.getItem("userId"); // createdByBe

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username: form.username,
      password: form.password, // temp password for first login
      email: form.email,
      phone: form.phone,
      fullName: form.fullName,
      branchId: Number(form.branchId),
      createdByBe: Number(beId),
      accType: form.accType,
      accStatus: "ACTIVE", // or "PENDING" depending on your logic
    };

    try {
      await createCustomerWithAccount(payload);
      alert("Customer created and first account opened. Share temp password with customer.");
      setForm({
        username: "",
        password: "",
        email: "",
        phone: "",
        fullName: "",
        branchId: "",
        accType: "Saving",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create customer");
    }
  };

  return (
    <div className="container">
      <h2>Create Customer & First Account</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Username
          <input name="username" value={form.username} onChange={handleChange} required />
        </label>
        <label>
          Temporary Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Full Name
          <input name="fullName" value={form.fullName} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </label>
        <label>
          Branch ID
          <input
            name="branchId"
            value={form.branchId}
            onChange={handleChange}
            required
            type="number"
          />
        </label>
        <label>
          Account Type
          <select name="accType" value={form.accType} onChange={handleChange}>
            <option>Saving</option>
            <option>Current</option>
          </select>
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
