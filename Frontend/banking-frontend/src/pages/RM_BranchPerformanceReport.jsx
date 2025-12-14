import React, { useEffect, useState } from "react";
import axios from "axios";
import RMLayout from "../layouts/RMLayout";
import ReportTable from "../components/ReportTable";

const API_BASE = "http://localhost:9191";

export default function RM_BranchPerformanceReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE}/api/branches/report/performance`
        );
        setData(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load Branch Performance Report");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <RMLayout activeKey="report-branch">
      <h2 className="text-2xl font-semibold text-slate-50">
        Branch Performance Report
      </h2>
      <p className="mt-1 text-sm text-slate-300">
        Summarizes account openings, transactions and revenue per branch.
      </p>

      {loading ? (
        <p className="mt-4 text-slate-300">Loading…</p>
      ) : (
        <ReportTable data={data} />
      )}
    </RMLayout>
  );
}