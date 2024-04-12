import React, { useState, useEffect } from 'react';

function Login() {  

    const send_to_server = async () => {
        try {
          const response = await axios.get('http://localhost:3001/message');
          setData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    return (
        <form id="login" action='send_to_server'>
            <input type="text" id="username" placeholder='Username'></input>
            <input type='password' id='password' placeholder='Password'></input>
            <input type='submit' id='login_btn'></input>
        </form>
    );
}

export default Login;