
import React, { useState } from "react";
import axiosInstance from "../api/axios";     // <-- correct axios instance
import { useNavigate } from "react-router-dom";

export default function CustomerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function loginHandler() {
    try {
      const res = await axiosInstance.post(
        "http://localhost:9191/api/auth/login",
        { username, password }
      );

      const data = res.data;

      // SAVE LOGIN SESSION DATA
      localStorage.setItem("accessToken", data.accessToken || data.token);
      localStorage.setItem("refreshToken", data.refreshToken || "");
      localStorage.setItem("userId", data.userId || "");
      localStorage.setItem("fullName", data.fullName || "");
      localStorage.setItem("role", data.role || "Customer");

      // FIRST TIME LOGIN → MUST CHANGE PASSWORD
      if (data.tempPassword === true || data.message === "TempPassword") {
        navigate("/customer-first-password-change");
        return;
      }

      // NORMAL LOGIN → GO TO DASHBOARD
      navigate("/customer-dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid credentials or server error");
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>Login as CUSTOMER</h2>

      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={loginHandler}>Login</button>
      </div>
    </div>
  );
}