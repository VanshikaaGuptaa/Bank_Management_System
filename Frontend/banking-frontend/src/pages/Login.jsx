import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "http://localhost:9191";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // If this component is ever used on /admin-login/... we hide customerId
  const isAdminLogin = location.pathname.startsWith("/admin-login");

  // ---------------- LOGIN STATES ----------------
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [custId, setCustId] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- FORGOT PASSWORD STATES ----------------
  const [showForgot, setShowForgot] = useState(false);
  const [fpUsername, setFpUsername] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpOtpGenerated, setFpOtpGenerated] = useState(null);
  const [fpOtpInput, setFpOtpInput] = useState("");
  const [fpLoading, setFpLoading] = useState(false);

  // ---------------- NORMAL LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        username,
        password,
      });

      // If customer is TEMP (Inactive)
      if (res.status === 403 || res.data?.message?.includes("TEMP")) {
        localStorage.setItem("tempUsername", username);
        alert("Your account is TEMP. Please change password.");
        navigate("/customer/change-password");
        return;
      }

      const data = res.data;

      // Store login info
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", data.role);
      localStorage.setItem("fullName", data.fullName);

      // ⭐ Store customer id only when this is *Customer* login
      if (!isAdminLogin && data.role === "Customer") {
        localStorage.setItem("custId", custId);
      }

      // Redirect based on role
      switch (data.role) {
        case "RegionalManager":
          navigate("/rm-dashboard");
          break;
        case "BankManager":
          navigate("/bm-dashboard");
          break;
        case "BankEmployee":
          navigate("/be-dashboard");
          break;
        case "Customer":
          navigate("/customer-dashboard");
          break;
        default:
          alert("Unknown role: " + data.role);
      }
    } catch (err) {
      if (
        err.response?.status === 403 &&
        err.response?.data?.message?.toLowerCase().includes("password update required")
      ) {
        localStorage.setItem("tempUsername", username);
        alert("Your account is TEMP. Please change your password.");
        navigate("/customer/change-password");
        return;
      }

      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- GENERATE OTP (Dummy) ----------------
  const generateFpOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("Dummy OTP (Forgot Password):", otp);
    setFpOtpGenerated(otp.toString());
    alert("OTP generated. Check browser console (F12 > Console).");
  };

  // ---------------- FORGOT PASSWORD HANDLER (RM only) ----------------
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!fpUsername || !fpNewPassword || !fpConfirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (fpNewPassword !== fpConfirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!fpOtpGenerated) {
      alert("Generate OTP first.");
      return;
    }

    if (fpOtpGenerated !== fpOtpInput) {
      alert("Invalid OTP.");
      return;
    }

    try {
      setFpLoading(true);

      // 1) Get all RMs
      const resAll = await axios.get(`${API_BASE}/api/rm`);
      const list = resAll.data || [];

      // 2) Find RM by username
      const rmRow = list.find((rm) => rm.username === fpUsername);

      if (!rmRow) {
        alert("No RM found with this username.");
        return;
      }

      const rmId = rmRow.rmId ?? rmRow.rmid ?? rmRow.id;

      // 3) Update password
      await axios.put(`${API_BASE}/api/rm/${rmId}`, {
        password: fpNewPassword,
      });

      alert("Password reset successful. Please login with new password.");

      // Reset form
      setFpUsername("");
      setFpNewPassword("");
      setFpConfirmPassword("");
      setFpOtpInput("");
      setFpOtpGenerated(null);
      setShowForgot(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update password");
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Header / Toggle */}
        <div className="flex justify-between items-center px-8 pt-6 pb-3 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-semibold text-white">
              {showForgot ? "Reset Password" : "Welcome back"}
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              {showForgot
                ? "Reset Regional Manager password using OTP."
                : "Login using your credentials to access your dashboard."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowForgot((v) => !v)}
            className="text-xs px-4 py-2 rounded-full border border-emerald-400/70 text-emerald-300
                       hover:bg-emerald-400/10 transition"
          >
            {showForgot ? "← Back to Login" : "Forgot Password?"}
          </button>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-0">
          {/* LOGIN FORM */}
          {!showForgot && (
            <div className="px-8 py-8">
              <form onSubmit={handleLogin} className="space-y-5">
                {/* 👇 Customer ID only for non-admin login (Customer) */}
                {!isAdminLogin && (
                  <div>
                    <label className="block text-sm text-slate-200 mb-1">
                      Customer ID
                    </label>
                    <input
                      type="text"
                      value={custId}
                      onChange={(e) => setCustId(e.target.value)}
                      required
                      className="w-full rounded-xl bg-slate-900/60 border border-slate-600 px-3 py-2 text-slate-100
                                 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                                 placeholder:text-slate-500 text-sm"
                      placeholder="Enter your customer ID"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm text-slate-200 mb-1">
                    Username
                  </label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-900/60 border border-slate-600 px-3 py-2 text-slate-100
                               focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                               placeholder:text-slate-500 text-sm"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-200 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-900/60 border border-slate-600 px-3 py-2 text-slate-100
                               focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                               placeholder:text-slate-500 text-sm"
                    placeholder="Enter password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400
                             text-slate-900 font-semibold text-sm shadow-lg shadow-emerald-500/30
                             disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                {!isAdminLogin && (
                  <p className="text-xs text-slate-400 mt-2">
                    Is your account TEMP?
                    <button
                      type="button"
                      onClick={() => navigate("/customer/change-password")}
                      className="ml-1 text-emerald-300 hover:underline"
                    >
                      Change temporary password
                    </button>
                  </p>
                )}
              </form>
            </div>
          )}

          {/* FORGOT PASSWORD FORM (RM) */}
          {showForgot && (
            <div className="px-8 py-8">
              <h2 className="text-lg font-semibold text-emerald-300 mb-4">
                Reset Password (Regional Manager)
              </h2>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-200 mb-1">
                    Username
                  </label>
                  <input
                    value={fpUsername}
                    onChange={(e) => setFpUsername(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-900/60 border border-slate-600 px-3 py-2 text-slate-100
                               focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                               placeholder:text-slate-500 text-sm"
                    placeholder="RM username"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-200 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={fpNewPassword}
                    onChange={(e) => setFpNewPassword(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-900/60 border border-slate-600 px-3 py-2 text-slate-100
                               focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                               placeholder:text-slate-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-200 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={fpConfirmPassword}
                    onChange={(e) => setFpConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-900/60 border border-slate-600 px-3 py-2 text-slate-100
                               focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                               placeholder:text-slate-500 text-sm"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={generateFpOtp}
                    className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-xs text-slate-100
                               hover:bg-slate-700 transition"
                  >
                    Generate OTP (dummy)
                  </button>
                  {fpOtpGenerated && (
                    <span className="text-[11px] text-slate-400">
                      OTP generated (see browser console).
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-slate-200 mb-1">
                    Enter OTP
                  </label>
                  <input
                    value={fpOtpInput}
                    onChange={(e) => setFpOtpInput(e.target.value)}
                    required
                    className="w-full rounded-xl bg-slate-900/60 border border-slate-600 px-3 py-2 text-slate-100
                               focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                               placeholder:text-slate-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={fpLoading}
                  className="w-full mt-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400
                             text-slate-900 font-semibold text-sm shadow-lg shadow-emerald-500/30
                             disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {fpLoading ? "Processing..." : "Reset Password"}
                </button>

                <p className="text-xs text-slate-400 mt-3">
                  For temporary customer accounts, use{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/customer/change-password")}
                    className="text-emerald-300 hover:underline"
                  >
                    Change Temporary Password
                  </button>
                  .
                </p>
              </form>
            </div>
          )}

          {/* Right-side info panel */}
          <div className="hidden md:flex flex-col justify-center px-8 py-8 border-l border-white/10 bg-slate-900/40">
            <h3 className="text-xl font-semibold text-white mb-3">
              Secure Internet Banking
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              Use your registered credentials to login. Never share your password
              or OTP with anyone. If you suspect suspicious activity, change your
              password immediately.
            </p>
            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              <li>Multi-role access: RM, BM, BE, and Customer.</li>
              <li>Change temporary password on first login.</li>
              <li>Use the forgot password flow for Regional Managers.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}