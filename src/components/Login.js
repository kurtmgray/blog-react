import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router'
import { UserContext } from '../UserContext'

function Login() {
    const {currentUser, setCurrentUser} = useContext(UserContext)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    let navigate = useNavigate()
    
    const getUser = async (token) => {
        const res = await fetch('http://localhost:8000/api/users', {
        headers: { Authorization: token },
        })
        const data = await res.json()
        setCurrentUser(data.user)
    }

    // check for token to see if already logged in, redirect to /dashboard if so
    useEffect(()=> {
        const token = localStorage.getItem('token')
        
        if (token) {
            getUser(token)
            navigate('/dashboard')
        }
        else {
            setCurrentUser(null)
        }
    }, [])
    
    // post login credentials to server, get user back, set user to response, save token to LS, redirect to /dashboard
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:8000/api/users/login', {
                method: "POST",
                headers: { "Content-type": "application/json"},
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            const data = await res.json()
            setCurrentUser(data.user)
            localStorage.setItem('token', data.token)
            navigate('/dashboard')
            console.log(currentUser)
        }
        catch (err) {
            console.log(err)
            // use the err to set state for error
            // display something based on the error
        }
        
        // clear form/state values
        setUsername('')
        setPassword('')
       
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
                    required>
                </input>    
                <label htmlFor="password">Enter your password</label>
                <input 
                    type="password" 
                    name="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required>
                </input>
                <button type="submit">Log In</button>
            </form>
        </div>
    )
}

export default Login