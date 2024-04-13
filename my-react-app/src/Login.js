import React, { useState } from 'react';
import axios from 'axios';

function Login() { 
  const [errorMsg,setErrorMsg]=useState("");
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");

  const loginRequest = async (e) => {
    e.preventDefault();
    const data={username: username, password:password}
    try {
      const response = await axios.post("http://localhost:3001/loginRequest",data);
      if(response.data.success){
        setUsername("");
        setPassword("");
      }else{
        setErrorMsg("failure");
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