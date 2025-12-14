import api from "./axios";

/* ========== AUTH ========== */

// POST /api/auth/login
export const loginRequest = async (username, password) => {
  const res = await api.post("/auth/login", { username, password });
  return res.data;
};

// (optional) refresh if you use it: POST /api/auth/refresh
export const refreshToken = async (refreshToken) => {
  const res = await api.post("/auth/refresh", { refreshToken });
  return res.data;
};

/* ========== REGIONAL MANAGER (RM) ========== */

// GET /api/rm/temp-bank-managers?rmuserid=xx
export const getTempBankManagersForRm = async (rmUserId) => {
  const res = await api.get("/rm/temp-bank-managers", {
    params: { rmUserId: rmUserId },
  });
  return res.data;
};

// POST /api/rm/{tempId}/approve?comment=...
export const approveTempBankManager = async (tempBmId, comment = "") => {
  const res = await api.post(`/rm/${tempBmId}/approve`, null, {
    params: { comment },
  });
  return res.data;
};

// POST /api/rm/{tempId}/disapprove?comment=...
export const disapproveTempBankManager = async (tempBmId, comment = "") => {
  const res = await api.post(`/rm/${tempBmId}/disapprove`, null, {
    params: { comment },
  });
  return res.data;
};

// GET /api/rm/branches
export const getAllBranches = async () => {
  const res = await api.get("/rm/branches");
  return res.data;
};

// POST /api/rm/createbranch
export const createBranch = async (payload) => {
  // payload must match CreateBranchDto:
  // { branch_name, branch_code, address, type, rmid }
  const res = await api.post("/rm/createbranch", payload);
  return res.data;
};

/* ========== BANK MANAGER (BM) ========== */

// GET /api/bank-managers/temp-bank-employees?bmid=xx
export const getTempBankEmployeesForBm = async (bmId) => {
  const res = await api.get("/bank-managers/temp-bank-employees", {
    params: { bmid: bmId },
  });
  return res.data;
};

// POST /api/bank-managers/{tempId}/approve
export const approveTempBankEmployee = async (tempId) => {
  const res = await api.post(`/bank-managers/${tempId}/approve`);
  return res.data;
};

// POST /api/bank-managers/{tempId}/disapprove
export const disapproveTempBankEmployee = async (tempId) => {
  const res = await api.post(`/bank-managers/${tempId}/disapprove`);
  return res.data;
};

// Loan approvals
// POST /api/bank-managers/{tempLoanId}/approve-loan
export const approveLoan = async (tempLoanId) => {
  const res = await api.post(`/bank-managers/${tempLoanId}/approve-loan`);
  return res.data;
};

// POST /api/bank-managers/{tempLoanId}/disapprove-loan
export const disapproveLoan = async (tempLoanId) => {
  const res = await api.post(`/bank-managers/${tempLoanId}/disapprove-loan`);
  return res.data;
};

/* ========== BANK EMPLOYEE (BE) ========== */

// POST /api/bank-employees  (create BE)
export const createBankEmployee = async (payload) => {
  // CreateBankEmployeeDto:
  // { username, password, email, phone, fullName, role, status, approvedByBm, branchId }
  const res = await api.post("/bank-employees", payload);
  return res.data;
};

// GET /api/bank-employees
export const getAllBankEmployees = async () => {
  const res = await api.get("/bank-employees");
  return res.data;
};

// Customer approval by BE
// POST /api/bank-employees/temp-customers/{id}/approve
export const approveTempCustomer = async (tempCustId) => {
  const res = await api.post(`/bank-employees/temp-customers/${tempCustId}/approve`);
  return res.data;
};

// POST /api/bank-employees/{tempId}/disapprove
export const disapproveTempCustomer = async (tempCustId) => {
  const res = await api.post(`/bank-employees/${tempCustId}/disapprove`);
  return res.data;
};

// Open account for existing customer
// POST /api/bank-employees/{beId}/customers/{custId}/accounts
export const openAccountForExistingCustomer = async (beId, custId, accType) => {
  const res = await api.post(
    `/bank-employees/${beId}/customers/${custId}/accounts`,
    { custId, accType } // CreateAccountDto: { custId, accType }
  );
  return res.data;
};

