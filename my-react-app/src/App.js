//starter code for this file from https://www.codewithfaraz.com/article/133/how-to-connect-react-with-nodejs-using-express-a-step-by-step-guide
import React, { useState } from 'react';
import axios from 'axios';
import Login from './Login';
import SignUp from './SignUp';
import CPoll from './CPoll';
import './App.css'
// import Poll from './Poll';

function App() {
  const [displayLogin,setDisplayLogin] = useState(true);
  const [loggedIn,setLoggedIn]=useState(false);
  const [cPoll,setCPoll]=useState(false);
  const [username,setUsername]=useState("");

  const loginRequest = async (username,password) => {
    if(!username || !password){
      return "blank username or password";
    }
    const data={username: username, password:password}
    try {
      const response = await axios.post("http://localhost:3001/loginRequest",data);
      if(response.data.success){
        setLoggedIn(true);
        setUsername(response.data.username);
        return "";
      }else{
        return response.data.errorMsg;
      }
    } catch (error) {
      console.error('Login Error: ', error);
    }
  };
  const signupRequest = async (username,password,email) => {
    if(!username || !password|| !email){
        return "one or more blank fields";
    }
    const data={username: username, password:password, email: email}
    try {
      const response = await axios.post("http://localhost:3001/signupRequest",data);
      if(response.data.success){
        
        setLoggedIn(true);
        setUsername(response.data.username);
        return "";
      }else{
        return response.data.errorMsg;
      }
    } catch (error) {
      console.error('Login Error: ', error);
    }
  };
  

  function Credentials(){
    return (
      <>
      <button onClick={()=>setDisplayLogin(!displayLogin)}>{displayLogin?"Display Sign Up":"Display Login"}</button>
      {displayLogin?<Login loginRequest={loginRequest} />:<SignUp signupRequest={signupRequest} />}
      </>);
  }
  function LoggedIn(){
    return (
      <>
      <h2>{username}</h2>
      <button onClick={() => {setLoggedIn(false); setUsername("");}}>Logout</button>
      </>);
  }
  function DCPoll() {
    return (
      <>
      <button onClick={() => {setCPoll(false);}}>Hide Create a Poll</button>
      <CPoll username={username}/>
      </>
    );
  }
  function CrPoll() {
    return (
      <>
      <button onClick={() => {setCPoll(true);}}>Create a Poll</button>
      </>
    );
  }
  return (<>
        {loggedIn ? <LoggedIn/> : <Credentials/>}
        {cPoll ? <DCPoll/> : <CrPoll/>}
        {/* <Poll question="Test Q" options={o} pollID={1} username = {username}/> */}
      </>
  );
}

export default App;