import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE, getBMByUserId, updateBMProfile, updateBM } from "../bankingApi";

export default function BankManagerProfile(){
  const userId = Number(localStorage.getItem("userId"));
  const [bmId, setBmId] = useState(null);
  const [bm, setBm] = useState(null);
  const [form, setForm] = useState({ username:'', fullName:'', email:'', phone:'', address:'', role:'', status:'' });
  const [imageFile, setImageFile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // password states for profile (requires current password)
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // otp system (dummy)
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState('');

  useEffect(()=> {
    const load = async () => {
      if(!userId) return;
      try {
        const res = await axios.get(`${API_BASE}/api/bm/by-user/${userId}`);
        const data = res.data;
        if(!data) { alert("BM not found"); return; }
        setBmId(data.bm_id || data.bmId || data.id);
        setBm(data);
        setForm({
          username: data.username || '',
          fullName: data.fullName || data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          role: data.role || '',
          status: data.status || ''
        });
      } catch (err) { console.error(err); alert("Failed to load profile"); }
    };
    load();
  }, [userId]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if(!bmId) return;
    try{
      setLoading(true);
      const fd = new FormData();
      fd.append('username', form.username);
      fd.append('fullName', form.fullName);
      fd.append('email', form.email);
      fd.append('phone', form.phone);
      fd.append('address', form.address);
      if(imageFile) fd.append('image', imageFile);
      await updateBMProfile(bmId, fd);
      alert("Profile updated");
      setEditing(false);
      // reload
      const res = await axios.get(`${API_BASE}/api/bm/${bmId}`);
      setBm(res.data);
    }catch(err){ console.error(err); alert("Update failed"); } finally { setLoading(false); }
  };

  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    setGeneratedOtp(String(otp));
    console.log("Dummy OTP (Change Password):", otp);
    alert("OTP printed to console (F12)"); // inform user
  };

  // Profile change password (must verify current password via login API)
  const handleChangePasswordWithCurrent = async (e) => {
    e.preventDefault();
    if (!generatedOtp) { alert("Generate OTP first"); return; }
    if (enteredOtp !== generatedOtp) { alert("Invalid OTP"); return; }
    if (newPassword !== confirmPassword) { alert("Passwords do not match"); return; }
    try {
      // verify current password via auth login endpoint
      await axios.post(`${API_BASE}/api/auth/login`, { username: form.username, password: oldPassword });
      // update using updateBM endpoint (PUT /api/bm/{id}) sending JSON { password: newPassword }
      await updateBM(bmId, { password: newPassword });
      alert("Password updated successfully");
      // cleanup
      setOldPassword(''); setNewPassword(''); setConfirmPassword(''); setEnteredOtp(''); setGeneratedOtp(null);
    } catch (err) {
      console.error(err);
      alert("Current password incorrect or update failed");
    }
  };

  // Forgot/Change from Login page will be handled separately using same update endpoint (no current password). You said use same updateRM API — on login flow call PUT /api/bm/{bmId} with { password: newPassword } after OTP verification.

  if(!bm) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Profile</h2>

      {bmId && (
        <img
          src={`${API_BASE}/api/bm/${bmId}/profile-image?t=${Date.now()}`}
          alt="Profile"
          onError={e => e.target.style.display = 'none'}
          style={{ width:120, height:120, borderRadius:'50%', objectFit:'cover', border:'2px solid #444' }}
        />
      )}

      {!editing ? (
        <>
          <p><b>Username:</b> {bm.username}</p>
          <p><b>Name:</b> {bm.fullName || bm.full_name}</p>
          <p><b>Email:</b> {bm.email}</p>
          <p><b>Phone:</b> {bm.phone}</p>
          <p><b>Address:</b> {bm.address}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </>
      ) : (
        <form onSubmit={handleProfileSubmit}>
          <label>Username <input value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required/></label>
          <label>Full Name <input value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} /></label>
          <label>Email <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></label>
          <label>Phone <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></label>
          <label>Address <input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} /></label>
          <label>Profile Image <input type="file" accept="image/*" onChange={e=>setImageFile(e.target.files[0])} /></label>
          <button type="submit">Save Profile</button>
          <button type="button" onClick={()=>setEditing(false)}>Cancel</button>
        </form>
      )}

      <hr />

      <h3>Change Password</h3>
      <form onSubmit={handleChangePasswordWithCurrent}>
        <label>Current Password<input type="password" value={oldPassword} onChange={e=>setOldPassword(e.target.value)} required/></label>
        <label>New Password<input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required/></label>
        <label>Confirm Password<input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required/></label>

        <div>
          <button type="button" onClick={generateOtp}>Generate OTP</button>
        </div>
        <label>Enter OTP<input value={enteredOtp} onChange={e=>setEnteredOtp(e.target.value)} required/></label>
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}
