import React, { useState } from "react";
import { createBankManager } from "../bankingApi";

export default function CreateBankManager() {
  const [form, setForm] = useState({ username:'', password:'', email:'', phone:'', fullName:'', branch:'', rmId: ''});
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dto = {
        username: form.username,
        password: form.password,
        email: form.email,
        phone: form.phone,
        fullName: form.fullName,
        role: "BankManager",
        status: "Pending",
        branch: form.branch,
        rmId: form.rmId ? Number(form.rmId) : null,
        address: ""
      };
      await createBankManager(dto);
      alert("Bank Manager created (pending approval)");
      setForm({ username:'', password:'', email:'', phone:'', fullName:'', branch:'', rmId:'' });
    } catch (err) {
      console.error(err); alert("Failed to create");
    } finally { setLoading(false); }
  };

  return (
    <div className="container">
      <h2>Create Bank Manager</h2>
      <form onSubmit={submit}>
        <label>Username<input value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required/></label>
        <label>Password<input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></label>
        <label>Full name<input value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} required/></label>
        <label>Email<input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></label>
        <label>Phone<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></label>
        <label>Branch<input value={form.branch} onChange={e=>setForm({...form,branch:e.target.value})} /></label>
        <label>RM Id (optional)<input value={form.rmId} onChange={e=>setForm({...form,rmId:e.target.value})} /></label>
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
      </form>
    </div>
  );
}