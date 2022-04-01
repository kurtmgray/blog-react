import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserContext } from '../UserContext'
import Comment from './Comment'
import CommentForm from './CommentForm'
import parse from 'html-react-parser'
import { 
    useSinglePost, 
    usePostComments, 
    useAddComment,
    useDeleteComment,
    useSaveEdit,
    usePublishToggle,
    useDeleteSinglePost 
    } from '../hooks/usePostData'


function SinglePost({ posts }) {
    const { currentUser } = useContext(UserContext)
    const { id } = useParams()
    const [showCommentForm, setShowCommentForm] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [editedComment, setEditedComment] = useState('')
    const [token, setToken] = useState('')
    let navigate = useNavigate()

    useEffect(() => {
        setToken(localStorage.getItem('token'))
    }, [])
        
    const { data: singlePost, isLoading: singlePostIsLoading } = useSinglePost(token, id)
    const { data: postComments } = usePostComments(token, id)

    const { mutate: deletePost } = useDeleteSinglePost()
    const handleDeletePost = (e) => {
        deletePost({e, token})
        navigate('/dashboard')  
    }

    const { mutate: publishToggle } = usePublishToggle()
    const handlePubToggle = async (e) => {
        const post = posts.find(post => post._id === e.target.id)
        publishToggle({e, token, post})
    }

    const handleEditPost = () => {
        navigate(`/posts/${id}/edit`) 
    }

    const { mutate: addComment } = useAddComment()
    const handleSubmitComment = async (e) => {
        e.preventDefault()
        addComment({token, id, currentUser, newComment})
        setNewComment('')
        setShowCommentForm(false)
    }

    const { mutate: deleteComment } = useDeleteComment()
    const handleDeleteComment = async (e) => {
        e.preventDefault()
        deleteComment({e, token, id})
    }

    const { mutate: saveEdit } = useSaveEdit()
    const handleSaveEdit = async (e) => {
        e.preventDefault()
        saveEdit({e, token, id, editedComment})
    }

    if(singlePostIsLoading) return (<p>loading...</p>)
    else {
        return (
            <div>    
                <div className="single-post-container">
                    <img className="post-img" src={singlePost.post.imgUrl} alt='pic'/>
                    <h3>{singlePost.post.title}</h3>
                    <div>
                        {parse(singlePost.post.text)}
                    </div>
                    {singlePost.post.author ? <p>{singlePost.post.author.fname}</p> : null }
                    {postComments && postComments.length > 0 ? (
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
                    {currentUser && currentUser.admin &&
                        <div className="single-post-buttons">
                            <button id={singlePost.post._id} onClick={handleDeletePost}>Delete Post</button>
                            <button id={singlePost.post._id} onClick={handleEditPost}>Edit Post</button>
                            {singlePost.post.published ? (
                                    <button id={singlePost.post._id} onClick={handlePubToggle}>Unpublish Post</button>
                            ) : (
                                    <button id={singlePost.post._id} onClick={handlePubToggle}>Publish Post</button>
                            )}
                        </div>    
                    }
                </div>
                
            </div>
        )
    } 
}

export default SinglePost