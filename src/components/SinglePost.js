import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../UserContext'
import Comment from './Comment'
import { useParams } from 'react-router-dom'

function SinglePost() {
    const { currentUser } = useContext(UserContext)
    const [userCanEdit, setUserCanEdit] = useState(false)
    const { id } = useParams()
    const [post, setPost] = useState(null)
    
    useEffect(() => {
        const token = localStorage.getItem('token')
        const getSinglePost = async () => {
            const res = await fetch(`http://localhost:8000/api/posts/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + token 
                }
            })
            const data = await res.json()
            setPost(data.post)
        }
        const canUserEdit = async () => {
            if ((currentUser && currentUser.admin) || 
            (currentUser && (currentUser.id === await post.author._id))) {
                setUserCanEdit(true)
            } else {
                setUserCanEdit(false)
            }
        }
        getSinglePost()
        canUserEdit()
    }, [id])
    
    console.log(post)
    
    if(!post) return (<p>loading...</p>)
    else {
        return (
            <div className="single-post-container">
                <img className="post-img" src="https://picsum.photos/600/400" alt='pic'/>
                <h3>{post.title}</h3>
                <p>{post.text}</p>
                {post.author ? <p>{post.author.fname}</p> : null }
                {post.comments.map(commentId => (
                    <Comment 
                        key={commentId}
                        postId={id}
                        commentId={commentId}
                    />
                ))}
                {userCanEdit ? (
                    <div className="single-post-buttons">
                        <button id={post._id} onClick={console.log('delete')}>Delete Post</button>
                        <button id={post._id} onClick={console.log('edit')}>Edit Post</button>
                        {post.published ? (
                                <button id={post._id} onClick={console.log('unpublish')}>Unpublish Post</button>
                        ) : (
                                <button id={post._id} onClick={console.log('publish')}>Publish Post</button>
                        )}
                    </div>    
                ) : null}

            </div>
        )
    } 
}

export default SinglePost