import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
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

    function getFormattedDate(timestamp) {
        const date = new Date(timestamp)
        const year = date.getFullYear();
      
        let month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
      
        let day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        
        return month + '/' + day + '/' + year;
      }
    

    return ( 
        <div>
            <h2>Admin Page</h2>
            <ul>
                {posts.map(post =>  (
                    <div className={`admin-post ${post.published ? 'published' : 'unpublished'}`} key={post._id}>
                                <Link to={`/posts/${post._id}`} className="post-img post-element" style={{textDecoration: 'none'}}>
                                    <img className="post-img post-element" src="https://picsum.photos/100/100" alt="pic"></img>
                                </Link>
                                <div className="post-details post-element">
                                    <h4 className="post-title">{post.title}</h4>
                                    <p className="post-author">{post.author ? post.author.username : 'anonymous' }</p>
                                    <p className="post-date">{getFormattedDate(post.timestamp)}</p>
                                </div>
                                <p className="post-text-preview post-element">{post.text}</p>
                                <div className="admin-button-container post-element">    
                                    <button className="admin-button" id={post._id} onClick={handleDelete}>Delete Post</button>
                                    <button className="admin-button" id={post._id} onClick={handleEdit}>Edit Post</button>
                                    {post.published ? (
                                            <button className="admin-button" id={post._id} onClick={handlePubToggle}>Unpublish Post</button>
                                    ) : (
                                            <button className="admin-button" id={post._id} onClick={handlePubToggle}>Publish Post</button>
                                    )}
                                </div>
                            </div>     
                    ))}
            </ul>
        </div>
     );
}

export default Admin;
