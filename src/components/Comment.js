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
            <div>
                <h4>{comment.text}</h4>
                {/* <p>{comment.author.lname}</p> */}
            </div>
        )
    }
}

export default Comment