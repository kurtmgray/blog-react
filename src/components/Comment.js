import React, { useState, useContext } from 'react'
import { UserContext } from '../UserContext'
import EditCommentForm from './EditCommentForm'

function Comment({ 
    comment, 
    onDelete, 
    onSaveEdit, 
    onEdit, 
    editedComment, 
    setEditedComment }) {
        const { currentUser } = useContext(UserContext)
        const [editMode, setEditMode] = useState(false)
        // state kept down here so toggle doesn't effect all comments
                
        const toggleEditMode = () => {
            setEditMode(!editMode)
        }

        if (!comment) return (<p>Loading...</p>) 
        else {
        return (
            <div>
                {editMode ? (
                    <EditCommentForm 
                        comment={comment}
                        editedComment={editedComment}
                        setEditedComment={setEditedComment}
                        toggleEditMode={toggleEditMode}
                        onEdit={onEdit}
                        onSaveEdit={onSaveEdit}
                    />
                ) : (
                    <div className="comment">
                        <p className="comment-text">{comment.text}</p>
                        <div className="comment-details">
                            <p className="comment-author">{comment.author.username}</p>
                            <p className="comment-date">{comment.timestamp}</p>
                        </div>
                        {currentUser && currentUser.admin ? (
                            <div className="admin-button-container">
                                <button className="admin-button" id={comment._id} onClick={onDelete}>Delete Comment</button>
                                <button className="admin-button" id={comment._id} onClick={toggleEditMode}>Edit Comment</button>
                            </div>
                        ) : null}    
                    </div>
                    
            )}
            </div>    
            )
        }
}

export default Comment