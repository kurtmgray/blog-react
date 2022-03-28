import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../UserContext'
import { useNavigate } from 'react-router'
import { Editor } from '@tinymce/tinymce-react'

function Create() {
    const [title, setTitle] = useState('')    
    const [text, setText] = useState('')
    const [imgUrl, setImgUrl] = useState('')    
    const [published, setPublished] = useState(false)
    const [disable, setDisable] = useState(true)
    const { currentUser } = useContext(UserContext)
    let navigate = useNavigate()
    
    useEffect(() => {
        title && text ? setDisable(false) : setDisable(true)
    }, [title, text])
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        try {
            const res = await fetch("http://localhost:8000/api/posts/", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json', 
                    Authorization: 'Bearer ' + token  
                },
                body: JSON.stringify({
                    author: currentUser ? currentUser.id : null,
                    title: title,
                    imgUrl: imgUrl,
                    text: text,
                    published: published,

                })
            })
            const data = await res.json()
            console.log('Success', data)
            navigate('/dashboard')

        } catch(err) {
            console.error(err)
        }
        setTitle('')
        setText('')
    }

    console.log(title, text)

    return (
        <div className="create-container">
            <div className="create">
                <h1>Create Post</h1>
                <form onSubmit={handleSubmit}>
                    <label className="title" htmlFor="title"><h3>Post Title:</h3></label>
                    <input 
                        className="title-input"
                        type="text" 
                        name="title"  
                        value={title} 
                        onChange={e => setTitle(e.target.value)}
                        required>
                    </input>
                    <label className="imgUrl" htmlFor="imgUrl"><h3>Image URL:</h3></label>
                    <input 
                        className="imgUrl-input"
                        type="text" 
                        name="imgUrl"  
                        value={imgUrl} 
                        onChange={e => setImgUrl(e.target.value)}>
                    </input>        
                    <label className="text-input" htmlFor="text"><h3>Content:</h3></label>
                    <Editor
                        apiKey="vs2svkfmnbjh55w224iibrp0wuz7u8oj90t57boctnrbcgrg"
                        init={{
                            height: 400,
                            menubar: false,
                            plugins: [
                                "advlist autolink lists link image",
                                "charmap print preview anchor help",
                                "searchreplace visualblocks code",
                                "insertdatetime media table paste wordcount",
                            ],
                            toolbar:
                                // prettier-ignore
                                "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | help",
                        }}
                        value={text}
                        textareaName="content"
                        onEditorChange={(content) => setText(content)}
                    ></Editor>
                    {/* <textarea className="new-post"
                        type="text" 
                        name="text" 
                        value={text}
                        onChange={e => setText(e.target.value)}
                        required>
                    </textarea> */}
                    <div className="publish">
                        <label htmlFor="published"><h3>Publish?</h3></label>
                        <input 
                            type="checkbox"
                            name="published"
                            rows="5"
                            columns="32"
                            onClick={e => setPublished(!published)}>    
                        </input>
                    </div>     
                    <button type="submit" disabled={disable}>Submit Post</button>
                </form>
            </div>    
        </div>
    )
}

export default Create