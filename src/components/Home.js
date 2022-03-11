
function Home(props) {
    return (
        <div>
            <p>home page</p>
            <ul>
                {props.posts.map(post => (
                    <li key={post._id}><a href={`posts/${post._id}`}>{post.title}</a></li>
                ))}
            </ul>
        </div>
    )
}

export default Home