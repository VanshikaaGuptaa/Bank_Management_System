import { useEffect, useState } from "react";
import { getCustomerLoans } from "../api/customerApi";

export default function CustomerLoans() {
    const [loans, setLoans] = useState([]);

    const custId = localStorage.getItem("custId");   // FIX HERE

    useEffect(() => {
        async function loadLoans() {
            try {
                const res = await getCustomerLoans(custId);
                setLoans(res.data);
            } catch (err) {
                alert("Failed to load loans");
                console.error(err);
            }
        }
        loadLoans();
    }, []);

    return (
        <div>
            <h2>Your Loans</h2>
            {loans.length === 0 ? (
                <p>No loans found</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Loan ID</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Paid EMIs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan) => (
                            <tr key={loan.loanId}>
                                <td>{loan.loanId}</td>
                                <td>{loan.amount}</td>
                                <td>{loan.status}</td>
                                <td>{loan.paidEmis}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}