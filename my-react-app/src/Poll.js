import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Poll({question,options,pollID,username}){
  const [selectedVal,setSelectedVal]= useState();
  const [displayResults,setDisplayResults]= useState(false);
  useEffect(()=>{
    votedCheck();
  },[])
  const votedCheck = async ()=>{
    const data = {pollID:id,username:username}
    try{
      const response = await axios.get("http://localhost:3001/votedCheck", data);
      setDisplayResults(response.data.found);
    }catch (error){
      console.error('Voting Error: ', error);
    }
  }
  const answers = options.map(option,idx => {
    return(<>
    <input type="radio" id={pollID+"_"+idx} onChange={handleSelect} value={option}/><label for={pollID+"_"+idx} value={option}/><br/>
    </>);
  })
  const handleSelect= (e)=>{
    setSelectedVal(e.target.value);
  }
  const handleSubmit=async (e)=>{
    e.preventDefault();
    let votedOn = await voteRequest(pollID,selectedVal);
    setDisplayResults(votedOn);
  }
  const voteRequest = async (id,vote)=>{
    const data = {pollID:id,vote:vote,username:username}
    try{
      const response = await axios.post("http://localhost:3001/voteRequest",data);
      return response.data.success;
    }catch (error){
      console.error('Voting Error: ', error);
    }
  }
  
  return(<>
    <h2>{question}</h2>
    <form id= {pollID+"_form"} onSubmit={handleSubmit}>
      {answers}
      <button type="submit" id={pollID+"_btn"}>Vote</button>
    </form>
    </>)
}
export default Poll();