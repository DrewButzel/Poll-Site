import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Poll({username,votedList,question,options,pollID}){
  const [selectedVal,setSelectedVal]= useState("");
  const [displayResults,setDisplayResults]= useState(false);
  const [answers,setAnswers] = useState([]);
  const [errorMsg,setErrorMsg] = useState("");
  useEffect(()=>{
    if(votedList[username]!=null) {
      setDisplayResults(true);
    }
    const ans = Object.keys(options).map(option => {
      return(<>
      <input type="radio" name='opt' id={`${pollID}_${option}`} onChange={handleSelect} value={option}/><label htmlFor={`${pollID}_${option}`}>{option}</label><br/>
      </>);
    })
    setAnswers(ans);
  },[username])
  const handleSelect= (e)=>{
    setSelectedVal(e.target.value);
  }
  const handleSubmit=async (e)=>{
    e.preventDefault();
    if(selectedVal!==""){
      voteRequest(pollID,selectedVal);
      setErrorMsg("");
    }else{
      setErrorMsg("select an option before voting");
    }
  }
  const voteRequest = async (id,vote)=>{
    const data = {pollID:id,vote:vote,username:username}
    alert(JSON.stringify(data));
    try{
      const response = await axios.post("http://localhost:3001/voteRequest",data);
      setDisplayResults(response.data.votedOn);
      if(!response.data.votedOn) {
        setErrorMsg("Not voted :(");
      }
    }catch (error){
      console.error('Voting Error: ', error);
    }
  }
  return(<>
    <h2>{question}</h2>
    {displayResults?<></>:<form id= {pollID+"_form"} onSubmit={handleSubmit}>
      {answers}
      <button type="submit" id={pollID+"_btn"}>Vote</button>
    </form>}
    <p>{errorMsg}</p>
    </>)
}
export default Poll;