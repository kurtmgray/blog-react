import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router'
import { UserContext } from '../UserContext';

function Admin({ posts, setPosts }) {
    const { currentUser } = useContext(UserContext)
    let navigate = useNavigate()
    console.log( currentUser)
    
    useEffect(() => {
        getAllPosts()
        if (!currentUser || !currentUser.admin) {
            console.log('use')
            navigate('/')   
        } 
    },[])
    
    const getAllPosts = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/posts')
            const data = await res.json()
            setPosts(data.posts)
        } catch (err) {
            console.error('error fetching data', err)
        }
    }
   
    const handleDelete = async (e) => {
        const token = localStorage.getItem('token')

        const res = await fetch(`http://localhost:8000/api/posts/${e.target.id}`, {
            method: "DELETE",
            headers: {
                Authorization: 'Bearer ' + token
            },
        })
        const data = await res.json()
        console.log(data)
        getAllPosts()
        
    }
    
    const handlePubToggle = async (e) => {
        const token = localStorage.getItem('token')
        const selectedPost = posts.find(post => post._id === e.target.id)
        
        const res = await fetch(`http://localhost:8000/api/posts/${e.target.id}`, {
            method: "PATCH",
            headers: { 
                "Content-type": "application/json",
                Authorization: 'Bearer ' + token
            },
            body: JSON.stringify({
                published: !selectedPost.published
            }),
        })
        const data = await res.json()
        
        const postsCopy = [...posts]
        const newPostIndex = posts.findIndex(post => post._id === data.updatedPost._id)
        postsCopy.splice(newPostIndex, 1, data.updatedPost)
        setPosts(postsCopy)

    }

    const handleEdit = (e) => {
        const post = posts.find(post => post._id === e.target.id)
        navigate(`/posts/${post._id}/edit`)
    }
    

    return ( 
        <div>
            <h2>Admin Page</h2>
            <ul>
                {posts.map(post =>  (
                        <li key={post._id}>
                            <a href={`posts/${post._id}`}>{post.title}</a> 
                            - {post.author ? post.author.username : 'anonymous' } Published: {`${post.published}`}
                            <button id={post._id} onClick={handleDelete}>Delete Post</button>
                            <button id={post._id} onClick={handleEdit}>Edit Post</button>
                            {post.published ? (
                                    <button id={post._id} onClick={handlePubToggle}>Unpublish Post</button>
                            ) : (
                                    <button id={post._id} onClick={handlePubToggle}>Publish Post</button>
                            )}

                        </li>
                    ))}
            </ul>
        </div>
     );
}

export default Admin;
