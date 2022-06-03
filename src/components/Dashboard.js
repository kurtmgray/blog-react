import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import { usePostData, useCurrentUser } from "../hooks/usePostData";

function Dashboard() {
  const { data: currentUser } = useCurrentUser();
  const { data: posts, isLoading: postsIsLoading } = usePostData();
  let navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  console.log(posts);
  console.log(currentUser);

  const userPosts = posts.filter((post) => post.author._id === currentUser.id);

  const preview = (text) => {
    return text.length > 200 ? text.slice(0, 200) + "..." : text.slice(0, 200);
  };
  if (postsIsLoading) {
    console.log("loading");
    return "Updating posts";
  }
  if (!userPosts) return "Updating user posts...";

  return (
    <div>
      {currentUser ? (
        <div>
          <h2>Welcome to your Dashboard, {currentUser.username}.</h2>
          <div className="dashboard-posts-container">
            <h3>Published Posts</h3>
            <hr />
            {userPosts && userPosts.some((post) => post.published) ? (
              userPosts.map((post) => {
                if (post.published) {
                  return (
                    <Link
                      to={`/posts/${post._id}`}
                      key={post._id}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="dashboard-post post-element">
                        <img
                          className="db-post-img post-element"
                          src={
                            post.imgUrl
                              ? post.imgUrl
                              : "https://picsum.photos/200/300"
                          }
                          alt="pic"
                        ></img>
                        <div>
                          <h4 className="db-post-title post-element">
                            {post.title}
                          </h4>
                          <div className="db-text-preview post-element">
                            {parse(preview(post.text), { trim: true })}
                          </div>
                          <p
                            className="post-element"
                            style={{ fontStyle: "italic" }}
                          >
                            read more...
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                } else return null;
              })
            ) : (
              <p>You have no published posts.</p>
            )}
            <h3>Unpublished Posts</h3>
            <hr />
            {userPosts && userPosts.some((post) => !post.published) ? (
              userPosts.map((post) => {
                if (!post.published) {
                  return (
                    <Link
                      to={`/posts/${post._id}`}
                      key={post._id}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="dashboard-post post-element">
                        <img
                          className="db-post-img post-element"
                          src={
                            post.imgUrl
                              ? post.imgUrl
                              : "https://picsum.photos/200/300"
                          }
                          alt="pic"
                        ></img>
                        <div>
                          <h4 className="db-post-title post-element">
                            {post.title}
                          </h4>
                          <div className="db-text-preview post-element">
                            {parse(preview(post.text), { trim: true })}
                          </div>
                          <p
                            className="post-element"
                            style={{ fontStyle: "italic" }}
                          >
                            read more...
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                } else return null;
              })
            ) : (
              <p>You have no unpublished posts.</p>
            )}
          </div>
        </div>
      ) : (
        <h2>Please log in to use your Dashboard</h2>
      )}
    </div>
  );
}

export default Dashboard;
