import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import RM_Dashboard from "./pages/RM_Dashboard.jsx";
import BM_Dashboard from "./pages/BM/BM_Dashboard.jsx";
import BE_Dashboard from "./pages/BE_Dashboard.jsx";
import Customer_Dashboard from "./pages/Customer_Dashboard";
import ApproveBankManager from "./pages/ApproveBankManager.jsx";
import ApproveBankEmployee from "./pages/ApproveBankEmployee.jsx";
import ViewBranches from "./pages/ViewBranches.jsx";
import CreateCustomer from "./pages/CreateCustomer.jsx";
import CreateAccount from "./pages/CreateAccount.jsx";
import CreateBranch from "./pages/CreateBranch.jsx";
import Profile from "./pages/Profile.jsx";
import AdminRoleSelect from "./pages/AdminRoleSelect.jsx";
import "./index.css";
import ApproveLoan from "./pages/ApproveLoan.jsx";
import BM_Profile from "./pages/BM/BM_Profile.jsx";
import BE_Profile from "./pages/BE_Profile";
import BE_ResetPassword from "./pages/BE_ResetPassword";
import BE_ApproveCustomer from "./pages/BE_ApproveCustomer";
import BE_OpenAccount from "./pages/BE_OpenAccount";
import BE_ManageCustomers from "./pages/BE_ManageCustomers";
import "./index.css";
import "./App.css";
import Register from "./pages/Register.jsx";
import Transfer from "./pages/Transfer.jsx";
import Withdraw from "./pages/Withdraw.jsx";
import Deposit from "./pages/Deposit.jsx";
import MiniStatement from "./pages/MiniStatement.jsx";
import ViewAccounts from "./pages/ViewAccounts.jsx";
import ViewAccount from "./pages/ViewAccount.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import CustomerProfile from "./pages/CustomerProfile.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import RM_AccountSummaryReport from "./pages/RM_AccountSummaryReport.jsx";
import RM_TransactionTrendsReport from "./pages/RM_TransactionTrendsReport.jsx";
import RM_CustomerDemographicsReport from "./pages/RM_CustomerDemographicsReport.jsx";
import RM_BranchPerformanceReport from "./pages/RM_BranchPerformanceReport.jsx";
import RM_LoanStatusReport from "./pages/RM_LoanStatusReport.jsx";
import CustomerSubsequentAccounts from "./pages/CustomerSubsequentAccounts.jsx";
import Close_Account from "./pages/Close_Account.jsx";
import ApplyLoan from "./pages/ApplyLoan.jsx";
import MyLoans from "./pages/MyLoans.jsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing -> Login */}
        
        <Route path="/" element={<Home/>} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login/rm" element={<Login />} />
        <Route path="/admin-login/bm" element={<Login />} />
        <Route path="/admin-login/be" element={<Login />} />
        <Route path="/admin-role" element={<AdminRoleSelect/>} />
        {/* Dashboards */}
        <Route path="/rm-dashboard" element={<RM_Dashboard />} />
        <Route path="/bm-dashboard" element={<BM_Dashboard />} />
        <Route path="/be-dashboard" element={<BE_Dashboard />} />
        <Route path="/customer-dashboard" element={<Customer_Dashboard />} />
        <Route path="/view-branches" element={<ViewBranches />} />
        {/* Main RM/BM/BE pages */}
        <Route path="/approve-bank-manager" element={<ApproveBankManager />} />
        <Route path="/bm/approve-employees" element={<ApproveBankEmployee />} />
        <Route path="/bm/approve-employees" element={<ApproveBankEmployee />} />
        <Route path="/bm/approve-loans" element={<ApproveLoan />} />
        <Route path="/create-customer" element={<CreateCustomer />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/create-branch" element={<CreateBranch />} />
        <Route path="/profile" element={<Profile />} />
      <Route path="/bm/profile" element={<BM_Profile />} />
      <Route path="/rm-dashboard" element={<RM_Dashboard />} />
<Route path="/rm/reports/account-summary" element={<RM_AccountSummaryReport />} />
<Route path="/rm/reports/transaction-trends" element={<RM_TransactionTrendsReport />} />
<Route path="/rm/reports/customer-demographics" element={<RM_CustomerDemographicsReport />} />
<Route path="/rm/reports/branch-performance" element={<RM_BranchPerformanceReport />} />
<Route path="/rm/reports/loan-status" element={<RM_LoanStatusReport />} />
<Route path="/customer/fd-rd" element={<CustomerSubsequentAccounts />} />
<Route path="/customer/close-account" element={<Close_Account />} />
<Route path="/customer/apply-loan" element={<ApplyLoan />} />
<Route path="/customer/loans" element={<MyLoans />} />
      <Route
  path="/be-dashboard"
  element={
      <BE_Dashboard />
  }
/>

<Route
  path="/be/profile"
  element={
    
      <BE_Profile />
    
  }
/>

<Route
  path="/be/reset-password"
  element={
   
      <BE_ResetPassword />
   
  }
/>

<Route
  path="/be/approve-customers"
  element={
      <BE_ApproveCustomer />
  }
/>

<Route
  path="/be/open-account"
  element={
      <BE_OpenAccount customerId={undefined} />
  }
/>

<Route
  path="/be/manage-customers"
  element={
      <BE_ManageCustomers />
  }
/>
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* rest of your routes */}
     
      <Route
  path="/customer/change-password"
  element={<ChangePassword />}
/>

{/* CUSTOMER DASHBOARD */}
<Route
  path="/customer-dashboard"
  element={
      <Customer_Dashboard />
  }
/>

{/* CUSTOMER PROFILE */}
<Route
  path="/customer/profile"
  element={
      <CustomerProfile />
  }
/>
<Route
  path="/customer/profile/edit"
  element={
      <EditProfile />
  }
/>

{/* ACCOUNT VIEW */}
<Route
  path="/customer/account/:accNo"
  element={
      <ViewAccount />
  }
/>
<Route
  path="/customer/accounts"
  element={
      <ViewAccounts />
  }
/>


{/* MINI STATEMENT */}
<Route
  path="/customer/mini-statement"
  element={
      <MiniStatement />
  }
/>

{/* TRANSACTIONS */}
<Route
  path="/customer/deposit"
  element={
      <Deposit />
  }
/>

<Route
  path="/customer/withdraw"
  element={
      <Withdraw />
  }
/>

<Route
  path="/customer/transfer"
  element={
      <Transfer />
  }
/>
      <Route path="/customer/change-password" element={<ChangePassword />} />
      
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
 
       
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);