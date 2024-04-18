import React, { useState } from 'react';
import axios from 'axios';
import './CPoll.css'
function CPoll({username}) { 
  const [question,setQuestion]=useState();
  const [options,setOptions]=useState(Array(5).fill(null));
  const [errorMsg,setErrorMsg]=useState();

  const handleSubmit=async (e)=>{
    e.preventDefault();
    if(username===""){
      setErrorMsg("Must be logged in to create a poll");
      return;
    }
    if(!question){
      setErrorMsg("Question must not be blank");
      return;
    }
    if(!(options[0]&&options[1])){
      setErrorMsg("Options 1 and 2 must not be blank");
      return;
    }
    let nonNullCount=0;
    const nonNullOptions={};
    options.forEach((option)=>{
      if(option){
        nonNullCount++;
      }
      if(nonNullOptions[option]==null&&option){
        nonNullOptions[option]=0;
      }
    });
    if(nonNullCount!==Object.keys(nonNullOptions).length){
      setErrorMsg("Duplicate Options");
      return;
    }
    const data ={question:question,options:nonNullOptions,username:username}
    try {
      const response = await axios.post("http://localhost:3001/cpoll",data);
      if(response.data.success){
        setQuestion("");
        setOptions(Array(5).fill(""));
      }
      setErrorMsg(response.data.errorMsg);
    } catch (error) {
      console.error('cPoll Error: ', error);
    }
  }
  const updateOption = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  return (<>
      <h2>Input the question you want to ask</h2>
      <form id="create_poll" onSubmit={handleSubmit}>
        <input type="text" value={question} onChange={(e)=>{setQuestion(e.target.value)}} id="question" placeholder='Question'/>
        <h3>What options do you want?</h3>
        <input type='text' value={options[0]} onChange={(e)=>updateOption(0,e.target.value)} placeholder='Option 1'/>
        <input type='text' value={options[1]} onChange={(e)=>updateOption(1,e.target.value)} placeholder='Option 2'/>
        <input type='text' value={options[2]} onChange={(e)=>updateOption(2,e.target.value)} placeholder='Option 3 (optional)'/>
        <input type='text' value={options[3]} onChange={(e)=>updateOption(3,e.target.value)} placeholder='Option 4 (optional)'/>
        <input type='text' value={options[4]} onChange={(e)=>updateOption(4,e.target.value)} placeholder='Option 5 (optional)'/>
        <button type="submit" id='create_btn'>Create Poll</button>
      </form>
      <p id="error">{errorMsg}</p>
    </>
  );
}

export default CPoll;