import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'


function EditPost() {
    const { currentUser } = useContext(UserContext)
    const [post, setPost] = useState({})
    const [title, setTitle] = useState('')    
    const [text, setText] = useState('')
    const [published, setPublished] = useState(false)    
    const { id } = useParams()

    let navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')

        console.log(id)
        try{
            const getPost = async (id) => {
                const res = await fetch(`http://localhost:8000/api/posts/${id}`, {
                    headers: {
                        Authorization: 'Bearer ' + token 
                    }
                })
                const data = await res.json()
                console.log(data)
                setPost(data.post)
            }
            getPost(id)
        } catch (err) {
            console.error(err)
        }    
    }, [id])
    
    useEffect(() => {
        setTitle(post.title)
        setText(post.text)
        setPublished(post.published)
    }, [post])

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
                     
                <button type="submit">Submit Edit</button>    
            </form>
        </div>
     );
}

export default EditPost;