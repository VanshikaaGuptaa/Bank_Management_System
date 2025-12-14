import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login(){
  const navigate = useNavigate();
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [msg,setMsg] = useState("");

  async function loginUser(e){
    e.preventDefault();
    setMsg("");

    try {
      const res = await api.post("/auth/login",{username,password});
      localStorage.setItem("token",res.data.accessToken);
      localStorage.setItem("userId",res.data.userId);

      navigate("/dashboard");
    }
    catch(err){
      if(err.response?.status===403){
        navigate("/change-password",{state:{username}});
      }else{
        setMsg("❌ Invalid Credentials");
      }
    }
  }

  return(
    <div className="center-box">
      <h2>Login</h2>

      {msg && <p className="error">{msg}</p>}

      <form onSubmit={loginUser}>
        <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required/>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/>

        <button>Login</button>
      </form>
    </div>
  );
}

