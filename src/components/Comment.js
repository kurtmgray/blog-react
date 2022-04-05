import React, { useState } from 'react'
import EditCommentForm from './EditCommentForm'
import { formatDistance, parseISO } from 'date-fns'
import { useCurrentUser } from '../hooks/usePostData'


function Comment({ 
    comment, 
    handleDelete, 
    onSaveEdit, 
    onEdit, 
    editedComment, 
    setEditedComment,
    }) {
        const [editMode, setEditMode] = useState(false)
        const { data: currentUser } = useCurrentUser()

        const toggleEditMode = () => {
            setEditMode(!editMode)
        }

        const onDelete = async (e) => {
            await handleDelete(e)
            toggleEditMode()
        }

        const formatCommentDate = (date) => {
            return formatDistance(parseISO(date), new Date(), {addSuffix: true})
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
                        <div className="comment-tools">
                                {currentUser && currentUser.admin ? (
                                    <div className="admin-button-container">
                                        <button className="admin-button" id={comment._id} onClick={e => onDelete(e)}>Delete</button>
                                        <button className="admin-button" id={comment._id} onClick={toggleEditMode}>Edit</button>
                                    </div>
                                ) : null}
                            <div className="comment-details">
                                <p className="comment-author">{comment.author.username}</p>
                                <p className="comment-date">{comment.timestamp ? formatCommentDate(comment.timestamp) : "less than a minute ago"}</p>
                            </div> 
                        </div>    
                    </div>
                    
            )}
            </div>    
            )
        }
}

export default Comment