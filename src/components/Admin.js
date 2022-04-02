import React, { useEffect } from 'react';
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import parse from 'html-react-parser'
import { 
    usePostData,
    usePublishToggle,
    useDeleteSinglePost,
    useCurrentUser
} from '../hooks/usePostData'

function Admin() {
    let navigate = useNavigate()
    const { data: currentUser } = useCurrentUser()

    useEffect(() => {
        if (!currentUser || !currentUser.admin) {
            navigate('/')   
        } 
    },[])
    
    const { data: posts } = usePostData()
    
    const { mutate: deletePost } = useDeleteSinglePost()
    const handleDelete = (e) => {
        deletePost(e.target.id)
    }
    
    const { mutate: publishToggle } = usePublishToggle()
    const handlePubToggle = async (e) => {
        const post = posts.find(post => post._id === e.target.id)
        publishToggle({ post })
    }

    const handleEdit = (e) => {
        const post = posts.find(post => post._id === e.target.id)
        navigate(`/posts/${post._id}/edit`) 
    }

    function getFormattedDate(timestamp) {
        return format(parseISO(timestamp), "MMMM dd" );
    }

    const preview = (text) => {
        return text.slice(0, 200) + '...'
    }
    
    return ( 
        <div>
            <h2>Admin Page</h2>
            <ul>
                {posts.length > 0 ? (
                    posts.map(post =>  (
                        <div className={`admin-post ${post.published ? 'published' : 'unpublished'}`} key={post._id}>
                            <Link to={`/posts/${post._id}`} className="post-img post-element" style={{textDecoration: 'none'}}>
                                <img className="post-img post-element" src={post.imgUrl ? post.imgUrl : 'https://picsum.photos/200/300'} alt="pic"></img>
                            </Link>
                            <div className="post-details post-element">
                                <h4 className="post-title">{post.title}</h4>
                                <p className="post-author">{post.author ? post.author.username : 'anonymous' }</p>
                                <p className="post-date">{getFormattedDate(post.timestamp)}</p>
                            </div>
                            <p className="post-text-preview post-element">{parse(preview(post.text))}</p>
                            <div className="admin-button-container post-element">    
                                <button className="admin-button" id={post._id} onClick={handleDelete}>Delete</button>
                                <button className="admin-button" id={post._id} onClick={handleEdit}>Edit</button>
                                <button className="admin-button" id={post._id} onClick={handlePubToggle}>
                                    {post.published ? 'Unpublish' : 'Publish'} 
                                </button>
                            </div>
                        </div>     
                    ))
                ) : ( 
                    <p>There are no posts to display.</p>
                )}
            </ul>
        </div>
     );
}

export default Admin;
