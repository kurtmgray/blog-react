import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import {
  useSinglePost,
  useEditPost,
  useCurrentUser,
} from "../hooks/usePostData";

function EditPost() {
  const { data: currentUser } = useCurrentUser();

  const { id } = useParams();
  const [values, setValues] = useState({
    title: "",
    text: "",
    imgUrl: "",
    published: false,
  });

  let navigate = useNavigate();

  const { data: postData, isLoading } = useSinglePost(id);

  useEffect(() => {
    if (
      !currentUser ||
      !postData ||
      (postData.author._id !== currentUser.id && !currentUser.admin)
    ) {
      navigate(`/posts/${id}`);
    }
    if (postData) {
      setValues({
        title: postData.title,
        text: postData.text,
        imgUrl: postData.imgUrl,
        published: postData.published,
      });
    }
  }, [currentUser, postData, id, navigate]);

  const { mutate: editPost } = useEditPost();
  const handleSubmit = async (e) => {
    e.preventDefault();
    editPost({ postData, values });
    navigate(`/posts/${id}`);
  };

  const handleCancel = () => {
    navigate(`/posts/${id}`);
  };

  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="edit">
      <h1>Edit Post</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">
            <h3>Post Title:</h3>
          </label>
          <input
            type="text"
            name="title"
            value={values.title}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                [e.target.name]: e.target.value,
                published: false,
              }))
            }
            required
          ></input>
          <label htmlFor="title">
            <h3>Image URL:</h3>
          </label>
          <input
            type="text"
            name="imgUrl"
            value={values.imgUrl}
            onChange={(e) => {
              setValues((v) => ({
                ...v,
                imgUrl: e.target.value,
                published: false,
              }));
              console.log(values);
            }}
            required
          ></input>
        </div>
        <div>
          <label className="text-input" htmlFor="text">
            <h3>Content:</h3>
          </label>
          <Editor
            apiKey="vs2svkfmnbjh55w224iibrp0wuz7u8oj90t57boctnrbcgrg"
            init={{
              height: 400,
              menubar: false,
              plugins: [
                "advlist autolink lists link image",
                "charmap print preview anchor help",
                "searchreplace visualblocks code",
                "insertdatetime media table paste wordcount",
              ],
              toolbar:
                // prettier-ignore
                "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | help",
            }}
            value={values.text}
            textareaName="text"
            onEditorChange={(text) =>
              setValues((v) => ({ ...v, text: text, published: false }))
            }
          ></Editor>
        </div>

        {currentUser.canPublish ? (
          <div className="publish-toggle">
            <label htmlFor="published">Publish?</label>
            <input
              type="checkbox"
              name="published"
              checked={values.published}
              onChange={(e) =>
                setValues((v) => ({ ...v, [e.target.name]: e.target.checked }))
              }
            ></input>
          </div>
        ) : (
          <div>
            <p display="true">You do not have permission to publish.</p>
          </div>
        )}
        <div className="edit-buttons">
          <button onClick={handleCancel}>Cancel</button>
          <button type="submit">
            Submit {!currentUser.canPublish && "for Approval"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPost;
