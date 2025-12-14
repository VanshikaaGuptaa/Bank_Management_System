import axios from "../../api/axios";
import "../../styles/table.css";
import { useEffect, useState } from "react";

export default function LoanRequests(){

  const [loans,setLoans]=useState([]);

  useEffect(()=>{
    axios.get("/bm/pending-loans").then(res=>setLoans(res.data))
  },[]);

  const updateLoan=(id,action)=>{
    axios.post(`/bm/loan/${action}/${id}`).then(()=>{
      alert("Updated");
      setLoans(loans.filter(l=>l.id!==id));
    })
  }

  return(
    <div className="table-page">
      <h1>Pending Loan Requests</h1>
      <table>
        <thead>
          <tr><th>Name</th><th>Amount</th><th>Type</th><th>Action</th></tr>
        </thead>
        <tbody>
          {loans.length===0 && <tr><td colSpan={4}>No Pending Loans</td></tr>}
          {loans.map(l=>(
            <tr key={l.id}>
              <td>{l.custName}</td><td>{l.amount}</td><td>{l.type}</td>
              <td>
                <button onClick={()=>updateLoan(l.id,"approve")} className="approve">Approve</button>
                <button onClick={()=>updateLoan(l.id,"reject")} className="reject">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}