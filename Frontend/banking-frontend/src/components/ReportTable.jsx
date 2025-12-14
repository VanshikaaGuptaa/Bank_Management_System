// src/components/ReportTable.jsx
import React from "react";

export default function ReportTable({ data }) {
  if (!data) return null;

  const rows = Array.isArray(data) ? data : [data];
  if (!rows.length) return <p className="text-slate-300">No data found.</p>;

  const columns = Object.keys(rows[0] || {});

  return (
    <div className="mt-4 overflow-auto rounded-2xl border border-slate-700">
      <table className="min-w-full text-sm text-left text-slate-100">
        <thead className="bg-slate-800/70">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-2 font-semibold capitalize">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-800/50">
              {columns.map((col) => (
                <td key={col} className="px-4 py-2">
                  {String(row[col] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

