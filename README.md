# 🏦 Banking Management System

A full-stack **Banking Management System** built using **Spring Boot** (Backend) and **React + Vite** (Frontend).  
The system supports **multiple roles** including Customer, Bank Employee, Bank Manager, and Regional Manager, with secure authentication and role-based authorization.

---

## 🚀 Features

### 🔐 Authentication & Security
- JWT-based authentication (Access & Refresh tokens)
- Role-based authorization (Customer, BE, BM, RM)
- Password encryption using BCrypt
- Secure login & logout
- Session protection (cannot access dashboard after logout)

### 👤 Customer
- Register & login
- View / edit profile
- View accounts
- Deposit, withdraw & transfer money
- Mini statement & full statement
- Apply for loans
- Close account
- Open **FD / RD (Subsequent Accounts)**

### 🧑‍💼 Bank Employee
- View & edit profile
- Approve / disapprove customers
- Open first account for customers
- Manage customers (edit / delete)
- Reset password

### 🏢 Bank Manager
- View & edit profile
- Approve / disapprove bank employees
- Approve / disapprove loans

### 🌍 Regional Manager
- Approve / disapprove bank managers
- Create & view branches
- View system reports

### 📊 Reports
- Account summary report
- Transaction trend report
- Customer demographics report
- Branch performance report
- Loan status report

### 🗑️ Soft Delete
- Implemented using status flags instead of physical delete
- Supports restore logic

---

## 🧱 Architecture

Backend (Spring Boot)
├── Controller
├── Service
├── DAO (JDBC Template)
├── DTO
├── Security (JWT, Filters)
└── Exception Handling

Frontend (React + Vite)
├── Pages
├── Layouts (Role-based)
├── API Layer (Axios)
└── Validation & UI Components


🔒 Security Highlights

BCrypt password hashing

JWT validation filter

Role-based endpoint protection

Secure refresh token handling

Stateless REST APIs


📌 Future Enhancements

KYC API integration

Email / SMS notifications

Admin analytics dashboard

Pagination & filtering in reports
