import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!role) {
      alert("Please select a role");
      return;
    }
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="flex flex-col items-center mt-20">

      <h2 className="text-3xl font-bold mb-6">Select Admin Role</h2>

      <div className="flex gap-5 text-lg mb-6">
        <label><input type="radio" name="role" value="RM" onChange={(e)=>setRole(e.target.value)} /> Regional Manager</label>
        <label><input type="radio" name="role" value="BM" onChange={(e)=>setRole(e.target.value)} /> Branch Manager</label>
        <label><input type="radio" name="role" value="BE" onChange={(e)=>setRole(e.target.value)} /> Bank Employee</label>
      </div>

      <button onClick={handleNext} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800">
        Next →
      </button>
    </div>
  );
}
