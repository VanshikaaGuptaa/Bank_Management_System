// import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import RoleSelection from "./pages/RoleSelection";
//  import RM_Dashboard from "./pages/RM_Dashboard";
//  import ProtectedRoute from "./router/ProtectedRoute";
// // add Dashboard later

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/admin-role" element={<RoleSelection />} />
//       <Route path="/login" element={<Login />} />
//      <Route path="/rm-dashboard" element={
//   <ProtectedRoute><RM_Dashboard /></ProtectedRoute>
// } />
//     </Routes>
//   );
// }
import {  Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import AdminRoleSelect from "./pages/AdminRoleSelect";
import AdminLogin from "./pages/AdminLogin";
import RM_Dashboard from "./pages/RM_Dashboard";
import BM_Dashboard from "./pages/BM/BM_Dashboard";
import BE_Dashboard from "./pages/BE_Dashboard";
import Login from "./pages/Login"; // customer login
import ApproveBankManager from "./pages/ApproveBankManager";
import ApproveBankEmployee from "./pages/ApproveBankEmployee";
import ViewBranches from "./pages/ViewBranches";

import ViewCustomers from "./pages/BM/ViewCustomers";
 import LoanRequests from "./pages/BM/LoanRequests";
// import ApproveBE from "./pages/BM/ApproveBE";
import RoleSelection from "./pages/RoleSelection";
import Profile from "./pages/Profile";
import ApproveLoan from "./pages/ApproveLoan";
import CreateBranch from "./pages/CreateBranch";
import "./App.css";
import "./index.css";


export default function App() {

  return (
    
      <Routes>

        {/* HOME */}
        <Route path="/" element={<RoleSelection/>} />

        {/* ADMIN FLOW */}
        <Route path="/admin-role" element={<AdminRoleSelect />} />
        <Route path="/admin-login/:role" element={<AdminLogin />} />

        {/* DASHBOARDS — should only load AFTER login */}
        <Route path="/rm-dashboard" element={<RM_Dashboard />} />
        <Route path="/bm-dashboard" element={<BM_Dashboard />} />
        <Route path="/be-dashboard" element={<BE_Dashboard />} />
        <Route path="/rm/approve-bm" element={<ApproveBankManager />} />
{/* <Route path="/rm/approve-be" element={<ApproveBankEmployee />} /> */}
<Route path="/view-branches" element={<ViewBranches />} />
<Route path="/create-branch" element={<CreateBranch />} />
<Route path="/bm/customers" element={<ViewCustomers/>}/>
<Route path="/bm" element={<BM_Dashboard />} />
        <Route path="/bm/profile" element={<Profile />} />
        <Route path="/bm/approve-employees" element={<ApproveBankEmployee />} />
        <Route path="/bm/approve-loans" element={<ApproveLoan />} />
{ <Route path="/bm/loans" element={<LoanRequests/>}/> }

        {/* CUSTOMER */}
        <Route path="/auth/login" element={<Login />} />

        {/* DEFAULT SAFE ROUTE */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
      
  
  );
}

