
function Home({ posts }) {
    // conditional rendering new
    
    return (
        <div>
            <h2>Home Page</h2>
            <ul>
                {posts.map(post => post.published ?
                    (
                        <li key={post._id}>
                            <a href={`/posts/${post._id}`}>{post.title}</a> - {post.author ? post.author.username : 'anonymous' }
                        </li>
                    ) : null )}
            </ul>
        </div>
    )
}

export default Home