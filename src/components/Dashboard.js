import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router'
import { UserContext } from '../UserContext';

function Dashboard() {
    const {currentUser, setCurrentUser} = useContext(UserContext)
    
    const [published, setPublished] = useState(null)
    const [unpublished, setUnpublished] = useState(null)
    
    let navigate = useNavigate()
    
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (currentUser) {
            getPosts(token)
        }
        else if (token) {
            getUser(token)
            getPosts(token)
        } 
        else {
            setCurrentUser(null)
            navigate('/login')
        }
    }, [currentUser])
    
    const getPosts = async (token) => {
        const res = await fetch(`http://localhost:8000/api/users/${currentUser.id}/posts`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        const data = await res.json()
        const timeSortedPublishedPosts = 
            data.posts.published.sort((a, b) => (b.timestamp > a.timestamp) ? 1 : -1)
        const timeSortedUnpublishedPosts = 
            data.posts.unpublished.sort((a, b) => (b.timestamp > a.timestamp) ? 1 : -1)
        
        setPublished(timeSortedPublishedPosts)
        setUnpublished(timeSortedUnpublishedPosts)
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
    
    return (
        <div>
            {currentUser ? (
                <div>
                    <h2>Welcome to your Dashboard, {currentUser.username}.</h2> 
                    <ul> <h3>Published Posts</h3> 
                        {published ? (
                            published.map(post => <li key={post._id}><a href={`posts/${post._id}`}>{post.title}</a></li>)
                        ) : (
                            <p>You have no published posts</p> 
                        )} 
                    </ul>
                    <ul> <h3>Unpublished Posts</h3>
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