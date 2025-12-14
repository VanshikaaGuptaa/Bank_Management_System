// src/pages/ApproveBankEmployee.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import BMLayout from "../layouts/BMLayout";

const API_BASE = "http://localhost:9191";

export default function ApproveBankEmployee() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bmId, setBmId] = useState(null);

  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    const init = async () => {
      let id = null;

      try {
        // fetch all bank managers and resolve bmId from userId
        const resAll = await axios.get(`${API_BASE}/api/bank-managers`);
        const list = resAll.data || [];
        const row = list.find((r) => {
          const uid = r.userId ?? r.user_id ?? r.userid;
          return uid === userId;
        });
        if (row) {
          id = row.bmId ?? row.bmid ?? row.id;
        }
      } catch (err) {
        console.warn("Failed to resolve bmId from /api/bank-managers", err);
      }

      if (!id) {
        alert(
          "Could not determine Bank Manager id (bmId). Please login again or contact admin."
        );
        return;
      }

      setBmId(id);
    };

    if (userId) init();
  }, [userId]);

  useEffect(() => {
    if (!bmId) return;
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bmId]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/api/bank-managers/temp-bank-employees/${bmId}`
      );
      setEmployees(res.data || []);
    } catch (err) {
      console.error("Failed to load temp bank employees", err);
      alert("Failed to load employees. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (emp, approve) => {
    if (
      !window.confirm(
        `Are you sure you want to ${
          approve ? "approve" : "disapprove"
        } this employee?`
      )
    )
      return;

    try {
      const url = `${API_BASE}/api/bank-managers/${
        emp.tempBeId ?? emp.temp_be_id ?? emp.id
      }/${approve ? "approve" : "disapprove"}`;
      await axios.post(url);
      alert(`Employee ${approve ? "approved" : "disapproved"} successfully`);

      console.log("------ DUMMY EMAIL ------");
      console.log("To      :", emp.email);
      console.log(
        "Subject :",
        approve ? "Employee Approved" : "Employee Disapproved"
      );
      console.log(
        "Message :",
        approve
          ? "Your Employee Account has been approved by Bank Manager."
          : "Your Employee Account has been disapproved by Bank Manager."
      );
      console.log("-------------------------");

      loadEmployees();
    } catch (err) {
      console.error("Action failed", err);
      alert("Action failed - check console.");
    }
  };

  return (
    <BMLayout active="employees">
      <h1 className="text-3xl font-bold text-emerald-400 mb-6">
        Approve / Disapprove Employees
      </h1>

      {!bmId && (
        <p className="text-slate-300 mb-4">
          Resolving Bank Manager Id from your login…
        </p>
      )}

      {bmId && (
        <p className="text-xs text-slate-500 mb-4">
          Bank Manager Id: <span className="text-slate-300">{bmId}</span>
        </p>
      )}

      {loading && <p className="text-slate-300">Loading employees…</p>}

      {!loading && employees.length === 0 && (
        <p className="text-slate-300">No pending employees found.</p>
      )}

      {!loading && employees.length > 0 && (
        <div className="overflow-x-auto rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800/80 text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">Temp ID</th>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">Full Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const tempId = emp.tempBeId ?? emp.temp_be_id ?? emp.id;
                return (
                  <tr
                    key={tempId}
                    className="border-t border-slate-800 hover:bg-slate-800/60"
                  >
                    <td className="px-4 py-3">{tempId}</td>
                    <td className="px-4 py-3">{emp.username}</td>
                    <td className="px-4 py-3">
                      {emp.fullName ?? emp.full_name}
                    </td>
                    <td className="px-4 py-3">{emp.email}</td>
                    <td className="px-4 py-3">{emp.phone}</td>
                    <td className="px-4 py-3">{emp.status}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => handleAction(emp, true)}
                        className="rounded-xl bg-slate-100 text-slate-950 px-3 py-1 text-xs font-semibold shadow hover:bg-slate-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(emp, false)}
                        className="rounded-xl bg-slate-100 text-slate-950 px-3 py-1 text-xs font-semibold shadow hover:bg-slate-200"
                      >
                        Disapprove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </BMLayout>
  );
}