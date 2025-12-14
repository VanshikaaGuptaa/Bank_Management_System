import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUserId } from "../context/AuthContext";

const API_BASE = "http://localhost:9191";

const emptyForm = {
  id: null,
  username: "",
  fullName: "",
  email: "",
  phone: "",
  address: "",
};

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [profileImage, setProfileImage] = useState(null);
  const [beId, setBeId] = useState(null); // needed for open-account

  useEffect(() => {
    load();
    resolveBeId();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/customers`); // adjust path
      setCustomers(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  // just like RM/BM mapping: BE id from /api/bank-employees
  async function resolveBeId() {
    try {
      const userId = getUserId();
      if (!userId) return;
      const res = await axios.get(`${API_BASE}/api/bank-employees`);
      const list = res.data || [];
      const row = list.find(
        (be) =>
          be.userId === userId ||
          be.user_id === userId
      );
      if (row) setBeId(row.beId ?? row.be_id ?? row.id);
    } catch (err) {
      console.error("Failed to resolve BE id", err);
    }
  }

  function startCreate() {
    setForm(emptyForm);
    setProfileImage(null);
    setEditing(true);
  }

  function startEdit(c) {
    setForm({
      id: c.custId ?? c.cust_id ?? c.id,
      username: c.username ?? "",
      fullName: c.fullName ?? c.full_name ?? "",
      email: c.email ?? "",
      phone: c.phone ?? "",
      address: c.address ?? "",
    });
    setProfileImage(null);
    setEditing(true);
  }

  async function handleDelete(custId) {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await axios.delete(`${API_BASE}/api/customers/${custId}`); // adjust
      alert("Customer deleted");
      load();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("username", form.username);
      fd.append("fullName", form.fullName);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("address", form.address);
      if (profileImage) fd.append("image", profileImage);

      if (form.id) {
        // update
        await axios.put(
          `${API_BASE}/api/customers/${form.id}/profile`, // path like RM/BM profile
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Customer updated");
      } else {
        // create
        await axios.post(
          `${API_BASE}/api/customers/profile`, // or /api/customers with multipart – adjust to your API
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Customer created");
      }

      setEditing(false);
      load();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  }

  async function openFirstAccount(custId) {
    if (!beId) {
      alert("Bank employee id not resolved yet");
      return;
    }
    const type = window.prompt("Account type (e.g. SAVINGS):", "SAVINGS");
    const balance = window.prompt("Opening balance:", "1000");
    if (!type || !balance) return;
    try {
      const dto = {
        accountType: type,
        balance: Number(balance),
      };
      await axios.post(
        `${API_BASE}/api/bank-employees/${beId}/customers/${custId}/accounts`,
        dto
      );
      alert("First account opened successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to open account");
    }
  }

  if (loading && !editing) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Manage Customers</h2>

      {!editing && (
        <>
          <button onClick={startCreate}>Add Customer</button>
          <table border="1" cellPadding="8" style={{ marginTop: 16 }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const id = c.custId ?? c.cust_id ?? c.id;
                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{c.username}</td>
                    <td>{c.fullName ?? c.full_name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{c.address}</td>
                    <td>
                      <button onClick={() => startEdit(c)}>Edit</button>
                      <button
                        style={{ marginLeft: 8 }}
                        onClick={() => handleDelete(id)}
                      >
                        Delete
                      </button>
                      <button
                        style={{ marginLeft: 8 }}
                        onClick={() => openFirstAccount(id)}
                      >
                        Open 1st Account
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {editing && (
        <form onSubmit={handleSave} style={{ marginTop: 16 }}>
          <h3>{form.id ? "Edit Customer" : "Add Customer"}</h3>

          <label>
            Username
            <input
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              required
            />
          </label>
          <br />

          <label>
            Full Name
            <input
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
              required
            />
          </label>
          <br />

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </label>
          <br />

          <label>
            Phone
            <input
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              required
            />
          </label>
          <br />

          <label>
            Address
            <input
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
              required
            />
          </label>
          <br />

          <label>
            Profile Image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </label>
          <br />

          <button type="submit">Save</button>
          <button
            type="button"
            style={{ marginLeft: 8 }}
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
