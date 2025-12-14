// src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:9191";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    phone: "",
    role: "Customer", // default
    branchId: "",
    accType: "Saving", // for customer
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const branchIdNum = form.branchId ? Number(form.branchId) : null;

      if (form.role === "Customer") {
        const payload = {
          username: form.username,
          password: form.password,
          email: form.email,
          phone: form.phone,
          fullName: form.fullName,
          branchId: branchIdNum,
          createdByBe: null,
          accType: form.accType,
          accStatus: "Pending",
        };

        await axios.post(`${API_BASE}/api/customers/create`, payload);
        alert("Customer registered successfully");
      } else if (form.role === "BankManager") {
        const payload = {
          username: form.username,
          password: form.password,
          role: "BankManager",
          branchId: branchIdNum,
          fullName: form.fullName,
          email: form.email,
          status: "Pending",
          phone: form.phone,
        };

        await axios.post(`${API_BASE}/api/bank-managers`, payload);
        alert("Bank Manager registered successfully");
      } else if (form.role === "BankEmployee") {
        const payload = {
          username: form.username,
          password: form.password,
          email: form.email,
          phone: form.phone,
          fullName: form.fullName,
          role: "BankEmployee",
          status: "Pending",
          approvedByBm: false,
          branchId: branchIdNum,
        };

        await axios.post(`${API_BASE}/api/bank-employees`, payload);
        alert("Bank Employee registered successfully");
      }

      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400";
  const labelClass = "text-sm font-medium text-slate-200";

  return (
    <div className="w-full bg-slate-900 text-slate-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full bg-slate-950/80 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Left panel / intro */}
        <div className="hidden md:flex flex-col justify-between p-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
          <div>
            <p className="text-emerald-400 text-sm tracking-[0.25em] uppercase mb-2">
              New here?
            </p>
            <h1 className="text-3xl font-extrabold leading-tight">
              Create your <span className="text-emerald-400">Banking</span> account
            </h1>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
              Register as a customer, bank employee, or bank manager and get
              access to secure dashboards, approvals, and account management in
              just a few steps.
            </p>
          </div>

          <div className="mt-8 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <p className="text-slate-300">
                Customer registrations create a pending account request for
                branch approval.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              <p className="text-slate-300">
                Employee & manager registrations require admin/branch approval.
              </p>
            </div>
          </div>
        </div>

        {/* Right panel / form */}
        <div className="p-6 sm:p-8 bg-slate-950/60 backdrop-blur">
          <h2 className="text-2xl font-bold mb-2">Register</h2>
          <p className="text-sm text-slate-400 mb-6">
            Fill in your details to create a new account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className={labelClass}>Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="john_doe"
              />
            </div>

            {/* Passwords */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className={labelClass}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Full name */}
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="John Doe"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="9876543210"
                />
              </div>
            </div>

            {/* Role & Branch */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Customer">Customer</option>
                  <option value="BankEmployee">Bank Employee</option>
                  <option value="BankManager">Bank Manager</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Branch ID</label>
                <input
                  name="branchId"
                  value={form.branchId}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="e.g. 101"
                />
              </div>
            </div>

            {/* Account type only for Customer */}
            {form.role === "Customer" && (
              <div>
                <label className={labelClass}>Account Type</label>
                <select
                  name="accType"
                  value={form.accType}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Saving">Saving</option>
                  <option value="Current">Current</option>
                </select>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-2xl bg-emerald-400 text-slate-900 font-semibold py-2.5 shadow-md hover:bg-emerald-500 active:bg-emerald-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="mt-3 text-xs text-slate-400 text-center">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-emerald-400 hover:underline"
              >
                Log in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}