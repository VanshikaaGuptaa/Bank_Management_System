import { useEffect, useState } from "react";
import axios from "axios";
import RMLayout from "../layouts/RMLayout";

const API_BASE = "http://localhost:9191";

export default function CreateBranch() {
  const userId = Number(localStorage.getItem("userId"));

  const [form, setForm] = useState({
    branch_name: "",
    branch_code: "",
    address: "",
    type: "",
    rmid: null,
  });
  const [loading, setLoading] = useState(false);

  // Resolve RM id for current user
  useEffect(() => {
    const fetchRmId = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/rm`);
        const all = res.data || [];

        const rm = all.find((r) => {
          const uid = r.userId ?? r.user_id ?? r.userid;
          return uid === userId;
        });

        if (!rm) {
          alert("Could not find Regional Manager record for current user.");
          return;
        }

        const rmIdValue = rm.rmId ?? rm.rmid ?? rm.id;
        setForm((f) => ({ ...f, rmid: rmIdValue }));
      } catch (err) {
        console.error("Failed to resolve RM id:", err);
        alert("Failed to resolve RM id for current user.");
      }
    };

    if (userId) fetchRmId();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rmid) {
      alert("RM id not resolved yet, please wait.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        branch_name: form.branch_name,
        branch_code: form.branch_code,
        address: form.address,
        type: form.type,
        rmid: Number(form.rmid),
      };

      await axios.post(`${API_BASE}/api/rm/createbranch`, payload);

      alert("Branch created successfully");
      setForm((f) => ({
        ...f,
        branch_name: "",
        branch_code: "",
        address: "",
        type: "",
      }));
    } catch (err) {
      console.error("Create branch error:", err);
      alert("Failed to create branch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RMLayout active="create-branch">
      <h1 className="text-3xl font-bold text-emerald-400 mb-6">
        Create Branch
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg"
      >
        <div>
          <label className="block text-sm mb-1 text-slate-100">Branch Name</label>
          <input
            name="branch_name"
            value={form.branch_name}
            onChange={handleChange}
            required
            className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-100">Branch Code</label>
          <input
            name="branch_code"
            value={form.branch_code}
            onChange={handleChange}
            required
            className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-100">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-100">Type</label>
          <input
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {form.rmid && (
          <p className="text-xs text-slate-100 text-slate-100">
            <span className="font-semibold text-slate-100">RM ID (auto):</span>{" "}
            {form.rmid}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !form.rmid}
          className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-150 font-semibold shadow-md hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Branch"}
        </button>
      </form>
    </RMLayout>
  );
}