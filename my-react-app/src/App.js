//starter code for this file from https://www.codewithfaraz.com/article/133/how-to-connect-react-with-nodejs-using-express-a-step-by-step-guide
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import SignUp from './SignUp';
import CPoll from './CPoll';
import './App.css'
import Poll from './Poll';

function App() {
  const [displayLogin,setDisplayLogin] = useState(true);
  const [loggedIn,setLoggedIn]=useState(false);
  const [cPoll,setCPoll]=useState(false);
  const [username,setUsername]=useState("");
  const [polls,setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPolls = async () => {
      try {
        const response = await axios.get("http://localhost:3001/displayPollsRequest");
        if (response.data.success) {
          setPolls(response.data.polls.map((poll) => (
            <Poll
              key={poll._id}
              username={username}
              user={newPoll.username}
              votedList={poll.votedList}
              question={poll.question}
              options={poll.options}
              pollID={poll._id}
            />
          )));
        }
      } catch (error) {
        console.error('Login Error: ', error);
      } finally {
        setIsLoading(false);
      }
    };
    getPolls();
  }, [username]);
  
  const addPoll = (newPoll) => {
    let insertPoll =<Poll
      username={username}
      user={newPoll.username}
      votedList={newPoll.votedList}
      question={newPoll.question}
      options={newPoll.options}
      pollID={newPoll._id}/>
    const updatedPolls = [...polls, insertPoll];
    setPolls(updatedPolls);
  };
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
      <CPoll username={username} addPoll = {addPoll}/>
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
    {loggedIn ? <LoggedIn /> : <Credentials />}
    {loggedIn ? (isLoading ? (
      <p>Loading polls...</p>
    ) : (
      <>
        {cPoll ? <DCPoll /> : <CrPoll />}
        {polls.length > 0 ? polls : <p>No polls available</p>}
      </>
    )) : <></>}
    
  </>
  );
}

export default App;