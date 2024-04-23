import React, { useState } from 'react';
import './SignUp.css';

const SignUp=({signupRequest})=> {
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [errorMsg,setErrorMsg]=useState("");
  const [email,setEmail]=useState("");

  const handleSubmit= async(e)=>{
    e.preventDefault();
    let newE = await(signupRequest(username,password,email))
    setErrorMsg(newE);
    if(errorMsg===""){
        setUsername("");
        setPassword("");
        setEmail("");
    }
  }

  return (<>
      <form id="signup" onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}} id="username" placeholder='Username'/>
        <input type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}} id="email" placeholder='Email'/>
        <input type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}} id='password' placeholder='Password'/>
        <button type="submit" id='signUp_btn'>Sign Up</button>
      </form>
      <p className="error">{errorMsg}</p>
    </>
  );
}

export default SignUp;