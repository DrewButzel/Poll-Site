import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Poll({username,user,votedList,question,options,pollID}){
  const [selectedVal,setSelectedVal]= useState("");
  const [displayResults,setDisplayResults]= useState(false);
  const [answers,setAnswers] = useState([]);
  const [errorMsg,setErrorMsg] = useState("");
  const [owner,setOwner] = useState(false);
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
    setOwner(username===user);
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
    try{
      const response = await axios.post("http://localhost:3001/voteRequest",data);
      setDisplayResults(response.data.votedOn);
      if(!response.data.votedOn) {
        setErrorMsg("Not voted :(");
        return;
      }
      options[vote]=options[vote]+1;
    }catch (error){
      console.error('Voting Error: ', error);
    }
  }
  const handleDelete= async ()=>{
    
  }
  function EditButton(){
    return(<>
      <button>Add Option</button><button>Delete Poll</button>
    </>)
  }
  function Results(){
    let total=0;
    Object.values(options).forEach((count)=>{
      total+=count;
    })
    return(<>
      {Object.entries(options).map(([option,voteCount])=>{
        return(<div style={{width:`${voteCount/total*500}px`,height:"20px",backgroundColor:'lightcoral'}} key={option} id={`${option}_${pollID}r`}><p>{option}</p></div>)
      })}
    </>)
  }
  return(<>
    <h2>{question}</h2>
    {displayResults?<Results/>:<form id= {pollID+"_form"} onSubmit={handleSubmit}>
      {answers}
      <button type="submit" id={pollID+"_btn"}>Vote</button>
    </form>}
    {owner&&<EditButton/>}
    <p>{errorMsg}</p>
    </>)
}
export default Poll;