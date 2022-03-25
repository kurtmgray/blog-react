import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'


function EditPost() {
    const { currentUser } = useContext(UserContext)
    const [post, setPost] = useState(null)
    const [title, setTitle] = useState('')    
    const [text, setText] = useState('')
    const [published, setPublished] = useState(false)    
    const { id } = useParams()

    let navigate = useNavigate()

    const getPost = async (id) => {
        const token = localStorage.getItem('token')
        const res = await fetch(`http://localhost:8000/api/posts/${id}`, {
            headers: {
                Authorization: 'Bearer ' + token 
            }
        })
        const data = await res.json()
        console.log(data)
        return data.post
    }

    useEffect(() => {
        const init = async () => {
            try{
                const postData = await getPost(id)
                if (!currentUser || !postData || postData.author._id !== currentUser.id) {
                    navigate(`/posts/${id}`)
                    return
                }
                setPost(postData)
                setTitle(postData.title)
                setText(postData.text)
                setPublished(postData.published)
            } catch (err) {
                console.error(err)
            }    
        }
        init()
    }, [id])

    console.log(title, text, published)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        
        console.log('submitted')
        try {
            const res = await fetch(`http://localhost:8000/api/posts/${id}`, {
                method: "PUT",
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token 
                },
                body: JSON.stringify({
                    _id: post._id,
                    author: post.author ? post.author : null,
                    title: title,
                    text: text,
                    published: published,
                    timestamp: post.timestamp
                })
            })
            const data = await res.json()
            console.log('Success', data)
            navigate(`/posts/${id}`)

        } catch (err) {
            console.error(err)
        }
    }

    const handleCancel = () => {
        navigate(`/posts/${id}`)
    }

    if (!post) return null

    return ( 
        <div>
            <h1>Edit Post</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Post Title:</label>
                <input 
                    type="text" 
                    name="title"  
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    required>
                </input>    
                <label htmlFor="text">Content:</label>
                <textarea 
                    type="text" 
                    name="text" 
                    value={text}
                    onChange={e => setText(e.target.value)}
                    required>
                </textarea>
                <label htmlFor="published">Publish?</label>
                <input 
                    type="checkbox"
                    name="published"
                    checked={published}
                    onChange={e => setPublished(!published)}>    
                </input>
                <div class="edit-buttons">
                    <button onClick={handleCancel}>Cancel</button>         
                    <button type="submit">Submit Edit</button>    
                </div>
            </form>
        </div>
    )
}


export default EditPost;