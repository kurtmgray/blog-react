import React, { useEffect } from 'react';
import { useNavigate } from 'react-router'

function Protected() {
    let navigate = useNavigate()
    
    useEffect(()=> {
        const token = localStorage.getItem('token')
        // pass this token to header
        fetch('http://localhost:8000/api/users' , {
            headers: { 
                Authorization: token 
            }
        }).then(res => {
                console.log(res)
                res.json()
            
        }).then(data => {
            console.log(data)    
        }).catch(err => {
            console.log('err', err)
        })
    }, [])
    
    return ( 
        <div><h1>Protected</h1></div>
     );
}

export default Protected; 