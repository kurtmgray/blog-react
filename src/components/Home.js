import { Link } from "react-router-dom";
import homeLogo from "./assets/svg/home.svg";
import "./fonts/SyneMono-Regular.ttf";

function Home({ posts }) {
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-text">
          <h1 className="title">Brain Thoughts .</h1>
          <p>
            Come and see! This is the place to let your inhibitions run free
            from the shackles of your captive mind. You're better off without
            them anyway, unless you're just going to say something terrible or
            stupid. <Link to="/signup"> Sign Up Here</Link> and show us what
            you've got. Come and see what we've all got to say, then stick
            around to share one or several ... Brain Thoughts .
          </p>
          <button>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              Sign Up
            </Link>
          </button>
        </div>
        <div className="hero-img">
          <img src={homeLogo} height="400" width="400" alt="svgblogimage"></img>
        </div>
      </div>

      <hr />

      <h2>Posts({posts.filter((post) => post.published).length})</h2>
      <div className="posts-container">
        {posts.map((post) => {
          if (post.published) {
            return (
              <div className="post-card" key={post._id}>
                <a href={`/posts/${post._id}`}>
                  <img
                    className="post-img"
                    src={
                      post.imgUrl
                        ? post.imgUrl
                        : "https://picsum.photos/200/300"
                    }
                    alt="pic"
                  />
                </a>
                <h3 className="post-title">
                  <a href={`/posts/${post._id}`}>{post.title}</a>
                  {post.author ? post.author.username : "anonymous"}
                </h3>
              </div>
            );
          } else return null;
        })}
      </div>
    </div>
  );
}

export default Home;
