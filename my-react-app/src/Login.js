import React, { useState } from 'react';
import './Login.css'

function Login({loginRequest}) { 
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [errorMsg,setErrorMsg]=useState("");

  const handleSubmit=async (e)=>{
    e.preventDefault();
    let newE= await loginRequest(username,password);
    setErrorMsg(newE);
    if(errorMsg===""){
      setUsername("");
      setPassword("");
    }
  }

  return (<>
      <form id="login" onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}} id="username" placeholder='Username'/>
        <input type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}} id='password' placeholder='Password'/>
        <button type="submit" id='login_btn'>Login</button>
      </form>
      <p className="error">{errorMsg}</p>
    </>
  );
}

export default Login;