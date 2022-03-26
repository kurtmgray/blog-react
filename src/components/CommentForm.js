import React from 'react'

function CommentForm({ onSubmit, value, onChange, showCommentForm }) {
  
    return ( 
        <form className="comment" onSubmit={onSubmit}>
            <label htmlFor="title">New Comment:</label>
            <textarea 
                className="edit-comment"
                type="text" 
                name="comment" 
                value={value}
                onChange={e => onChange(e.target.value)}
            >
            </textarea>
            <div className="admin-button-container">
                <button className="admin-button" onClick={() => showCommentForm(false)}>Cancel</button>
                <button className="admin-button" type="submit">Post</button>    
            </div>
        </form>
     );
}

export default CommentForm;