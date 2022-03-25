import React from 'react'

function CommentForm({ onSubmit, value, onChange }) {
  
    return ( 
        <form onSubmit={onSubmit}>
            <label htmlFor="title">Comment:</label>
            <textarea 
                type="text" 
                name="comment" 
                value={value}
                onChange={e => onChange(e.target.value)}
                required>
            </textarea>
            <button type="submit">Post Comment</button>    
        </form>
     );
}

export default CommentForm;