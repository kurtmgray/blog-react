import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../UserContext'
import Comment from './Comment'

function SinglePost({ id }) {
    const {currentUser, setCurrentUser} = useContext(UserContext)

    console.log(currentUser)
    
    const [post, setPost] = useState(null)

    useEffect(() => {

        fetch(`http://localhost:8000/api/posts/${id}`)
        .then(res => res.json())
        .then(data => setPost(data.posts))
        .finally(()=>{
            console.log(id)
        })
    }, [id])
    
    console.log(post)
    
    if(!post) return (<p>loading...</p>)
    else {
        return (
            <div>
                <h3>{post.title}</h3>
                <p>{post.text}</p>
                {/* <p>{post.author.fname}</p> */}
                {post.comments.map(commentId => (
                    <Comment 
                        key={commentId}
                        postId={id}
                        commentId={commentId}
                    />
                ))}
            </div>
        )
    } 
}

export default SinglePost