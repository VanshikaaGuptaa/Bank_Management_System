import { useEffect, useState } from "react";
import {
  getTempBankManagersForRm,
  approveTempBankManager,
  disapproveTempBankManager,
} from "../api/bankingApi";
import RMLayout from "../layouts/RMLayout";   // adjust path if needed

export default function ApproveBankManager() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const rmUserId = localStorage.getItem("userId");

  const load = async () => {
    try {
      setLoading(true);
      const data = await getTempBankManagersForRm(rmUserId);
      setList(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load pending Bank Managers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (bm) => {
    const tempBmId = bm.tempBmId;
    const comment = window.prompt("Comment (optional):", "") || "";
    try {
      await approveTempBankManager(tempBmId, comment);
      alert("Bank Manager approved");
      load();
    } catch (err) {
      console.error(err);
      alert("Approve failed");
    }
  };

  const handleDisapprove = async (bm) => {
    const tempBmId = bm.tempBmId;
    const comment = window.prompt("Comment (reason for disapprove):", "") || "";
    try {
      await disapproveTempBankManager(tempBmId, comment);
      alert("Bank Manager disapproved");
      load();
    } catch (err) {
      console.error(err);
      alert("Disapprove failed");
    }
  };

  return (
    <RMLayout active="approve-bm">
      <h1 className="text-3xl font-bold text-emerald-400 mb-6">
        Approve Bank Managers
      </h1>

      {loading && <p className="text-slate-300">Loading...</p>}
      {!loading && list.length === 0 && (
        <p className="text-slate-300">No pending Bank Managers.</p>
      )}

      {!loading && list.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-slate-900/60 shadow-lg border border-slate-800">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800/80 text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">Temp ID</th>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">Full Name</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((bm) => (
                <tr
                  key={bm.tempBmId || bm.id}
                  className="border-t border-slate-800 hover:bg-slate-800/60"
                >
                  <td className="px-4 py-3 text-slate-200">{bm.tempBmId || bm.id}</td>
                  <td className="px-4 py-3 text-slate-200">{bm.username}</td>
                  <td className="px-4 py-3 text-slate-200">{bm.fullName}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleApprove(bm)}
                      className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDisapprove(bm)}
                      className="px-3 py-1 rounded-lg bg-rose-500 text-slate-900 font-semibold hover:bg-rose-400"
                    >
                      Disapprove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </RMLayout>
  );
}