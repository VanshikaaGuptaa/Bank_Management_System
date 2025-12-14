// src/pages/BE_Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import BELayout from "../layouts/BELayout";

const API_BASE = "http://localhost:9191";

export default function BE_Profile() {
  const userId = Number(localStorage.getItem("userId"));

  const [beId, setBeId] = useState(null);
  const [be, setBe] = useState(null);
  const [editing, setEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    status: "",
  });

  // ---------- LOAD PROFILE (resolve beId from userId) ----------
  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      try {
        setLoading(true);

        const resAll = await axios.get(`${API_BASE}/api/bank-employees`);
        const list = resAll.data || [];

        const beRow = list.find((r) => {
          const uid = r.userId ?? r.user_id ?? r.userid;
          return uid === userId;
        });

        if (!beRow) {
          alert("Bank Employee not found for current user");
          return;
        }

        const id = beRow.beId ?? beRow.be_id ?? beRow.id;
        setBeId(id);

        const res = await axios.get(`${API_BASE}/api/bank-employees/${id}`);
        const data = res.data;

        setBe(data);
        setForm({
          username: data.username || "",
          fullName: data.fullName || data.full_name || "",
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
    if (!beId) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.put(
        `${API_BASE}/api/bank-employees/${beId}/profile`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Profile updated");
      setEditing(false);

      const res = await axios.get(`${API_BASE}/api/bank-employees/${beId}`);
      const data = res.data;
      setBe(data);
      setForm({
        username: data.username || "",
        fullName: data.fullName || data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        role: data.role || "",
        status: data.status || "",
      });
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BELayout active="profile">
      {loading && !be && <p>Loading profile...</p>}
      {!loading && !be && <p>No profile found.</p>}
      {be && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-6 mb-6">
            {beId && (
              <img
                src={`${API_BASE}/api/bank-employees/${beId}/profile-image?${Date.now()}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-emerald-400/70"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-slate-50">
                {be.fullName || be.full_name}
              </h2>
              <p className="text-sm text-slate-400">
                Username: <span className="text-slate-100">{be.username}</span>
              </p>
              <p className="text-xs mt-1 text-slate-400 uppercase tracking-[0.2em]">
                {be.role} • {be.status}
              </p>
            </div>
          </div>

          {!editing ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                <p>
                  <span className="text-slate-400">Email</span>
                  <br />
                  <span className="font-medium text-slate-100">{be.email}</span>
                </p>
                <p>
                  <span className="text-slate-400">Phone</span>
                  <br />
                  <span className="font-medium text-slate-100">{be.phone}</span>
                </p>
                <p className="sm:col-span-2">
                  <span className="text-slate-400">Address</span>
                  <br />
                  <span className="font-medium text-slate-100">
                    {be.address}
                  </span>
                </p>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="rounded-2xl bg-slate-100 text-slate-900 px-4 py-2 text-sm font-semibold shadow hover:bg-white transition"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form
              onSubmit={handleUpdateProfile}
              className="space-y-4 text-sm max-w-xl"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-slate-300">Username</span>
                  <input
                    className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/60"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-slate-300">Full Name</span>
                  <input
                    className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/60"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-slate-300">Email</span>
                  <input
                    type="email"
                    className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/60"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-slate-300">Phone</span>
                  <input
                    className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/60"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    required
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-slate-300">Address</span>
                <input
                  className="mt-1 w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500/60"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  required
                />
              </label>

              <label className="block">
                <span className="text-slate-300">Profile Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="mt-1 block w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-slate-100 file:text-slate-900 hover:file:bg-white"
                />
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="rounded-2xl bg-slate-100 text-slate-900 px-4 py-2 text-sm font-semibold shadow hover:bg-white transition"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setImageFile(null);
                  }}
                  className="rounded-2xl bg-slate-800 text-slate-100 px-4 py-2 text-sm font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </BELayout>
  );
}