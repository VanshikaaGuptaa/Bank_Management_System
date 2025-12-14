import React, { useState } from "react";
import axios from "axios";
import RMLayout from "../layouts/RMLayout";
import ReportTable from "../components/ReportTable";

const API_BASE = "http://localhost:9191";

export default function RM_TransactionTrendsReport() {
  const [fromDate, setFromDate] = useState("2025-11-01");
  const [toDate, setToDate] = useState("2025-12-01");
  const [trendType, setTrendType] = useState("weekly");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const runReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE}/api/transactions/report/trends`,
        { params: { fromDate, toDate, trendType } }
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load Transaction Trends Report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RMLayout activeKey="report-trends">
      <h2 className="text-2xl font-semibold text-slate-50">
        Transaction Trends Report
      </h2>
      <p className="mt-1 text-sm text-slate-300">
        Shows transaction volume and amount trends between two dates.
      </p>

      <form
        className="mt-4 flex flex-wrap gap-4 items-end"
        onSubmit={(e) => {
          e.preventDefault();
          runReport();
        }}
      >
        <div>
          <label className="block text-xs text-slate-300 mb-1">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-300 mb-1">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-300 mb-1">
            Trend Type
          </label>
          <select
            value={trendType}
            onChange={(e) => setTrendType(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
          >
            <option value="daily">daily</option>
            <option value="weekly">weekly</option>
            <option value="monthly">monthly</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-2xl text-sm font-semibold bg-emerald-400 text-black hover:bg-emerald-300"
        >
          Run Report
        </button>
      </form>

      {loading ? (
        <p className="mt-4 text-slate-300">Loading…</p>
      ) : (
        <ReportTable data={data} />
      )}
    </RMLayout>
  );
}

