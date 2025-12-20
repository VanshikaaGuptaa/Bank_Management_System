// src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:9191";

// ===== Validation helpers =====
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/;

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return "Weak";
  if (score <= 3) return "Medium";
  return "Strong";
};

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    phone: "",
    role: "Customer",
    branchId: "",
    accType: "Saving",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(form.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!phoneRegex.test(form.phone)) {
      newErrors.phone = "Phone must be a valid 10-digit Indian number";
    }

    if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (passwordStrength === "Weak") {
      newErrors.password =
        "Include uppercase, number & special character";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const branchIdNum = form.branchId ? Number(form.branchId) : null;

      if (form.role === "Customer") {
        await axios.post(`${API_BASE}/api/customers/create`, {
          username: form.username,
          password: form.password,
          email: form.email,
          phone: form.phone,
          fullName: form.fullName,
          branchId: branchIdNum,
          createdByBe: null,
          accType: form.accType,
          accStatus: "Pending",
        });
      } else if (form.role === "BankManager") {
        await axios.post(`${API_BASE}/api/bank-managers`, {
          username: form.username,
          password: form.password,
          role: "BankManager",
          branchId: branchIdNum,
          fullName: form.fullName,
          email: form.email,
          status: "Pending",
          phone: form.phone,
        });
      } else {
        await axios.post(`${API_BASE}/api/bank-employees`, {
          username: form.username,
          password: form.password,
          email: form.email,
          phone: form.phone,
          fullName: form.fullName,
          role: "BankEmployee",
          status: "Pending",
          approvedByBm: false,
          branchId: branchIdNum,
        });
      }

      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400";
  const labelClass = "text-sm font-medium text-slate-200";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-xl w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 text-slate-100">
        <h2 className="text-2xl font-bold mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Username</label>
            <input name="username" value={form.username} onChange={handleChange} required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required className={inputClass} />
            {form.password && (
              <p className={`text-xs mt-1 ${
                passwordStrength === "Strong" ? "text-emerald-400" :
                passwordStrength === "Medium" ? "text-yellow-400" : "text-red-400"
              }`}>
                Strength: {passwordStrength}
              </p>
            )}
            {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
          </div>

          <div>
            <label className={labelClass}>Confirm Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required className={inputClass} />
            {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label className={labelClass}>Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input name="email" value={form.email} onChange={handleChange} required className={inputClass} />
            {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label className={labelClass}>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} required className={inputClass} />
            {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
          </div>

          <div>
            <label className={labelClass}>Role</label>
            <select name="role" value={form.role} onChange={handleChange} className={inputClass}>
              <option value="Customer">Customer</option>
              <option value="BankEmployee">Bank Employee</option>
              <option value="BankManager">Bank Manager</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Branch ID</label>
            <input name="branchId" value={form.branchId} onChange={handleChange} required className={inputClass} />
          </div>

          {form.role === "Customer" && (
            <div>
              <label className={labelClass}>Account Type</label>
              <select name="accType" value={form.accType} onChange={handleChange} className={inputClass}>
                <option value="Saving">Saving</option>
                <option value="Current">Current</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-emerald-400 text-slate-900 font-semibold py-2 rounded-xl disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
