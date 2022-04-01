import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router'
import { UserContext } from '../UserContext'
import { useFetchCurrentUser, useLogin } from '../hooks/usePostData'

function Login() {
    const {currentUser, setCurrentUser} = useContext(UserContext)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    let navigate = useNavigate()
    
    // const { data: user } = useFetchCurrentUser(token)
    // console.log(user)
    
    useEffect(()=> {
        const token = localStorage.getItem('token')
        initUser(token)
    }, [])
    
    const initUser = async (token) => {
        console.log(token)
        if (token) {
            const user = getUser(token)
            setCurrentUser(user)
            console.log(user)
            navigate('/dashboard')
        }
        else {
            setCurrentUser(null)
        }
    }
    
    // issues using useFetchCurrentUser
    // cannot conditionally invoke a react hook, so kept this as-is
    const getUser = async (token) => {
        const res = await fetch('http://localhost:8000/api/users', {
            headers: { 
                Authorization: 'Bearer ' + token 
            },
        })
        const data = await res.json()
        return data.user
    }
    
    console.log(username, password)
    
    // const { mutate: login } = useLogin()
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:8000/api/users/login', {
                method: "POST",
                headers: { 
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            const data = await res.json()
            setCurrentUser(await data.user)
            localStorage.setItem('token', await data.token)
            navigate('/dashboard')
            console.log(currentUser)
        }
        catch (err) {
            console.log(err)
            // use the err to set state for error
            // display something based on the error
        }
        // login({username, password})
        // console.log(user)
        
        // setCurrentUser(user.user)
        // localStorage.setItem('token', user.token)
        // console.log(currentUser)
        // navigate('/dashboard')
        
       
        // clear form/state values
        setUsername('')
        setPassword('')
       
    }
    return (
        <div className="login-container">
            <div className="login">
                <h1>Log In</h1>
                
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
        </div>
    )
}

export default Login