import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'


function Signup({ setCurrentUser }) {
    const [username, setUsername] = useState('')
    const [[password, confirm], setPassword] = useState(['',''])
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [disable, setDisable] = useState(true)
    
    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        
        e.preventDefault()
        
        try {
            const response = await fetch("http://localhost:8000/api/users", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    fname: fname,
                    lname: lname,
                })
            })
            
            const data = await response.json()
            console.log(data)
        }
        
        catch (err) { 
            console.log(err)
        }    
        
        setUsername('')
        setPassword(['',''])
        setFname('')
        setLname('')
        navigate('/login')
    }

    useEffect(() => {
        username && password && fname && lname && confirm === password ? 
            setDisable(false) : setDisable(true)
    }, [username, password, confirm, fname, lname])
 
    console.log(username, password, fname, lname)

    return (
        <div className="signup-container">  
            <div className="signup">
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Enter a username</label>
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="RobinSparkles1992" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)}
                        required>
                    </input>    
                    <label htmlFor="fname">Enter your first name</label>
                    <input 
                        type="text" 
                        name="fname" 
                        placeholder="Robin" 
                        value={fname}
                        onChange={e => setFname(e.target.value)}
                        required>
                    </input>
                    <label htmlFor="lname">Enter your last name</label>
                    <input type="text" 
                        name="lname" 
                        placeholder="Scherbatsky" 
                        value={lname}
                        onChange={e => setLname(e.target.value)}
                        required>
                    </input>
                    <label htmlFor="password">Enter a password</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={password}
                        onChange={e => setPassword([e.target.value, confirm])}
                        required></input>
                    <label htmlFor="confirm">Confirm your password</label>
                    <input 
                        type="password" 
                        name="confirm" 
                        value={confirm}
                        onChange={e => setPassword([password, e.target.value])}
                        required>
                    </input>
                    {confirm === password ? null : <p>Passwords do not match.</p>}
                    <button type="submit" disabled={disable}>Create Account</button>    
                </form>
            </div>
        </div>
    )
}

export default Signup