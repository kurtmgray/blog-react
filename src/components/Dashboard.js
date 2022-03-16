import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router'
import { UserContext } from '../UserContext';

function Dashboard() {
    const {currentUser, setCurrentUser} = useContext(UserContext)
    
    const [published, setPublished] = useState(null)
    const [unpublished, setUnpublished] = useState(null)
    
    let navigate = useNavigate()
    
    const getPosts = async () => {
        const res = await fetch(`http://localhost:8000/api/users/${currentUser.id}/posts`)
        const data = await res.json()
        setPublished(data.posts.published)
        setUnpublished(data.posts.unpublished)
    }
    
    const getUser = async (token) => {
        const res = await fetch(`http://localhost:8000/api/users`, {
            headers: { 
                Authorization: token 
            },
        })
        const data = await res.json()
        await setCurrentUser(data.user)
    }
    
    useEffect(() => {
        const token = localStorage.getItem('token')
        if(currentUser) {
            getPosts()
        }
        else if (token) {
            getUser(token)
            getPosts()
        } 
        else {
            setCurrentUser(null)
            navigate('/login')
        }
    }, [currentUser])
    
    console.log(published, unpublished)

    return (
        <div>
            {currentUser ? (
                <div>
                    <h2>Welcome {currentUser.username}</h2> 
                    <ul> Published Posts 
                        {published ? (
                            published.map(post => <li key={post._id}><a href={`posts/${post._id}`}>{post.title}</a></li>)
                        ) : (
                            <p>You have no published posts</p> 
                        )} 
                    </ul>
                    <ul> Unpublished Posts
                        {unpublished ? (
                            unpublished.map(post => <li key={post._id}><a href={`posts/${post._id}`}>{post.title}</a></li>)
                        ) : (
                            <p>You have no unpublished posts</p>
                        )}
                    </ul>
                </div>
            ) : (
                <h2>Please log in to use your Dashboard</h2>
            )}
            
        </div>
    )
}

export default Dashboard