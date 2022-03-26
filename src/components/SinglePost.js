import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserContext } from '../UserContext'
import Comment from './Comment'
import CommentForm from './CommentForm'
import { formatDistance } from 'date-fns'

function SinglePost({ posts, setPosts }) {
    const { currentUser } = useContext(UserContext)
    const { id } = useParams()
    const [userCanEdit, setUserCanEdit] = useState(false)
    const [post, setPost] = useState(null)
    const [showCommentForm, setShowCommentForm] = useState(false)
    const [postComments, setPostComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [editedComment, setEditedComment] = useState()

    let navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        getSinglePost(token)
        getPostComments(token)
        canUserEdit()
    }, [id])

    const getSinglePost = async (token) => {
        const res = await fetch(`http://localhost:8000/api/posts/${id}`, {
            headers: {
                Authorization: 'Bearer ' + token 
            }
        })
        const data = await res.json()
        setPost(data.post)
    }

    const getPostComments = async (token) => {
        const res = await fetch(`http://localhost:8000/api/posts/${id}/comments`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        const data= await res.json()
        const timeSortedComments = data.comments.sort((a, b) => (b.timestamp > a.timestamp) ? -1 : 1)
        setPostComments(timeSortedComments)
    }

    const canUserEdit = async () => {
        if ((currentUser && currentUser.admin) || 
        (currentUser && (currentUser.id === await post.author._id))) {
            setUserCanEdit(true)
        } else {
            setUserCanEdit(false)
        }
    }

    const getAllPosts = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/posts')
            const data = await res.json()
            setPosts(data.posts)
        } catch (err) {
            console.error('error fetching data', err)
        }
    }
   
    const handleDeletePost = async (e) => {
        const token = localStorage.getItem('token')

        await fetch(`http://localhost:8000/api/posts/${e.target.id}`, {
            method: "DELETE",
            headers: {
                Authorization: 'Bearer ' + token
            },
        })
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

    const handleEditPost = (e) => {
        const post = posts.find(post => post._id === e.target.id)
        navigate(`/posts/${post._id}/edit`) 
    }

    const handleSubmitComment = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        try {
            console.log('called')
            const res = await fetch(`http://localhost:8000/api/posts/${id}/comments`, {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json', 
                    Authorization: 'Bearer ' + token  
                },
                body: JSON.stringify({
                    author: currentUser.id,
                    text: newComment,
                    post: id
                })
            })
            const data = await res.json()
            console.log('Success', data)
            
            // author is not populated, so author.username (in Comment component) is invalid
            // const postCommentsCopy = [...postComments]
            // postCommentsCopy.push(data.comment)
            // setPostComments(postCommentsCopy)
            
            getPostComments(token)
            setEditedComment('')
            setShowCommentForm(false)
        } catch(err) {
            console.error(err)
        }
    }

    const handleDeleteComment = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        console.log(token)
        try {
            const res = await fetch(`http://localhost:8000/api/posts/${id}/comments/${e.target.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: 'Bearer ' + token
                },
            })
            const data = await res.json()
            console.log(data)
            getPostComments(token)
        } catch (err) {
            console.log(err)
        }
    }

    const handleSaveEdit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        try {
            const res = await fetch(`http://localhost:8000/api/posts/${id}/comments/${e.target.id}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    Authorization: 'Bearer ' + token
                },
                body: JSON.stringify({
                    text: editedComment
                })
            })
            const data = await res.json()
            const postCommentsCopy = [...postComments]
            const updatedCommentIndex = postComments.findIndex(post => post._id === data.updatedComment._id)
            postCommentsCopy.splice(updatedCommentIndex, 1, data.updatedComment)
            setPostComments(postCommentsCopy)
            setShowCommentForm(false)
        } catch (err) {
            console.log(err)
        }
    }

    if(!post) return (<p>loading...</p>)
    else {
        return (
            <div>    
                <div className="single-post-container">
                    <img className="post-img" src="https://picsum.photos/600/400" alt='pic'/>
                    <h3>{post.title}</h3>
                    <p >{post.text}</p>
                    {post.author ? <p>{post.author.fname}</p> : null }
                    {postComments.length ? (
                        <div className="comment-container">
                            <h3>Comments ({postComments.length})</h3>
                            {postComments.map(comment => (
                                <Comment 
                                    key={comment._id}
                                    comment={comment}
                                    handleDelete={handleDeleteComment}
                                    onSaveEdit={handleSaveEdit}
                                    editedComment={editedComment}
                                    setEditedComment={setEditedComment}

                                />
                            ))}
                        </div>) 
                    : null }
                    {!showCommentForm ? (
                        currentUser ? (
                            <button onClick={() => setShowCommentForm(true)} >Add Comment</button>
                        ) : (
                            <button disabled="true">Log in to comment</button>
                        )    
                    ) : ( <CommentForm 
                            value={newComment}
                            onChange={setNewComment}
                            onSubmit={handleSubmitComment}
                            showCommentForm={showCommentForm}
                        
                        />
                    )}
                    {userCanEdit &&
                        <div className="single-post-buttons">
                            <button id={post._id} onClick={handleDeletePost}>Delete Post</button>
                            <button id={post._id} onClick={handleEditPost}>Edit Post</button>
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