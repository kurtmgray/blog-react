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
            from the shackles of your captive mind.{" "}
            <Link to="/signup"> Sign Up Here</Link> and show us what you've got.
            Come and see what we've all got to say, then stick around to share
            your <strong>Brain Thoughts .</strong>
          </p>
          <button>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              Sign Up
            </Link>
          </button>
        </div>
        <div className="hero-img">
          <img src={homeLogo} height="250" width="250" alt="svgblogimage"></img>
        </div>
      </div>

      <hr />

      <h2 className="posts-h2">Posts({posts.filter((post) => post.published).length})</h2>
      <div className="posts-container">
        {posts.map((post) => {
          if (post.published) {
            return (
              <div className="post-card" key={post._id}>
                <a className="post-a" href={`/posts/${post._id}`}>
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
                <p className="post-title">
                <a
                  className="post-a"
                  href={`/posts/${post._id}`}
                >
                  <span style={{ fontWeight: "bold" }}>{post.title}</span>
                  <span style={{ fontStyle: "italic" }}>
                    {post.author
                      ? `${post.author.fname} ${post.author.lname}`
                      : "anonymous"}
                  </span>
                </a>
                </p>
              </div>
            );
          } else return null;
        })}
      </div>
    </div>
  );
}

export default Home;
