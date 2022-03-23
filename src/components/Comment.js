import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../UserContext'
import EditCommentForm from './EditCommentForm'

function Comment({postId, commentId, setReload}) {
    const [comment, setComment] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const { currentUser } = useContext(UserContext)

    const getComment = async (token) => {
        try {
            const res = await fetch(`http://localhost:8000/api/posts/${postId}/comments/${commentId}`, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            const data = await res.json()
            setComment(data.comment)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        getComment(token)
    }, [postId, commentId, editMode])

    const handleDelete = async (e) => {
        const token = localStorage.getItem('token')
        console.log(token)
        try {
            const res = await fetch(`http://localhost:8000/api/posts/${postId}/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    Authorization: 'Bearer ' + token
                },
            })
            const data = await res.json()
            console.log(data)

        } catch (err) {
            console.log(err)
        }
        setReload(true)
    }

    const handleEdit = () => {
        setEditMode(true)
    }
    
    if (!comment) return (<p>Loading...</p>) 
    else {
      return (
        <div>
            {!editMode ? (
                <div className="comment">
                    <p className="comment-text">{comment.text}</p>
                    <div className="comment-details">
                        <p className="comment-author">{comment.author.username}</p>
                        <p className="comment-date">{comment.timestamp}</p>
                    </div>
                    {currentUser && currentUser.admin ? (
                        <div className="admin-button-container">
                            <button className="admin-button" id={commentId} onClick={handleDelete}>Delete Comment</button>
                            <button className="admin-button" id={commentId} onClick={handleEdit}>Edit Comment</button>
                        </div>
                    ) : null}    
                </div>
            ) : (
                // <EditCommentForm 
                //     commentId={commentId}
                //     postId={postId}
                //     setEditMode={setEditMode}
                // />
null            )}
        </div>    
        )
    }
}

export default Comment