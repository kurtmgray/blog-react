import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router'
import { UserContext } from '../UserContext';

function Dashboard({ posts, setPosts }) {
    const {currentUser, setCurrentUser} = useContext(UserContext)
    
    const [published, setPublished] = useState([])
    const [unPublished, setUnpublished] = useState([])
    
    let navigate = useNavigate()
    
    const populatePosts = () => {
        if (currentUser) {
            const findPublished = currentUser.posts.filter(post => post.published !== true)
            const findUnpublished = currentUser.posts.filter(post => post.published === false)
            console.log(findPublished, findUnpublished)
            setPublished(findPublished)
            setUnpublished(findUnpublished)
        }
    }
    useEffect(()=> {
        const token = localStorage.getItem('token')
        // pass this token to header
        fetch('http://localhost:8000/protected' , {
            headers: { 
                Authorization: token 
            }
        }).then(res => {
            console.log('res', res)
            if (!res.ok) {
                navigate('/login')
            }
        }).catch(err => {
            console.log('err', err)
        })

        populatePosts()

    }, [])

    console.log(currentUser)
    
    return (
        <div>
            {currentUser ? (
                <div>
                    <h2>Welcome {currentUser.username}</h2> 
                    <ul> Published Posts 
                        {published !== [] ? (
                            published.map(post => <li>{post.title}</li>)
                        ) : (
                            <p>You have no published posts</p> 
                        )} 
                    </ul>
                    <ul> Unpublished Posts
                        {unPublished !== [] ? (
                            unPublished.map(post => <li>{post.title}</li>)
                        ) : (
                            <p>'You have no unpublished posts'</p>
                        )}
                    </ul>
                </div>
            ) : (
                <h2>Please log in to use your Dashboard</h2>
            )}
            
        </div>
    )
}

export default Dashboard