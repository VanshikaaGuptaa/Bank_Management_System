// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getCustomerByCustId, updateProfile } from "../api/customerApi";

// export default function EditProfile() {
//   const navigate = useNavigate();
//   const custId = localStorage.getItem("custId");

//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     phone: ""
//   });

//   useEffect(() => {
//     load();
//   }, []);

//   async function load() {
//     const res = await getCustomerByCustId(custId);
//     const u = res.data.user;

//     setForm({
//       fullName: u.fullName,
//       email: u.email,
//       phone: u.phone
//     });
//   }

//   async function save() {
//     try {
//       await updateProfile(custId, form);
//       alert("Profile updated!");
//       navigate("/customer/profile");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update profile");
//     }
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       <h3>Edit Profile</h3>

//       <label>Name:</label>
//       <input
//         value={form.fullName}
//         onChange={(e) => setForm({ ...form, fullName: e.target.value })}
//       />

//       <label>Email:</label>
//       <input
//         value={form.email}
//         onChange={(e) => setForm({ ...form, email: e.target.value })}
//       />

//       <label>Phone:</label>
//       <input
//         value={form.phone}
//         onChange={(e) => setForm({ ...form, phone: e.target.value })}
//       />

//       <button onClick={save}>Save</button>
//       <button onClick={() => navigate(-1)}>Cancel</button>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { getCustomerByCustId, updateProfile } from "../api/customerApi";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  const custId = localStorage.getItem("custId");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await getCustomerByCustId(custId);
        const u = res.data.user;

        setForm({
          fullName: u.fullName,
          email: u.email,
          phone: u.phone
        });
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [custId]);

  async function save() {
    try {
      await updateProfile(custId, form);
      alert("Profile updated successfully!");
      navigate("/customer/profile");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Edit Profile</h3>

      <label>Name:</label>
      <input
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
      />

      <label>Email:</label>
      <input
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <label>Phone:</label>
      <input
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <button onClick={save}>Save</button>
      <button onClick={() => navigate(-1)} style={{ marginLeft: 10 }}>
        Cancel
      </button>
    </div>
  );
}