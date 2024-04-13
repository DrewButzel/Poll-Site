import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [email,setEmail]=useState("");
  let errorMsg = ""; 

  const signupRequest = async (e) => {
    e.preventDefault();
    if(!username || !password|| !email){
        errorMsg="one or more blank fields";
        return;
      }
    const data={username: username, password:password, email: email}
    try {
      const response = await axios.post("http://localhost:3001/signupRequest",data);
      if(response.data.success){
        setUsername("");
        setPassword("");
        setEmail("");
        errorMsg="";
      }else{
        errorMsg=response.data.errorMsg;
      }
    } catch (error) {
      console.error('Login Error: ', error);
    }
  };

  return (<>
      <form id="login" onSubmit={loginRequest}>
        <input type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}} id="username" placeholder='Username'/>
        <input type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}} id="email" placeholder='Email'/>
        <input type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}} id='password' placeholder='Password'/>
        <button type="submit" id='signUp_btn'>Sign Up</button>
      </form>
      <p id="error">{errorMsg}</p>
    </>
  );
}

export default Login;