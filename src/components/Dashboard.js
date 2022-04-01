import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext';
import parse from 'html-react-parser'
import {
    usePostData,

} from '../hooks/usePostData'


function Dashboard({ posts }) {
    const {currentUser, setCurrentUser} = useContext(UserContext)
    const [published, setPublished] = useState(null)
    const [unpublished, setUnpublished] = useState(null)
    
    let navigate = useNavigate()
    
    // const { data: posts } = usePostData()
    
    useEffect(() => {
        if (!currentUser) {
            navigate('/login')
        }
        setPublished(posts.filter(post => post.published))
        setUnpublished(posts.filter(post => !post.published))
    }, [])
    


    const preview = (text) => {
        return text.slice(0, 200)+'...'
    }
    
    return (
        <div>
            {currentUser ? (
                <div>
                    <h2>Welcome to your Dashboard, {currentUser.username}.</h2> 
                    <div className="dashboard-posts-container">
                        <h3>Published Posts</h3>
                        <hr/> 
                            {published && published.length > 0 ? (
                                published.map(post => 
                                    <Link to={`/posts/${post._id}`} key={post._id} style={{textDecoration: 'none'}}>
                                        <div className="dashboard-post post-element" >
                                            <img className="db-post-img post-element" src={post.imgUrl ? post.imgUrl : 'https://picsum.photos/200/300'} alt="pic"></img>
                                            <div>
                                                <h4 className="db-post-title post-element">{post.title}</h4>
                                                <div className="db-text-preview post-element">
                                                    {parse(preview(post.text), { trim: true })}
                                                </div>
                                                <p className="post-element" style={{fontStyle:'italic'}}>read more...</p>
                                            </div>    
                                        </div>     
                                    </Link>
                                )
                            ) : (
                                <p>You have no published posts.</p> 
                            )} 
                        <h3>Unpublished Posts</h3>
                        <hr/> 
                            {unpublished && unpublished.length > 0 ? (
                                unpublished.map(post =>
                                    <Link to={`/posts/${post._id}`} key={post._id} style={{textDecoration: 'none'}}> 
                                        <div className="dashboard-post post-element" >
                                            <img className="db-post-img post-element" src={post.imgUrl ? post.imgUrl : 'https://picsum.photos/200/300'} alt="pic"></img>
                                            <div>
                                                <h4 className="db-post-title post-element">{post.title}</h4>
                                                <div className="db-text-preview post-element">
                                                    {parse(preview(post.text), { trim: true })}
                                                </div>
                                                <p className="post-element" style={{fontStyle:'italic'}}>read more...</p>
                                            </div>
                                        </div>    
                                    </Link>

                                )
                            ) : (
                                <p>You have no unpublished posts.</p>
                            )}
                    </div>
                </div>
            ) : (
                <h2>Please log in to use your Dashboard</h2>
            )}
            
        </div>
    )
}

export default Dashboard