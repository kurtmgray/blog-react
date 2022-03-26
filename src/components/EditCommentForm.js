import React, { useEffect } from 'react';

function EditCommentForm({ comment, editedComment, setEditedComment, toggleEditMode, onSaveEdit }) {

    useEffect (() => {
        setEditedComment(comment.text)
    },[])

    const onSubmit = (e) => {
        onSaveEdit(e) 
        toggleEditMode()
    }

    if (!editedComment) return "Loading..."
    
    return ( 
        <div >
            <form className="comment" onSubmit={onSubmit} id={comment._id}>
                <textarea 
                    className="edit-comment"
                    type="text" 
                    name="comment" 
                    value={editedComment}
                    onChange={e => setEditedComment(e.target.value)}
                    required>
                </textarea>
                <div className="admin-button-container">
                    <button className="admin-button" onClick={toggleEditMode}>Cancel</button>
                    <button className="admin-button" type="submit">Save</button>
                </div>    
            </form>
        </div>
     );
}

export default EditCommentForm;