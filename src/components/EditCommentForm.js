import React, {useState, useEffect, useContext} from 'react';
import { UserContext } from '../UserContext';

function EditCommentForm({postId, commentId, setEditMode}) {
    const { currentUser } = useContext(UserContext)
    const [comment, setComment] = useState()

    useEffect (() => {
        const getComment = async () => {
            const res = await fetch()

            const data = res.json()
            setComment(data.comment)
        }
        getComment()
    })
    
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setEditMode(false)

        const res = await fetch()
    }
    
    return ( 
        <form onSubmit={handleSubmit}>
            <label htmlFor="title">Comment:</label>
            <textarea 
                type="text" 
                name="comment" 
                value={comment}
                onChange={e => setComment(e.target.value)}
                required>
            </textarea>
            <button type="submit">Submit Edit</button>    
        </form>
     );
}

export default EditCommentForm;