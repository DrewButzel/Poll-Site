import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Poll.css';

function Poll({username,user,votedList,question,options,pollID,removePoll,theme}){
  const [selectedVal,setSelectedVal]= useState("");
  const [displayResults,setDisplayResults]= useState(false);
  const [answers,setAnswers] = useState([]);
  const [errorMsg,setErrorMsg] = useState("");
  const [owner,setOwner] = useState(false);
  const [newOp,setNewOp] = useState("");
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
    try {
      const response = await axios.post("http://localhost:3001/deletePollRequest",{pollId: pollID});
      if(response.data.success){
        const remPollId = await response.data._id;
        removePoll(remPollId);
      }
      else {
        setErrorMsg(response.data.errorMsg);
      }
    } catch (error) {
      console.error('Delete Error: ', error);
    }
  }
  const addOption = async (e)=>{
    e.preventDefault();
    if(newOp===""){setErrorMsg("Can't have blank option");return;}
    Object.keys(options).forEach((option)=> {
      if(option===newOp) {
        setErrorMsg("Duplicate Option");
        return;
      }
    })
    try {
      const response = await axios.post("http://localhost:3001/editPollRequest",{option: newOp, pollId: pollID});
      if(response.data.success){
        options[newOp] = 0;
        setNewOp("");
        setErrorMsg("");
        const ans = Object.keys(options).map(option => {
          return(<>
          <input type="radio" name='opt' id={`${pollID}_${option}`} onChange={handleSelect} value={option}/><label htmlFor={`${pollID}_${option}`}>{option}</label><br/>
          </>);
        })
        setAnswers(ans);
      }
      else {
        setErrorMsg("Failed to Update");
      }
    } catch (error) {
      console.error('Edit Error: ', error);
    }
  }
  function EditButton(){
    return(<div className='edit'>
      {Object.keys(options).length<5 ? <><form onSubmit={addOption}><input type='text' value={newOp} onChange={(e)=>{setNewOp(e.target.value)}} placeholder='New Option'/><button type='submit'>Add Option</button></form></> : <p>You already have 5 options</p>}<button onClick={handleDelete}>Delete Poll</button>
    </div>)
  }
  function Results(){
    let total=0;
    Object.values(options).forEach((count)=>{
      total+=count;
    })
    return(<>
      {Object.entries(options).map(([option,voteCount])=>{
        return(<div className="poll_res" style={{width:`${voteCount/total*18}vw`}} key={option} id={`${option}_${pollID}r`}><p>{option}</p></div>)
      })}
    </>)
  }
  return(<div className={theme}>
    <h2 className='question'>{question}</h2>
    {displayResults?<Results/>:<form id= {pollID+"_form"} className='poll_form' onSubmit={handleSubmit}>
      {answers}
      <button type="submit" className='vote' id={pollID+"_btn"}>Vote</button>
    </form>}
    {owner&&<EditButton/>}
    <p className='error'>{errorMsg}</p>
    </div>)
}
export default Poll;