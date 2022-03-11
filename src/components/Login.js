import axios from 'axios'
import React, { useState } from 'react'

function Login({ validUser, setValidUser}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        await fetch('http://localhost:8000/api/users/login', {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: {
                username: username,
                password: password
            }
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
        .finally(() => {
            setUsername('')
            setPassword('')
        })
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Enter your username</label>
                <input 
                    type="text" 
                    name="username" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                    required="true">
                </input>    
                <label htmlFor="password">Enter your password</label>
                <input 
                    type="password" 
                    name="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required="true">
                </input>
                <button type="submit">Log In</button>
            </form>
        </div>
    )
}

export default Login