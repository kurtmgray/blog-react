import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../UserContext'
import Comment from './Comment'
import { useParams, useNavigate } from 'react-router-dom'

function SinglePost() {
    const { currentUser } = useContext(UserContext)
    const { id } = useParams()
    const [userCanEdit, setUserCanEdit] = useState(false)
    const [post, setPost] = useState(null)
    const [showCommentForm, setShowCommentForm] = useState({'display': 'none'})
    const [newComment, setNewComment] = useState('')
    const [postComments, setPostComments] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
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
    }, [id])
    
    const handleSubmit = async (e) => {
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
                    author: currentUser ? currentUser.id : 'anonymous',
                    text: newComment,
                    post: id
                })
            })
            const data = await res.json()
            console.log('Success', data)
            navigate(`/posts/${id}`)

        } catch(err) {
            console.error(err)
        }
        setNewComment('')
        setShowCommentForm({'display': 'none'})
    }

    const handleShowCommentForm= () => {
        setShowCommentForm(null)
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
                                />
                            ))}
                        </div>) 
                    : null }
                    <button onClick={handleShowCommentForm}>Add Comment</button>
                    {userCanEdit ? (
                        <div className="single-post-buttons">
                            <button id={post._id} onClick={console.log('delete')}>Delete Post</button>
                            <button id={post._id} onClick={console.log('edit')}>Edit Post</button>
                            {post.published ? (
                                    <button id={post._id} onClick={console.log('unpublish')}>Unpublish Post</button>
                            ) : (
                                    <button id={post._id} onClick={console.log('publish')}>Publish Post</button>
                            )}
                        </div>    
                    ) : null}
                </div>
                <div style={showCommentForm}>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="title">Comment:</label>
                        <textarea 
                            type="text" 
                            name="comment" 
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            required>
                        </textarea>
                        <button type="submit">Post Comment</button>    
                    </form>
                </div>
            </div>
        )
    } 
}

export default SinglePost