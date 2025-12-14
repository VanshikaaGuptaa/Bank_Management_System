// // src/pages/CustomerLogin.jsx
// import React, { useState } from "react";
// import axiosInstance from "../api/axios"; // instance defined earlier
// import { useNavigate } from "react-router-dom";

// export default function CustomerLogin() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   async function loginHandler() {
//     try {
//       const res = await axiosInstance.post("/auth/login", { username, password });
//       // backend response shape in your screenshot included: accessToken, userId, fullName, role
//       const data = res.data;
//       localStorage.setItem("accessToken", data.accessToken || data.token || "");
//       localStorage.setItem("refreshToken", data.refreshToken || "");
//       localStorage.setItem("userId", data.userId || "");
//       localStorage.setItem("fullName", data.fullName || data.fullname || data.username || "");
//       localStorage.setItem("role", data.role || "Customer");

//       // decide where to go
//       // If backend returns a flag that the password is temporary, you should detect it. If backend doesn't return, we will try a safe flow:
//       // if password equals "temp..." you could force change. Here I'll redirect to change-password route only when backend signals it (res.data.tempPassword === true)
//       if (data.tempPassword === true || data.message === "TempPassword") {
//         navigate("/customer/change-password");
//       } else {
//         navigate("/customer-dashboard");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Invalid credentials or server error");
//     }
//   }

//   return (
//     <div style={{ textAlign: "center", marginTop: 100 }}>
//       <h2>Login as CUSTOMER</h2>
//       <div style={{ marginTop: 20 }}>
//         <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
//       </div>
//       <div style={{ marginTop: 10 }}>
//         <input
//           type="password"
//           placeholder="Password"
//           onChange={(e) => setPassword(e.target.value)}
//         />
//       </div>
//       <div style={{ marginTop: 12 }}>
//         <button onClick={loginHandler}>Login</button>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import axiosInstance from "../api/axios";     // <-- correct axios instance
import { useNavigate } from "react-router-dom";

export default function CustomerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function loginHandler() {
    try {
      const res = await axiosInstance.post(
        "http://localhost:9191/api/auth/login",
        { username, password }
      );

      const data = res.data;

      // SAVE LOGIN SESSION DATA
      localStorage.setItem("accessToken", data.accessToken || data.token);
      localStorage.setItem("refreshToken", data.refreshToken || "");
      localStorage.setItem("userId", data.userId || "");
      localStorage.setItem("fullName", data.fullName || "");
      localStorage.setItem("role", data.role || "Customer");

      // FIRST TIME LOGIN → MUST CHANGE PASSWORD
      if (data.tempPassword === true || data.message === "TempPassword") {
        navigate("/customer-first-password-change");
        return;
      }

      // NORMAL LOGIN → GO TO DASHBOARD
      navigate("/customer-dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid credentials or server error");
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>Login as CUSTOMER</h2>

      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={loginHandler}>Login</button>
      </div>
    </div>
  );
}