/* ========== CUSTOMERS ========== */

// POST /api/customers/create  (first-time customer + first account)
export const createCustomerWithAccount = async (payload) => {
  // CreateCustomerDto:
  // user: { username, password, email, phone, fullName }
  // customer: { branchId, createdByBe }
  // account: { accType, accStatus }
  const res = await api.post("/customers/create", payload);
  return res.data;
};

// GET /api/customers
export const getAllCustomers = async () => {
  const res = await api.get("/customers");
  return res.data;
};

// GET /api/customers/{id}
export const getCustomerById = async (id) => {
  const res = await api.get(`/customers/${id}`);
  return res.data;
};

// POST /api/customers/change-password
export const changeCustomerPassword = async (payload) => {
  // ChangePasswordDto (check your fields, usually: username, oldPassword, newPassword)
  const res = await api.post("/customers/change-password", payload);
  return res.data;
};

/* ========== ACCOUNTS ========== */

// POST /api/accounts  (generic create account – used only if you want)
export const createAccount = async (custId, accType) => {
  const res = await api.post("/accounts", { custId, accType });
  return res.data;
};

// GET /api/accounts/customer/{custId}
export const getAccountsByCustomer = async (custId) => {
  const res = await api.get(`/accounts/customer/${custId}`);
  return res.data;
};

// POST /api/accounts/deposit
export const depositAmount = async (dto) => {
  // DepositWithdrawDto – commonly { accNo, amount }
  const res = await api.post("/accounts/deposit", dto);
  return res.data;
};

// POST /api/accounts/withdraw
export const withdrawAmount = async (dto) => {
  // DepositWithdrawDto – { accNo, amount }
  const res = await api.post("/accounts/withdraw", dto);
  return res.data;
};

// POST /api/accounts/close
export const closeAccount = async (dto) => {
  // CloseAccountRequestDto – likely { accNo } (plus maybe reason)
  const res = await api.post("/accounts/close", dto);
  return res.data;
};

// GET /api/accounts/{accNo}/mini-statement
export const getMiniStatement = async (accNo) => {
  const res = await api.get(`/accounts/${accNo}/mini-statement`);
  return res.data;
};

// GET /api/accounts/{accNo}/statement?from=yyyy-MM-dd&to=yyyy-MM-dd
export const getAccountStatement = async (accNo, from, to) => {
  const res = await api.get(`/accounts/${accNo}/statement`, {
    params: { from, to },
  });
  return res.data;
};

/* ========== TRANSACTIONS (generic, if needed) ========== */

// GET /api/transactions/account/{accNo}
export const getTransactionsByAccount = async (accNo) => {
  const res = await api.get(`/transactions/account/${accNo}`);
  return res.data;
};

// GET /api/transactions/mini/{accNo}
export const getMiniTransactions = async (accNo) => {
  const res = await api.get(`/transactions/mini/${accNo}`);
  return res.data;
};

// POST /api/transactions/statement  (if you prefer DTO instead of query params)
export const getStatementByFilter = async (payload) => {
  // TransactionFilterDto: { accNo, from, to }
  const res = await api.post("/transactions/statement", payload);
  return res.data;
};
export async function createBankManager(dto) {
  return axios.post(`${API_BASE}/api/bm`, dto);
}
export async function getAllBankManagers() {
  return axios.get(`${API_BASE}/api/bm`);
}
export async function getBMById(id) {
  return axios.get(`${API_BASE}/api/bm/${id}`);
}
export async function getBMByUserId(userId) {
  return axios.get(`${API_BASE}/api/bm/by-user/${userId}`);
}
export async function approveTempBM(tempBmId, comment='') {
  const params = new URLSearchParams();
  params.append('tempBmId', tempBmId);
  params.append('comment', comment);
  return axios.post(`${API_BASE}/api/bm/approve-temp`, params);
}
export async function updateBM(id, obj) {
  return axios.put(`${API_BASE}/api/bm/${id}`, obj);
}
export async function updateBMProfile(id, formData) {
  return axios.put(`${API_BASE}/api/bm/${id}/profile`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}
export async function getBMProfileImage(id) {
  // not needed — use <img src=...>
  return `${API_BASE}/api/bm/${id}/profile-image`;
}