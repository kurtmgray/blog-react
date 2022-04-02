import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../UserContext'
import { useNavigate } from 'react-router'
import { Editor } from '@tinymce/tinymce-react'
import { useCreatePost, useCurrentUser } from '../hooks/usePostData'

function Create() {
    //const { currentUser } = useContext(UserContext)
    const { data: currentUser } = useCurrentUser()

    const [disable, setDisable] = useState(true)
    const [newPost, setNewPost] = useState({
        title: '',
        text: '',
        imgUrl: '',
        published: false
    })
    
    let navigate = useNavigate()
    
    useEffect(() => {
        if (!currentUser) {
            navigate('/login')
        }
        newPost.title && newPost.text ? setDisable(false) : setDisable(true)
    }, [currentUser, navigate, newPost.title, newPost.text])
    
    const { mutate: createPost } = useCreatePost()
    const handleSubmit = async (e) => {
        e.preventDefault()
        createPost({ currentUser, newPost })
        setNewPost({
            title: '',
            text: '',
            imgUrl: '',
            published: false
        })
        navigate('/dashboard')
    }

    console.log(newPost)

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
                        value={newPost.title} 
                        onChange={e => setNewPost(v => ({...v, [e.target.name]: e.target.value}))}
                        required>
                    </input>
                    <label className="imgUrl" htmlFor="imgUrl"><h3>Image URL:</h3></label>
                    <input 
                        className="imgUrl-input"
                        type="text" 
                        name="imgUrl"  
                        value={newPost.imgUrl} 
                        onChange={e => setNewPost(v => ({...v, [e.target.name]: e.target.value}))}>
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
                        value={newPost.text}
                        textareaName="text"
                        onEditorChange={text => setNewPost(v => ({ ...v, text: text }))}
                    ></Editor>
                    <div className="publish">
                        <label htmlFor="published"><h3>Publish?</h3></label>
                        <input 
                            type="checkbox"
                            name="published"
                            rows="5"
                            columns="32"
                            onClick={e => setNewPost(v => ({ ...v, [e.target.name]: e.target.checked }))}>    
                        </input>
                    </div>     
                    <button type="submit" disabled={disable}>Submit Post</button>
                </form>
            </div>    
        </div>
    )
}

export default Create