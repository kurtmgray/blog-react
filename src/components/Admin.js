import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext';
import { format, parseISO } from 'date-fns'
import parse from 'html-react-parser'
import { usePublishToggle, usePostData } from '../hooks/usePostData'


function Admin({ posts, setPosts }) {
    const { currentUser } = useContext(UserContext)
    const [token, setToken] = useState('')
    let navigate = useNavigate()
    
    const { data: newPosts, isLoading, isError } = usePostData()

    useEffect(() => {
        setToken(localStorage.getItem('token'))
        setPosts(newPosts)
        if (!currentUser || !currentUser.admin) {
            console.log('use')
            navigate('/')   
        } 
    },[])
    


    // const getAllPosts = async () => {
    //     try {
    //         const res = await fetch('http://localhost:8000/api/posts')
    //         const data = await res.json()
    //         //setPosts(data.posts)
    //     } catch (err) {
    //         console.error('error fetching data', err)
    //     }
    // }
   
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
        // getAllPosts()  
    }
    
    const { mutate: publishToggle } = usePublishToggle()
    const handlePubToggle = async (e) => {
        const post = posts.find(post => post._id === e.target.id)
        publishToggle({e, token, post})
    }

    // const handlePubToggle = async (e) => {
    //     const token = localStorage.getItem('token')
    //     const selectedPost = posts.find(post => post._id === e.target.id)
        
    //     const res = await fetch(`http://localhost:8000/api/posts/${e.target.id}`, {
    //         method: "PATCH",
    //         headers: { 
    //             "Content-type": "application/json",
    //             Authorization: 'Bearer ' + token
    //         },
    //         body: JSON.stringify({
    //             published: !selectedPost.published
    //         }),
    //     })
    //     const data = await res.json()
        
    //     const postsCopy = [...posts]
    //     const newPostIndex = posts.findIndex(post => post._id === data.updatedPost._id)
    //     postsCopy.splice(newPostIndex, 1, data.updatedPost)
    //     // setPosts(postsCopy)

    // }

    const handleEdit = (e) => {
        const post = posts.find(post => post._id === e.target.id)
        navigate(`/posts/${post._id}/edit`) 
    }

    function getFormattedDate(timestamp) {
        return format(parseISO(timestamp), "MMMM dd" );
    }

    const preview = (text) => {
        return text.slice(0, 200) + '...'
    }
    

    return ( 
        <div>
            <h2>Admin Page</h2>
            <ul>
                {posts.length > 0 ? (
                    posts.map(post =>  (
                        <div className={`admin-post ${post.published ? 'published' : 'unpublished'}`} key={post._id}>
                            <Link to={`/posts/${post._id}`} className="post-img post-element" style={{textDecoration: 'none'}}>
                                <img className="post-img post-element" src={post.imgUrl} alt="pic"></img>
                            </Link>
                            <div className="post-details post-element">
                                <h4 className="post-title">{post.title}</h4>
                                <p className="post-author">{post.author ? post.author.username : 'anonymous' }</p>
                                <p className="post-date">{getFormattedDate(post.timestamp)}</p>
                            </div>
                            <p className="post-text-preview post-element">{parse(preview(post.text))}</p>
                            <div className="admin-button-container post-element">    
                                <button className="admin-button" id={post._id} onClick={handleDelete}>Delete</button>
                                <button className="admin-button" id={post._id} onClick={handleEdit}>Edit</button>
                                {post.published ? (
                                        <button className="admin-button" id={post._id} onClick={handlePubToggle}>Unpublish</button>
                                ) : (
                                        <button className="admin-button" id={post._id} onClick={handlePubToggle}>Publish</button>
                                )}
                            </div>
                        </div>     
                    ))
                ) : ( 
                    <p>There are no posts to display.</p>
                )}
            </ul>
        </div>
     );
}

export default Admin;
