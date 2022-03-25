import React, { useEffect } from 'react';

function EditCommentForm({ comment, editedComment, setEditedComment, toggleEditMode, onSaveEdit }) {

    useEffect (() => {
        setEditedComment(comment.text)
    },[])
    
    return ( 
        <form onSubmit={onSaveEdit}>
            <label htmlFor="title">Comment:</label>
            <textarea 
                type="text" 
                name="comment" 
                value={editedComment}
                onChange={e => setEditedComment(e.target.value)}
                required>
            </textarea>
            <button onClick={toggleEditMode}>Cancel</button>
            <button type="submit">Save</button>    
        </form>
     );
}

export default EditCommentForm;