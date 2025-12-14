// src/pages/BE_ManageCustomers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import BELayout from "../layouts/BELayout";

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
  const [beId, setBeId] = useState(null);

  useEffect(() => {
    load();
    resolveBeId();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/customers`);
      setCustomers(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  async function resolveBeId() {
    try {
      const userIdRaw = localStorage.getItem("userId");
      const userId = userIdRaw ? Number(userIdRaw) : null;
      if (!userId) return;

      const res = await axios.get(`${API_BASE}/api/bank-employees`);
      const list = res.data || [];
      const row = list.find(
        (be) =>
          be.userId === userId ||
          be.user_id === userId ||
          be.userid === userId
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
    if (!window.confirm("Delete this customer (and their user record)?")) return;
    try {
      await axios.delete(`${API_BASE}/api/customers/${custId}`);
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
        await axios.put(
          `${API_BASE}/api/customers/${form.id}/profile`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("Customer updated");
      } else {
        await axios.post(
          `${API_BASE}/api/customers/profile`,
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

  return (
    <BELayout active="manage-customers">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-50 mb-4">
          Manage Customers
        </h2>

        {!editing && (
          <>
            <button
              onClick={startCreate}
              className="rounded-2xl bg-slate-100 text-slate-900 px-4 py-2 text-sm font-semibold shadow hover:bg-white"
            >
              Add Customer
            </button>

            {loading && <p className="mt-4 text-slate-300">Loading...</p>}

            {!loading && (
              <div className="overflow-x-auto mt-4">
                <table className="w-full border border-slate-700 rounded-xl overflow-hidden text-sm">
                  <thead>
                    <tr className="bg-slate-900/70">
                      <th className="border border-slate-700 px-3 py-2 text-left">
                        ID
                      </th>
                      <th className="border border-slate-700 px-3 py-2 text-left">
                        Username
                      </th>
                      <th className="border border-slate-700 px-3 py-2 text-left">
                        Name
                      </th>
                      <th className="border border-slate-700 px-3 py-2 text-left">
                        Email
                      </th>
                      <th className="border border-slate-700 px-3 py-2 text-left">
                        Phone
                      </th>
                      <th className="border border-slate-700 px-3 py-2 text-left">
                        Address
                      </th>
                      <th className="border border-slate-700 px-3 py-2 text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => {
                      const id = c.custId ?? c.cust_id ?? c.id;
                      return (
                        <tr key={id} className="odd:bg-slate-900/40">
                          <td className="border border-slate-700 px-3 py-2">
                            {id}
                          </td>
                          <td className="border border-slate-700 px-3 py-2">
                            {c.username}
                          </td>
                          <td className="border border-slate-700 px-3 py-2">
                            {c.fullName ?? c.full_name}
                          </td>
                          <td className="border border-slate-700 px-3 py-2">
                            {c.email}
                          </td>
                          <td className="border border-slate-700 px-3 py-2">
                            {c.phone}
                          </td>
                          <td className="border border-slate-700 px-3 py-2">
                            {c.address}
                          </td>
                          <td className="border border-slate-700 px-3 py-2 space-x-2">
                            <button
                              onClick={() => startEdit(c)}
                              className="rounded-xl bg-slate-100 text-slate-900 px-3 py-1 text-xs font-semibold hover:bg-white"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(id)}
                              className="rounded-xl bg-rose-500 text-white px-3 py-1 text-xs font-semibold hover:bg-rose-600"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => openFirstAccount(id)}
                              className="rounded-xl bg-emerald-500 text-white px-3 py-1 text-xs font-semibold hover:bg-emerald-600"
                            >
                              Open 1st Account
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {editing && (
          <form
            onSubmit={handleSave}
            className="mt-4 max-w-xl space-y-4 text-sm"
          >
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              {form.id ? "Edit Customer" : "Add Customer"}
            </h3>

            <label className="block">
              <span className="text-slate-300">Username</span>
              <input
                className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/60"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                required
              />
            </label>

            <label className="block">
              <span className="text-slate-300">Full Name</span>
              <input
                className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/60"
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                required
              />
            </label>

            <label className="block">
              <span className="text-slate-300">Email</span>
              <input
                type="email"
                className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/60"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </label>

            <label className="block">
              <span className="text-slate-300">Phone</span>
              <input
                className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/60"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                required
              />
            </label>

            <label className="block">
              <span className="text-slate-300">Address</span>
              <input
                className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/60"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                required
              />
            </label>

            <label className="block">
              <span className="text-slate-300">Profile Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
                className="mt-1 block w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-slate-100 file:text-slate-900 hover:file:bg-white"
              />
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="rounded-2xl bg-slate-100 text-slate-900 px-4 py-2 text-sm font-semibold shadow hover:bg-white"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-2xl bg-slate-800 text-slate-100 px-4 py-2 text-sm font-medium hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </BELayout>
  );
}