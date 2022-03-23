import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../UserContext'
import Comment from './Comment'
import CommentForm from './CommentForm'
import { useParams, useNavigate } from 'react-router-dom'

function SinglePost({ posts, setPosts }) {
    const { currentUser } = useContext(UserContext)
    const { id } = useParams()
    const [userCanEdit, setUserCanEdit] = useState(false)
    const [post, setPost] = useState(null)
    const [showCommentForm, setShowCommentForm] = useState(false)
    const [postComments, setPostComments] = useState([])
    const [reload, setReload] = useState(false)

    let navigate = useNavigate()

    useEffect(() => {
        setReload(false)
        const token = localStorage.getItem('token')
        const getSinglePost = async () => {
            const res = await fetch(`http://localhost:8000/api/posts/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + token 
                }
            })
            const data = await res.json()
            setPost(data.post)
        }
        const getPostComments = async () => {
            const res = await fetch(`http://localhost:8000/api/posts/${id}/comments`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            const data= await res.json()
            setPostComments(data.comments)
        }
        const canUserEdit = async () => {
            if ((currentUser && currentUser.admin) || 
            (currentUser && (currentUser.id === await post.author._id))) {
                setUserCanEdit(true)
            } else {
                setUserCanEdit(false)
            }
        }
        getSinglePost()
        getPostComments()
        canUserEdit()
    }, [id, reload])
    
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
    
    const handleShowCommentForm= () => {
        setShowCommentForm(true)
    }

    console.log(post)
    
    if(!post) return (<p>loading...</p>)
    else {
        return (
            <div>    
                <div className="single-post-container">
                    <img className="post-img" src="https://picsum.photos/600/400" alt='pic'/>
                    <h3>{post.title}</h3>
                    <p>{post.text}</p>
                    {post.author ? <p>{post.author.fname}</p> : null }
                    {postComments.length ? (
                        <div className="comment-container">
                            <h3>Comments:</h3>
                            {postComments.map(comment => (
                                <Comment 
                                    key={comment._id}
                                    postId={id}
                                    commentId={comment._id}
                                    setReload={setReload}
                                />
                            ))}
                        </div>) 
                    : null }
                    {!showCommentForm ? (
                        <button onClick={handleShowCommentForm} >Add Comment</button>
                    ) : (    <CommentForm 
                            id={id}
                            setShowCommentForm={setShowCommentForm}
                            setReload={setReload}
                        />
                    )}
                    {userCanEdit &&
                        <div className="single-post-buttons">
                            <button id={post._id} onClick={handleDelete}>Delete Post</button>
                            <button id={post._id} onClick={handleEdit}>Edit Post</button>
                            {post.published ? (
                                    <button id={post._id} onClick={handlePubToggle}>Unpublish Post</button>
                            ) : (
                                    <button id={post._id} onClick={handlePubToggle}>Publish Post</button>
                            )}
                        </div>    
                    }
                </div>
                
            </div>
        )
    } 
}

export default SinglePost