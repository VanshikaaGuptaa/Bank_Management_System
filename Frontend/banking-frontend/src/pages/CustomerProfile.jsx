// src/pages/CustomerProfile.jsx
import React, { useEffect, useState } from "react";
import { getCustomerByCustId } from "../api/customerApi";
import CustomerLayout from "../layouts/CustomerLayout";

export default function CustomerProfile() {
  const custId = localStorage.getItem("custId");
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    async function load() {
      if (!custId) return;
      try {
        const res = await getCustomerByCustId(custId);
        setCustomer(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [custId]);

  const u = customer?.user || customer || {};

  return (
    <CustomerLayout active="profile">
      <div className="max-w-xl bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Profile</h2>

        {!customer ? (
          <p className="text-sm text-slate-300">No profile loaded.</p>
        ) : (
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-slate-400">Name:</span>{" "}
              <span className="font-medium text-slate-50">
                {u.fullName}
              </span>
            </p>
            <p>
              <span className="text-slate-400">Email:</span>{" "}
              <span className="font-medium text-slate-50">
                {u.email}
              </span>
            </p>
            <p>
              <span className="text-slate-400">Phone:</span>{" "}
              <span className="font-medium text-slate-50">
                {u.phone}
              </span>
            </p>
            {u.dob && (
              <p>
                <span className="text-slate-400">Date of Birth:</span>{" "}
                <span className="font-medium text-slate-50">
                  {u.dob}
                </span>
              </p>
            )}
          </div>
        )}

        <p className="mt-4 text-xs text-slate-400">
          To edit your personal details, please contact your branch or use the
          edit option (if enabled) in your profile section.
        </p>
      </div>
    </CustomerLayout>
  );
}