import api from "./axios";
 
// Backend base URL (NO trailing slash issue)
const BASE = "http://localhost:9191/api";
 
// ================= CUSTOMERS =================
export const changePassword = ({ username, oldPassword, newPassword }) =>
  api.post(`${BASE}/customers/change-password`, {
    username,
    oldPassword,
    newPassword,
  });
export const getAllCustomers = () =>
  api.get(`${BASE}/customers`);
 
export const getCustomerByCustId = (custId) =>
  api.get(`${BASE}/customers/${custId}`);
 
export const getAccountsByCustId = (custId) =>
  api.get(`${BASE}/accounts/customer/${custId}`);
 
export const getMiniStatement = (accNo) =>
  api.get(`${BASE}/accounts/${accNo}/mini-statement`);
 
export const getStatement = (accNo) =>
  api.get(`${BASE}/accounts/${accNo}/statement`);
 
 
// ================= TRANSACTIONS =================
 
export const deposit = ({ accNo, amount }) =>
  api.post(`${BASE}/accounts/deposit`, { accNo, amount });
 
export const withdraw = ({ accNo, amount }) =>
  api.post(`${BASE}/accounts/withdraw`, { accNo, amount });
export function transfer(data){
return api.post("/accounts/transfer", data);}
export function updateProfile(custId,data){
  return api.put(`/customers/${custId}`,data);
}
//close account{}
export const closeAccount = ( dto ) =>{
  return api.post("/accounts/close", dto);
};
export const applyLoan = (data) => {
  return api.post("/loans/apply",data);
};
export const payEmi= (data) => {
  return api.post("/loans/pay-emi",data);
};
export const getLoansByCustomer= (CustId) => {
  return api.get(`/loans/customer/${custId} `);
};
 