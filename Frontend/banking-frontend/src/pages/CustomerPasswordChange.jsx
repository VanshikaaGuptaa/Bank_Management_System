// src/pages/CustomerPasswordChange.jsx
import React, { useState } from "react";
import { changePassword } from "../api/customerApi";
import { useNavigate } from "react-router-dom";

export default function CustomerPasswordChange() {
  const [usernameOrAcc, setUsernameOrAcc] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  async function handleChange() {
    try {
      // API: /customers/change-password
      await changePassword({
        username: usernameOrAcc,
        oldPassword,
        newPassword,
      });
      alert("Password changed. Please login with new password.");
      navigate("/login?role=CUSTOMER");
    } catch (err) {
      console.error(err);
      alert("Failed to change password");
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <h2>Change Password</h2>
      <div style={{ marginTop: 12 }}>
        <input placeholder="username or account no" onChange={(e) => setUsernameOrAcc(e.target.value)} />
      </div>
      <div style={{ marginTop: 12 }}>
        <input type="password" placeholder="old password" onChange={(e) => setOldPassword(e.target.value)} />
      </div>
      <div style={{ marginTop: 12 }}>
        <input type="password" placeholder="new password" onChange={(e) => setNewPassword(e.target.value)} />
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={handleChange}>Change Password</button>
      </div>
    </div>
  );
}
