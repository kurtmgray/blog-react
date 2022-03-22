import React, { useEffect, useState } from 'react'

function Comment({postId, commentId}) {
    const [comment, setComment] = useState(null)
    
    useEffect(() => {
        const token = localStorage.getItem('token')

        fetch(`http://localhost:8000/api/posts/${postId}/comments/${commentId}`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then(res => res.json())
        .then(data => setComment(data.comment))
      }, [postId, commentId])
    
    if (!comment) return (<p>Loading...</p>) 
    else {
      return (
            <div className="comment">
                <p className="comment-text">{comment.text}</p>
                <div className="comment-details">
                    <p className="comment-author">{comment.author.username}</p>
                    <p className="comment-date">{comment.timestamp}</p>
                </div>
            </div>
        )
    }
}

export default Comment