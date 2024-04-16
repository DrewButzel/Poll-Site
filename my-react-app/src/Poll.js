import React, { useState } from 'react';
import axios from 'axios';


function Poll({question,options,pollID,voteRequest}){
    const [selectedVal,setSelectedVal]= useState();
    const [displayResults,setDisplayResults]= useState(false);
    const answers = options.map(option => {
        return(<>
        <input type="radio" id={pollID+"_"+option} onChange={handleSelect} value={option}/><label for={pollID+"_"+option} value={option}/><br/>
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

    return(<>
        <h2>{question}</h2>
        <form id= {pollID+"_form"} onSubmit={handleSubmit}>
            {answers}
            <button type="submit" id={pollID+"_btn"}>Vote</button>
        </form>
    </>)
}
export default Poll();