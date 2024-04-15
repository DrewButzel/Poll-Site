import React, { useState } from 'react';

function CPoll({loginRequest}) { 
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
      <h2>Input the question you want to ask</h2>
      <form id="login" onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}} id="username" placeholder='Username'/>
        <h3>What options do you want?</h3>
        <input type='text' value={password} onChange={(e)=>{setPassword(e.target.value)}} id='password' placeholder='Password'/>
        <input type='text' value={password} onChange={(e)=>{setPassword(e.target.value)}} id='password' placeholder='Password'/>
        <input type='text' value={password} onChange={(e)=>{setPassword(e.target.value)}} id='password' placeholder='Password'/>
        <input type='text' value={password} onChange={(e)=>{setPassword(e.target.value)}} id='password' placeholder='Password'/>
        <input type='text' value={password} onChange={(e)=>{setPassword(e.target.value)}} id='password' placeholder='Password'/>
        <button type="submit" id='login_btn'>Login</button>
      </form>
      <p id="error">{errorMsg}</p>
    </>
  );
}

export default CPoll;