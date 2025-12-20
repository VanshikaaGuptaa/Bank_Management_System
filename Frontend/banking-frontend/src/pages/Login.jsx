import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "http://localhost:9191";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

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
  const [fpLoading, setFpLoading] = useState(false);

  // ---------------- LOGIN HANDLER ----------------
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        username,
        password,
      });

      // 🔒 TEMP CUSTOMER CHECK (DO NOT REMOVE)
      if (res.status === 403 || res.data?.message?.includes("TEMP")) {
        localStorage.setItem("tempUsername", username);
        alert("Your account is TEMP. Please change your password.");
        navigate("/customer/change-password");
        return;
      }

      const data = res.data;

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", data.role);
      localStorage.setItem("fullName", data.fullName);

      if (!isAdminLogin && data.role === "Customer") {
        localStorage.setItem("custId", custId);
      }

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
          alert("Unknown role");
      }
    } catch (err) {
      // 🔒 SECOND TEMP SAFETY CHECK
      if (
        err.response?.status === 403 &&
        err.response?.data?.message
          ?.toLowerCase()
          .includes("password update required")
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

  // ---------------- FORGOT PASSWORD (BANK EMPLOYEE) ----------------
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!fpUsername || !fpNewPassword || !fpConfirmPassword) {
      alert("All fields are required");
      return;
    }

    if (fpNewPassword !== fpConfirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setFpLoading(true);

      // 1️⃣ Load all bank employees
      const res = await axios.get(`${API_BASE}/api/bank-employees`);
      const list = res.data || [];

      // 2️⃣ Find employee by username
      const beRow = list.find((be) => be.username === fpUsername);

      if (!beRow) {
        alert("No Bank Employee found with this username");
        return;
      }

      const beId = beRow.beId ?? beRow.be_id ?? beRow.id;

      // 3️⃣ Update password (NO old password)
      await axios.put(`${API_BASE}/api/bank-employees/${beId}`, {
        newPassword: fpNewPassword,
      });

      alert("Password reset successful. Please login.");

      setFpUsername("");
      setFpNewPassword("");
      setFpConfirmPassword("");
      setShowForgot(false);
    } catch (err) {
      console.error(err);
      alert("Failed to reset password");
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-900 px-4">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center px-8 pt-6 pb-3 border-b border-white/10">
          <h1 className="text-3xl font-semibold text-white">
            {showForgot ? "Forgot Password" : "Welcome back"}
          </h1>

          <button
            type="button"
            onClick={() => setShowForgot((v) => !v)}
            className="text-xs px-4 py-2 rounded-full border border-emerald-400/70 text-emerald-300"
          >
            {showForgot ? "← Back to Login" : "Forgot Password?"}
          </button>
        </div>

        <div className="grid md:grid-cols-2">
          {/* LOGIN FORM */}
          {!showForgot && (
            <div className="px-8 py-8">
              <form onSubmit={handleLogin} className="space-y-5">
                {!isAdminLogin && (
                  <input
                    placeholder="Customer ID"
                    value={custId}
                    onChange={(e) => setCustId(e.target.value)}
                    className="w-full rounded-xl bg-slate-900/60 px-3 py-2 text-slate-100"
                  />
                )}

                <input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full rounded-xl bg-slate-900/60 px-3 py-2 text-slate-100"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl bg-slate-900/60 px-3 py-2 text-slate-100"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-xl bg-emerald-500 text-slate-900 font-semibold"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                {!isAdminLogin && (
                  <p className="text-xs text-slate-400">
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

          {/* FORGOT PASSWORD FORM */}
          {showForgot && (
            <div className="px-8 py-8">
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <input
                  placeholder="Username"
                  value={fpUsername}
                  onChange={(e) => setFpUsername(e.target.value)}
                  required
                  className="w-full rounded-xl bg-slate-900/60 px-3 py-2 text-slate-100"
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={fpNewPassword}
                  onChange={(e) => setFpNewPassword(e.target.value)}
                  required
                  className="w-full rounded-xl bg-slate-900/60 px-3 py-2 text-slate-100"
                />

                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={fpConfirmPassword}
                  onChange={(e) => setFpConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-xl bg-slate-900/60 px-3 py-2 text-slate-100"
                />

                <button
                  type="submit"
                  disabled={fpLoading}
                  className="w-full py-2 rounded-xl bg-emerald-400 text-slate-900 font-semibold"
                >
                  {fpLoading ? "Updating..." : "Reset Password"}
                </button>
              </form>
            </div>
          )}

          {/* INFO PANEL */}
          <div className="hidden md:flex flex-col justify-center px-8 py-8 border-l border-white/10 bg-slate-900/40 text-slate-300">
            Secure Banking Access
          </div>
        </div>
      </div>
    </div>
  );
}
