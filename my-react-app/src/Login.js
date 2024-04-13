import React, { useState } from 'react';
import axios from 'axios';

function Login() { 
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  let errorMsg="";


  const loginRequest = async (e) => {
    e.preventDefault();
    if(!username || !password){
      errorMsg="blank username or password";
      return;
    }
    const data={username: username, password:password}
    try {
      const response = await axios.post("http://localhost:3001/loginRequest",data);
      if(response.data.success){
        setUsername("");
        setPassword("");
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
        <input type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}} id='password' placeholder='Password'/>
        <button type="submit" id='login_btn'>Login</button>
      </form>
      <p id="error">{errorMsg}</p>
    </>
  );
}

export default Login;