import React, { useState } from 'react';

function CPoll({username}) { 
  const [question,setQuestion]=useState("");
  const [options,setOptions]=useState(Array(5).fill(null));
  const [errorMsg,setErrorMsg]=useState("");

  const handleSubmit=async (e)=>{
    e.preventDefault();
    setQuestion()
  }

  return (<>
      <h2>Input the question you want to ask</h2>
      <form id="login" onSubmit={handleSubmit}>
        <input type="text" value={question} onChange={(e)=>{setQuestion(e.target.value)}} id="question" placeholder='Question'/>
        <h3>What options do you want?</h3>
        <input type='text' value={options[0]} onChange={(e)=>{options[0]=(e.target.value)}} placeholder='Password'/>
        <input type='text' placeholder='Password'/>
        <input type='text' placeholder='Password'/>
        <input type='text' placeholder='Password'/>
        <input type='text' placeholder='Password'/>
        <button type="submit" id='create_btn'>Login</button>
      </form>
      <p id="error">{errorMsg}</p>
    </>
  );
}

export default CPoll;