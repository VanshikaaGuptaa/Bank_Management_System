import { useEffect, useState } from "react";
import { getAllBranches } from "../api/bankingApi";
import RMLayout from "../layouts/RMLayout";

export default function ViewBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAllBranches();
        setBranches(data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load branches");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <RMLayout active="branches">
      <h1 className="text-3xl font-bold text-emerald-400 mb-6">Branches</h1>

      {loading && <p className="text-slate-300">Loading...</p>}

      {!loading && branches.length === 0 && (
        <p className="text-slate-300">No branches found.</p>
      )}

      {!loading && branches.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-slate-900/60 shadow-lg border border-slate-800">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800/80 text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Address</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => (
                <tr
                  key={b.id || b.branchId}
                  className="border-t border-slate-800 hover:bg-slate-800/60 text-slate-100"
                >
                  <td className="px-4 py-3 text-slate-100">
                    {b.branch_code || b.branchCode}
                  </td>
                  <td className="px-4 py-3 text-slate-100">
                    {b.branch_name || b.branchName}
                  </td>
                  <td className="px-4 py-3 text-slate-100">{b.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </RMLayout>
  );
}