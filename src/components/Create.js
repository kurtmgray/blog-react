import React, { useState, useEffect } from 'react'



function Create({ validUser, posts, setPosts}) {
    const [title, setTitle] = useState('')    
    const [text, setText] = useState('')    
    const [published, setPublished] = useState(false)
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        await fetch("http://localhost:8000/api/posts/create", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                text: text,
                published: published
            })
        })
        .then(res => res.json())
        .then(data => console.log('Success', data))
        .catch(err => console.log(err))
        .finally(() => {
            setTitle('')
            setText('')
        })
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
                    required="true">
                </input>    
                <label htmlFor="text">Content:</label>
                <textarea 
                    type="text" 
                    name="text" 
                    value={text}
                    onChange={e => setText(e.target.value)}
                    required="true">
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