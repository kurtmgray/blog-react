import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import parse from "html-react-parser";
import {
  useSinglePost,
  usePostComments,
  useAddComment,
  useDeleteComment,
  useSaveCommentEdit,
  usePublishToggle,
  useDeleteSinglePost,
  useCurrentUser,
} from "../hooks/usePostData";

function SinglePost() {
  const { data: currentUser } = useCurrentUser();
  const { id } = useParams();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editedCommentText, setEditedCommentText] = useState("");
  let navigate = useNavigate();

  const { data: singlePost, isLoading: singlePostIsLoading } =
    useSinglePost(id);
  const { data: postComments } = usePostComments(id);

  const { mutate: deletePost } = useDeleteSinglePost();
  const handleDeletePost = () => {
    deletePost({ id });
    navigate("/dashboard");
  };

  const { mutate: publishToggle } = usePublishToggle();
  const handlePubToggle = async () => {
    publishToggle({ post: singlePost });
  };

  const handleEditPost = () => {
    navigate(`/posts/${id}/edit`);
  };

  const { mutate: addComment } = useAddComment();
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    addComment({ id, currentUser, newComment });
    setNewComment("");
    setShowCommentForm(false);
  };

  const { mutate: deleteComment } = useDeleteComment();
  const handleDeleteComment = async (e) => {
    e.preventDefault();
    deleteComment({ e, id });
  };

  const { mutate: saveCommentEdit } = useSaveCommentEdit();
  const handleSaveCommentEdit = async (e) => {
    e.preventDefault();
    saveCommentEdit({ e, id, editedCommentText });
  };

  if (singlePostIsLoading) return <p>loading...</p>;

  return (
    <div>
      <div className="single-post-container">
        <img
          className="post-img"
          src={
            singlePost.imgUrl
              ? singlePost.imgUrl
              : "https://picsum.photos/200/300"
          }
          alt="pic"
        />
        <h3>{singlePost.title}</h3>
        <div>{parse(singlePost.text)}</div>
        {singlePost.author ? <p>{singlePost.author.fname}</p> : null}
        {postComments && postComments.length > 0 ? (
          <div className="comment-container">
            <h3>Comments ({postComments.length})</h3>
            {postComments.map((comment) => (
              <Comment
                key={comment._id ? comment._id : "tempkey"}
                comment={comment}
                handleDelete={handleDeleteComment}
                onSaveEdit={handleSaveCommentEdit}
                editedComment={editedCommentText}
                setEditedComment={setEditedCommentText}
              />
            ))}
          </div>
        ) : null}
        {!showCommentForm ? (
          currentUser ? (
            <button onClick={() => setShowCommentForm(true)}>
              Add Comment
            </button>
          ) : (
            <button disabled>Log in to comment</button>
          )
        ) : (
          <CommentForm
            value={newComment}
            onChange={setNewComment}
            onSubmit={handleSubmitComment}
            showCommentForm={showCommentForm}
          />
        )}
        {currentUser &&
          (currentUser.admin || currentUser.id === singlePost.author._id) && (
            <div className="single-post-buttons">
              <button id={singlePost._id} onClick={handleDeletePost}>
                Delete Post
              </button>
              <button id={singlePost._id} onClick={handleEditPost}>
                Edit Post
              </button>
              <button id={singlePost._id} onClick={handlePubToggle}>
                {singlePost.published ? "Unpublish Post" : "Publish Post"}
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

export default SinglePost;
