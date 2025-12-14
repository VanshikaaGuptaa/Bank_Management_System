// src/pages/ChangePassword.jsx
import React, { useState } from "react";
import { changePassword } from "../api/customerApi";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();

  const savedUsername = localStorage.getItem("tempUsername") || "";
  const [username, setUsername] = useState(savedUsername);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await changePassword({ username, oldPassword, newPassword });

      alert(res.data); // "Password updated. Account is now ACTIVE."

      // Remove temp flag  
      localStorage.removeItem("tempUsername");

      // Go back to login  
      navigate("/customer-login");
    } catch (err) {
      console.log(err);

      alert(err.response?.data || "Password change failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 450, margin: "auto" }}>
      <h2>Change Password</h2>

      <form onSubmit={handleSubmit}>

        <label>Username:</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Old Password (TEMP password):</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading} style={{ marginTop: 15 }}>
          {loading ? "Updating..." : "Update Password"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/customer-login")}
          style={{ marginLeft: 10 }}
        >
          Back
        </button>

      </form>
    </div>
  );
}
