import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function AdminLogin() {
  const { role } = useParams(); // rm / bm / be
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function loginHandler() {
    try {
      const res = await axios.post("/auth/login", { username, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("fullName", res.data.fullName);
      localStorage.setItem("role", role);

      if (role === "rm") navigate("/rm-dashboard");
      if (role === "bm") navigate("/bm-dashboard");
      if (role === "be") navigate("/be-dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    }
  }

  const roleLabel =
    role === "rm" ? "Regional Manager"
    : role === "bm" ? "Branch Manager"
    : role === "be" ? "Bank Employee"
    : "Admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
        <h1 className="text-3xl font-semibold text-white text-center mb-2">
          {roleLabel} Login
        </h1>
        <p className="text-slate-300 text-center mb-8 text-sm">
          Enter your admin credentials to access the dashboard.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-200 mb-1">
              Username
            </label>
            <input
              className="w-full rounded-xl bg-slate-900/60 border border-slate-600 px-3 py-2 text-slate-100
                         focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                         placeholder:text-slate-500 text-sm"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-200 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl bg-slate-900/60 border border-slate-600 px-3 py-2 text-slate-100
                         focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400
                         placeholder:text-slate-500 text-sm"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={loginHandler}
            className="w-full mt-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400
                       text-slate-900 font-semibold text-sm shadow-lg shadow-emerald-500/30
                       disabled:opacity-60 disabled:cursor-not-allowed transition"
            disabled={!username || !password}
          >
            Login
          </button>
        </div>

        <p className="text-xs text-slate-400 text-center mt-4">
          You’re logging in as <span className="font-medium text-emerald-300">{roleLabel}</span>.
        </p>
      </div>
    </div>
  );
}