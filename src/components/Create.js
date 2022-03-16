import React, { useState, useContext } from 'react'
import { UserContext } from '../UserContext'


function Create({posts, setPosts}) {
    const [title, setTitle] = useState('')    
    const [text, setText] = useState('')    
    const [published, setPublished] = useState(false)
    const { currentUser } = useContext(UserContext)
    
    console.log(currentUser)
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch("http://localhost:8000/api/posts/", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    author: currentUser ? currentUser.id : null,
                    title: title,
                    text: text,
                    published: published
                })
            })
            const data = res.json()
            console.log('Success', data)

        } catch(err) {
            console.log(err)
        }
        setTitle('')
        setText('')
    }

    console.log(title, text)

    return (
        <div>
            <h1>Create Post</h1>
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
                    rows="5"
                    columns="32"
                    onClick={e => setPublished(!published)}>    
                </input>
                     
                <button type="submit">Submit Post</button>    
            </form>
        </div>
    )
}

export default Create