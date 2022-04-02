import React, { useState, useContext } from 'react'
import { UserContext } from '../UserContext'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../hooks/usePostData'

function CommentForm({ id, setShowCommentForm, setReload }) {
    //const { currentUser } = useContext(UserContext)
    
    const { data: currentUser } = useCurrentUser()
    const [newComment, setNewComment] = useState('')

    let navigate = useNavigate()

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
            
        } catch(err) {
            console.error(err)
        }
        setNewComment('')
        setShowCommentForm(false)
        setReload(true)
        navigate(`/posts/${id}`)
    }
    
    return ( 
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
     );
}

export default CommentForm;