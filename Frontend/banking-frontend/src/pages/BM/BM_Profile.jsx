// src/pages/BM_Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import BMLayout from "../../layouts/BMLayout";

const API_BASE = "http://localhost:9191";

export default function BM_Profile() {
  const userId = Number(localStorage.getItem("userId"));

  const [bmId, setBmId] = useState(null);
  const [bm, setBm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    status: "",
  });

  // change password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // load profile
  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      try {
        setLoading(true);

        const resAll = await axios.get(`${API_BASE}/api/bank-managers`);
        const list = resAll.data || [];

        const row = list.find((r) => {
          const uid = r.userId ?? r.user_id ?? r.userid;
          return uid === userId;
        });

        if (!row) {
          alert("Bank Manager not found for current user");
          return;
        }

        const id = row.bmId ?? row.bmid ?? row.id;
        setBmId(id);

        const res = await axios.get(`${API_BASE}/api/bank-managers/${id}`);
        const data = res.data;

        setBm(data);
        setForm({
          username: data.username || "",
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          role: data.role || "",
          status: data.status || "",
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!bmId) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      if (imageFile) formData.append("image", imageFile);

      await axios.put(
        `${API_BASE}/api/bank-managers/${bmId}/profile`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Profile updated");
      setEditing(false);

      const res = await axios.get(`${API_BASE}/api/bank-managers/${bmId}`);
      setBm(res.data);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    setGeneratedOtp(otp.toString());
    console.log("Dummy OTP (BM change password):", otp);
    alert("OTP printed in browser console (F12 → Console)");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!generatedOtp) {
      alert("Generate OTP first");
      return;
    }
    if (enteredOtp !== generatedOtp) {
      alert("Invalid OTP");
      return;
    }

    try {
      await axios.post(`${API_BASE}/api/auth/login`, {
        username: form.username,
        password: oldPassword,
      });

      await axios.put(`${API_BASE}/api/bank-managers/${bmId}`, {
        password: newPassword,
      });

      alert("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setEnteredOtp("");
      setGeneratedOtp(null);
    } catch (err) {
      console.error(err);
      alert("Current password is incorrect");
    }
  };

  if (loading && !bm) {
    return (
      <BMLayout active="profile">
        <p className="text-slate-300">Loading...</p>
      </BMLayout>
    );
  }

  if (!bm) {
    return (
      <BMLayout active="profile">
        <p className="text-slate-300">No profile loaded</p>
      </BMLayout>
    );
  }

  return (
    <BMLayout active="profile">
      <h1 className="text-3xl font-bold text-emerald-400 mb-6">
        Bank Manager Profile
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: info & edit */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={`${API_BASE}/api/bank-managers/${bmId}/profile-image?${Date.now()}`}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-slate-600"
              onError={(e) => (e.target.style.display = "none")}
            />
            <div>
              <p className="text-lg font-semibold">{bm.fullName}</p>
              <p className="text-sm text-slate-400">{bm.username}</p>
              <p className="text-xs text-slate-500 mt-1">
                Role: {bm.role} • Status: {bm.status}
              </p>
            </div>
          </div>

          {!editing ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-2 text-sm">
              <p>
                <span className="font-semibold text-slate-200">Email:</span>{" "}
                {bm.email}
              </p>
              <p>
                <span className="font-semibold text-slate-200">Phone:</span>{" "}
                {bm.phone}
              </p>
              <p>
                <span className="font-semibold text-slate-200">Address:</span>{" "}
                {bm.address}
              </p>

              <button
                onClick={() => setEditing(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-100 text-slate-950 font-semibold shadow hover:bg-slate-200"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleUpdateProfile}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 text-sm"
            >
              <div>
                <label className="block text-xs mb-1">Username</label>
                <input
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  required
                  className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Full Name</label>
                <input
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  required
                  className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Email</label>
                <input
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                  className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  required
                  className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Address</label>
                <input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  required
                  className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="block w-full text-xs text-slate-300"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-950 font-semibold shadow hover:bg-slate-200 disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save Profile"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-700 text-slate-100 hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* RIGHT: change password */}
        <div className="w-full lg:w-96">
          <h3 className="text-lg font-semibold mb-3">Change Password</h3>

          <form
            onSubmit={handleChangePassword}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3 text-sm"
          >
            <div>
              <label className="block text-xs mb-1">Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
                className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <button
              type="button"
              onClick={generateOtp}
              className="w-full mt-1 py-2 rounded-xl bg-slate-100 text-slate-950 font-semibold shadow hover:bg-slate-200"
            >
              Generate OTP
            </button>

            <div>
              <label className="block text-xs mb-1 mt-2">Enter OTP</label>
              <input
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                required
                className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2 rounded-xl bg-slate-100 text-slate-950 font-semibold shadow hover:bg-slate-200"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </BMLayout>
  );
}