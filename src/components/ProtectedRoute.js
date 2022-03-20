import { Navigate } from 'react-router';
import React, { useEffect } from 'react'

function ProtectedRoute({ currentUser, setCurrentUser, children }) {
    console.log(currentUser)
    
    const getUser = async (token) => {
        const res = await fetch('http://localhost:8000/api/users', {
            headers: { 
                Authorization: 'Bearer ' + token 
            },
        })
        const data = await res.json()
        return data.user
    }
    
    // check for token to see if already logged in, redirect to /dashboard if so
    useEffect(()=> {
        const token = localStorage.getItem('token')
        const initUser = async () => {
            if (token) {
                const user = await getUser(token)
                console.log(user)
                setCurrentUser(user)
                return <Navigate replace to='/dashboard'/>
            }
            else {
                console.log('else')
                setCurrentUser(null)
            }
        }
        initUser()
    }, [])
    
    
    if(currentUser) {
        return ( 
            <Navigate replace to='/login' />
        );
    }

    return children
}

export default ProtectedRoute;
