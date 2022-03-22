import { Link } from 'react-router-dom'
import homeLogo from './assets/svg/home.svg'

function Home({ posts }) {
    const publishedPosts = posts.filter(post => post.published)
    console.log(publishedPosts)
    return (
        <div className="home">
                <div className="hero">
                    <div className="hero-text">
                        <h1>Blog Title</h1>
                        <p>This is the spot where I would have a little paragraph explaining what this blog is all about. 
                            A short encouragement to <Link to='/signup'> Sign Up </Link> would precede a button to go there too.</p>
                        <button><Link to='/signup' style={{textDecoration: 'none'}}>Sign Up</Link></button>
                    </div>
                    <div className="hero-img">
                        <img src={homeLogo} height="400" width="400" alt="svgblogimage"></img>
                    </div>
                </div>

            <hr/>
            
            <h2>Posts({publishedPosts.length})</h2>
            <div className ="posts-container">
                {publishedPosts.map(post => 
                    (
                        <div className="post-card" key={post._id}>
                            <img className="post-img" src="https://picsum.photos/300/300" alt='pic'/>
                            <h3 className="post-title">
                                <a href={`/posts/${post._id}`}>{post.title}</a>
                                {post.author ? post.author.username : 'anonymous' }
                            </h3>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default Home