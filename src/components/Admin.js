import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router'
import { UserContext } from '../UserContext';

//new
function Admin({ posts, setPosts }) {
    const { currentUser } = useContext(UserContext)
    let navigate = useNavigate()

    // dependency/toggle to trigger useEffect
    // const [updatePosts, setUpdatePosts] = useState(false)
    

    // same code as in app if i don't send the posts back in the DELETE call
    // do I put in its own module?
    // useEffect(() => {
    //     const getAllPosts = async () => {
    //         try {
    //           const res = await fetch('http://localhost:8000/api/posts')
    //           const data = await res.json()
    //           setPosts(data.posts)
    //         } catch (err) {
    //           console.error('error fetching data', err)
    //         }
    //       }
    //       getAllPosts()
    // }, [updatePosts])


    const handleDelete = async (e) => {
        
        const res = await fetch(`http://localhost:8000/api/posts/${e.target.id}`, {
            method: "DELETE",
        })
        const data = await res.json() // updated posts in here
        setPosts(data.posts) // would delete if using the above useEffect
        //setUpdatePosts(!updatePosts)
    }
    
    const handlePubToggle = async (e) => {
        
        const selectedPost = posts.find(post => post._id === e.target.id)
        
        const res = await fetch(`http://localhost:8000/api/posts/${e.target.id}`, {
            method: "PATCH",
            headers: { 
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                published: !selectedPost.published
            }),
        })
        const data = await res.json()
        setPosts(data.posts)
        //setUpdatePosts(!updatePosts)
    }

    const handleEdit = (e) => {
        const post = posts.find(post => post._id === e.target.id)
        navigate(`/posts/${post._id}/edit`)
    }
    
    // is this sufficient to check for a valid user, or do i need to make the API call every time?
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
