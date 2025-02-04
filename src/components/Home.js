import { Link } from 'react-router-dom';
import { useState, useMemo, memo } from 'react';
import { useCachedUser } from '../hooks/usePostData';
import homeLogo from './assets/svg/home.svg';
import './fonts/SyneMono-Regular.ttf';

const CachedImage = memo(({ src, alt }) => {
  return <img className="post-img" src={src} alt={alt} />;
});

function Home({ posts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const cachedUser = useCachedUser();

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (!searchTerm.trim()) {
        return true;
      }
      return (
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [posts, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-text">
          <h1 className="title">Brain Thoughts .</h1>
          <p>
            Come and see! This is the place to let your inhibitions run free
            from the shackles of your captive mind.{' '}
            <Link to="/signup"> Sign Up Here</Link> and show us what you've got.
            Come and see what we've all got to say, then stick around to share
            your <strong>Brain Thoughts .</strong>
          </p>
          {cachedUser ? (
            <h2>Welcome, {cachedUser.fname}!</h2>
          ) : (
            <button>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                Sign Up
              </Link>
            </button>
          )}
        </div>
        <div className="hero-img">
          <img src={homeLogo} height="250" width="250" alt="svgblogimage"></img>
        </div>
      </div>

      <hr />
      <div className="search-bar-container">
        <h2 className="posts-h2">
          Posts({filteredPosts.filter((post) => post.published).length})
        </h2>
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
          value={searchTerm}
          onChange={handleSearch}
        ></input>
      </div>

      <div className="posts-container">
        {filteredPosts.map((post) => {
          if (post.published) {
            return (
              <div className="post-card" key={post._id}>
                <Link className="post-a" to={`/posts/${post._id}`}>
                  <CachedImage
                    src={post.imgUrl || 'https://picsum.photos/200/300'}
                    alt={`post image for ${post.title}`}
                  />
                </Link>
                <p className="post-title">
                  <Link className="post-a" to={`/posts/${post._id}`}>
                    <span style={{ fontWeight: 'bold' }}>{post.title}</span>
                    <span style={{ fontStyle: 'italic' }}>
                      {post.author
                        ? `${post.author.fname} ${post.author.lname}`
                        : 'anonymous'}
                    </span>
                  </Link>
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
