import Home from './Home'
import React, { useState } from 'react'

function Signup({ setValidUser }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [match, setMatch] = useState(true)
    
    const matchPasswords = (e) => {
        setMatch(false)
        if (e.target.value === password) {
            setMatch(true)
        }
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        await fetch("http://localhost:8000/api/users/register", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password,
                fname: fname,
                lname: lname,
            })
        })
        .then(res => res.json())
        .then(data => console.log('Success', data))
        .catch(err => console.log(err))
        .finally(() => {
            setUsername('')
            setPassword('')
            setFname('')
            setLname('')
            setMatch(true)
        })
    }
 
    console.log(username, password, fname, lname)

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Enter a username</label>
                <input 
                    type="text" 
                    name="username" 
                    placeholder="RobinSparkles1992" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                    required="true">
                </input>    
                <label htmlFor="fname">Enter your first name</label>
                <input 
                    type="text" 
                    name="fname" 
                    placeholder="Robin" 
                    value={fname}
                    onChange={e => setFname(e.target.value)}
                    required="true">
                </input>
                <label htmlFor="lname">Enter your last name</label>
                <input type="text" 
                    name="lname" 
                    placeholder="Scherbatsky" 
                    value={lname}
                    onChange={e => setLname(e.target.value)}
                    required="true">
                </input>
                <label htmlFor="password">Enter a password</label>
                <input 
                    type="password" 
                    name="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required="true"></input>
                <label htmlFor="confirm">Confirm your password</label>
                <input 
                    type="password" 
                    name="confirm" 
                    onChange={e => matchPasswords(e)}
                    required="true">
                </input>
                {match ? null : <p>Passwords do not match.</p>}
                <button type="submit">Create Account</button>    
            </form>
        </div>
    )
}

export default Signup