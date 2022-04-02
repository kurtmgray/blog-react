import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router'
import { UserContext } from '../UserContext'
import { useQueryClient } from 'react-query'

function Logout() {
    // const { setCurrentUser } = useContext(UserContext)
    const queryClient = useQueryClient()
    let navigate = useNavigate()
    
    useEffect(() => {
        queryClient.setQueryData('current-user', null)
        // setCurrentUser(null)
        localStorage.removeItem('token')
        setTimeout(()=> {
            navigate('/')
        }, 1000)
    })

    return (
        <div className="logout">
            You have been logged out. Redirecting home...
        </div>
    )
}

export default Logout