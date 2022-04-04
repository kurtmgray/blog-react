import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useCreateUser } from '../hooks/usePostData'


function Signup({ setCurrentUser }) {
    const [disable, setDisable] = useState(true)
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        confirm: '',
        fname: '',
        lname: '',
    })

    let navigate = useNavigate()

    const { mutate: createUser } = useCreateUser()
    const handleSubmit = async (e) => {
        e.preventDefault()
        createUser({ userData })
        setUserData({
            username: '',
            password: '',
            confirm: '',
            fName: '',
            lname: '',
        })
        navigate('/login')
    }

    useEffect(() => {
        userData.username && userData.password && userData.fname && userData.lname && userData.confirm === userData.password ? 
            setDisable(false) : setDisable(true)
    }, [userData.username, userData.password, userData.confirm, userData.fname, userData.lname])
 
    console.log(userData)

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
                        value={userData.username} 
                        onChange={e => setUserData(v => ({...v, [e.target.name]: e.target.value}))}
                        required>
                    </input>    
                    <label htmlFor="fname">Enter your first name</label>
                    <input 
                        type="text" 
                        name="fname" 
                        placeholder="Robin" 
                        value={userData.fname}
                        onChange={e => setUserData(v => ({...v, [e.target.name]: e.target.value}))}
                        required>
                    </input>
                    <label htmlFor="lname">Enter your last name</label>
                    <input type="text" 
                        name="lname" 
                        placeholder="Scherbatsky" 
                        value={userData.lname}
                        onChange={e => setUserData(v => ({...v, [e.target.name]: e.target.value}))}
                        required>
                    </input>
                    <label htmlFor="password">Enter a password</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={userData.password}
                        onChange={e => setUserData(v => ({...v, [e.target.name]: e.target.value}))}
                        required></input>
                    <label htmlFor="confirm">Confirm your password</label>
                    <input 
                        type="password" 
                        name="confirm" 
                        value={userData.confirm}
                        onChange={e => setUserData(v => ({...v, [e.target.name]: e.target.value}))}
                        required>
                    </input>
                    {userData.confirm === userData.password ? null : <p>Passwords do not match.</p>}
                    <button type="submit" disabled={disable}>Create Account</button>    
                </form>
            </div>
        </div>
    )
}

export default Signup