import axios from "../../api/axios";
import "../../styles/table.css";
import { useEffect, useState } from "react";

export default function ViewCustomers(){

  const [customers,setCustomers]=useState([]);

  useEffect(()=>{
    axios.get("/bm/customers").then(res=>setCustomers(res.data))
  },[]);

  return(
    <div className="table-page">
      <h1>Branch Customers</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Account No</th><th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c=>(
            <tr key={c.accNo}>
              <td>{c.name}</td><td>{c.email}</td><td>{c.accNo}</td><td>{c.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}