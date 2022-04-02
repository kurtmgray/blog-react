import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from 'react-query'

function Logout() {
    const queryClient = useQueryClient()
    let navigate = useNavigate()
    
    useEffect(() => {
        queryClient.setQueryData('current-user', null)
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