import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:9191";

export default function BE_ResetPassword() {
  const userId = Number(localStorage.getItem("userId"));
  const [beId, setBeId] = useState(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --------------------------------------------------
  //  Load beId using the same logic as BE_Profile
  // --------------------------------------------------
  useEffect(() => {
    const loadBe = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/bank-employees`);
        const list = res.data || [];

        // find row matching logged-in userId
        const row = list.find(r => {
          const uid = r.userId ?? r.user_id ?? r.userid;
          return uid === userId;
        });

        if (!row) {
          alert("Bank Employee not found for this user!");
          return;
        }

        // support multiple BE id field names
        const id = row.beId ?? row.be_id ?? row.id;

        setBeId(id);
      } catch (err) {
        console.error(err);
        alert("Failed to resolve Bank Employee ID");
      }
    };

    loadBe();
  }, [userId]);

  // --------------------------------------------------
  //  Reset password using EXISTING UPDATE API
  // --------------------------------------------------
  const handleReset = async () => {
    if (!beId) {
      alert("BE ID not resolved yet");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.put(`${API_BASE}/api/bank-employees/${beId}`, {
        oldPassword,
        newPassword,
      });

      alert("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert("Failed to update password!");
    }
  };

  return (
    <div className="form-container">
      <h2>Reset Password</h2>

      <input
        type="password"
        placeholder="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={handleReset}>Update Password</button>
    </div>
  );
}