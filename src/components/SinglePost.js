import React, { useState, useEffect } from 'react'
import Comment from './Comment'

function SinglePost({ id }) {
    const [post, setPost] = useState(null)
    
    useEffect(() => {
        fetch(`http://localhost:8000/api/posts/${id}`)
        .then(res => res.json())
        .then(data => setPost(data.posts))
      }, [id])

      console.log(post)
    
    return (
        <div>
            <h3>{post.title}</h3>
            <p>{post.text}</p>
            <p>{post.author.fname}</p>
            {/* {post.comments.map(commentId => (
                <Comment 
                    key={commentId}
                    postId={id}
                    commentId={commentId}
                />
            ))} */}
        </div>
    )
}

export default SinglePost