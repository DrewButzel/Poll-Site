import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Poll({question,options,pollID,username,votedList}){
  const [selectedVal,setSelectedVal]= useState();
  const [displayResults,setDisplayResults]= useState(false);
  const [answers,setAnswers] = useState([]);
  useEffect(()=>{
    if(votedList.username) {
      displayResults(true);
    }
    const ans = Object.keys[options].map(option => {
      return(<>
      <input type="radio" id={pollID+"_"+option} onChange={handleSelect} value={option}/><label for={pollID+"_"+option} value={option}/><br/>
      </>);
    })
    setAnswers(ans);
  },[])
  const handleSelect= (e)=>{
    setSelectedVal(e.target.value);
  }
  const handleSubmit=async (e)=>{
    e.preventDefault();
    voteRequest(pollID,selectedVal);
  }
  const voteRequest = async (id,vote)=>{
    const data = {pollID:id,vote:vote,username:username}
    try{
      const response = await axios.post("http://localhost:3001/voteRequest",data);
      setDisplayResults(response.data.success);
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
export default Poll;