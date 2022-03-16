import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router'
import { UserContext } from '../UserContext';

function Admin({ posts, setPosts }) {
    const { currentUser } = useContext(UserContext)
    let navigate = useNavigate()
    
    const handleDelete = async (e) => {
        console.log(e.target.id)
        const res = await fetch(`http://localhost:8000/api/posts/${e.target.id}`, {
            method: "DELETE",
        })
        const data = await res.json()
        console.log(data.posts)
        setPosts(data.posts)
    }
    
    useEffect(() => {
        if (!currentUser || !currentUser.admin) {
            navigate('/')
        } 
    },[])

    return ( 
        <div>
            <h2>Admin Page</h2>
            <ul>
                {posts.map(post =>  (
                        <li key={post._id}>
                            <a href={`posts/${post._id}`}>{post.title}</a> 
                            - {post.author ? post.author.username : 'anonymous' }
                            <button id={post._id} onClick={handleDelete}>Delete Post</button>
                        </li>
                    ))}
            </ul>
        </div>
     );
}

export default Admin;
