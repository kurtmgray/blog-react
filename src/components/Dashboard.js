import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
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

    const preview = (text) => {
        return text.slice(0, 200) + '...'
    }
    
    return (
        <div>
            {currentUser ? (
                <div>
                    <h2>Welcome to your Dashboard, {currentUser.username}.</h2> 
                    <div className="dashboard-posts-container">
                        <h3>Published Posts</h3>
                        <hr/> 
                            {published ? (
                                published.map(post => 
                                    <Link to={`/posts/${post._id}`} key={post._id} style={{textDecoration: 'none'}}>
                                        <div className="dashboard-post post-element" >
                                            <img className="db-post-img post-element" src="https://picsum.photos/100/100" alt="pic"></img>
                                            <div>
                                                <h4 className="db-post-title post-element">{post.title}</h4>
                                                <p className="db-text-preview post-element">{preview(post.text)}</p>
                                                <p className="post-element" style={{fontStyle:'italic'}}>read more...</p>
                                            </div>    
                                        </div>     
                                    </Link>
                                )
                            ) : (
                                <p>You have no published posts</p> 
                            )} 
                        <h3>Unpublished Posts</h3>
                        <hr/> 
                            {unpublished ? (
                                unpublished.map(post =>
                                    <Link to={`/posts/${post._id}`} style={{textDecoration: 'none'}}> 
                                        <div className="dashboard-post post-element" key={post._id}>
                                            <img className="db-post-img post-element" src="https://picsum.photos/100/100" alt="pic"></img>
                                            <h4 className="db-post-title post-element">{post.title}</h4>
                                            <p className="db-text-preview post-element">{post.text}</p>
                                        </div>
                                    </Link>

                                )
                            ) : (
                                <p>You have no unpublished posts</p>
                            )}
                    </div>
                </div>
            ) : (
                <h2>Please log in to use your Dashboard</h2>
            )}
            
        </div>
    )
}

export default Dashboard