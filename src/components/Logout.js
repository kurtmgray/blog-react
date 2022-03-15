import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router'
import { UserContext } from '../UserContext'

function Logout() {
    const { setCurrentUser } = useContext(UserContext)
    let navigate = useNavigate()

    useEffect(() => {
        setCurrentUser(null)
        localStorage.removeItem('token')
        setTimeout(()=> {
            navigate('/')
        }, 3000)
    })

    return (
        <div>
            You have been logged out. Redirecting home...
        </div>
    )
}

export default Logout