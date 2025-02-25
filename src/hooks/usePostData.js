import { useQuery, useMutation, useQueryClient } from 'react-query';

// const BASE_URL = 'http://localhost:8000/api';
const BASE_URL = 'https://murmuring-dusk-26608.herokuapp.com/api';

const fetchCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const res = await fetch(`${BASE_URL}/users`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  const data = await res.json();
  return data.user;
};
export const useCurrentUser = () => {
  return useQuery('current-user', () => fetchCurrentUser());
};

const login = async ({ values }) => {
  if (values.user) {
    // console.log("google auth pathway");
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        googleId: values.user.sub,
        profile: values.user,
      }),
    });
    const data = await res.json();
    if (!data.success) {
      throw {
        message: data.message,
        field: data.field,
      };
    }
    return data;
  } else {
    // console.log("non oauth pathway");
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    });
    const data = await res.json();
    if (!data.success) {
      throw {
        message: data.message,
        field: data.field,
      };
    }
    return data;
  }
};
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation(login, {
    onError: (err) => err,
    onSuccess: (response) => {
      queryClient.setQueryData('current-user', response.user);
      queryClient.setQueryData('users', (oldUsers = []) => [
        response.user,
        ...oldUsers,
      ]);
      localStorage.setItem('token', response.token);
    },
  });
};

const fetchAllPosts = async () => {
  const res = await fetch(`${BASE_URL}/posts`);
  const data = await res.json();
  const timeSortedPosts = data.posts.sort((a, b) =>
    b.timestamp > a.timestamp ? 1 : -1
  );
  return timeSortedPosts;
};
export const usePostData = () => {
  return useQuery('posts', fetchAllPosts);
};

const fetchSinglePost = async (id) => {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  });
  const data = await res.json();
  return data.post;
};
export const useSinglePost = (id) => {
  return useQuery(['post', id], () => fetchSinglePost(id));
};

const deleteSinglePost = async ({ id }) => {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  });
  const deletedPost = await res.json();
  return deletedPost;
};
export const useDeleteSinglePost = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteSinglePost, {
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries('posts');
      const previousPosts = queryClient.getQueryData('posts');
      queryClient.setQueryData('posts', (oldPosts) =>
        oldPosts ? oldPosts.filter((post) => post._id !== id) : []
      );
      return { previousPosts };
    },
    onError: (err, _deletePostData, context) => {
      queryClient.setQueryData('posts', context.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries('posts');
    },
  });
};

const fetchPostComments = async (id) => {
  const res = await fetch(`${BASE_URL}/posts/${id}/comments`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  });
  const data = await res.json();
  const timeSortedComments = data.comments.sort((a, b) =>
    b.timestamp > a.timestamp ? -1 : 1
  );
  return timeSortedComments;
};
export const usePostComments = (id) => {
  return useQuery(['post-comments', id], () => fetchPostComments(id));
};

const postNewComment = async ({ id, currentUser, newComment }) => {
  const res = await fetch(`${BASE_URL}/posts/${id}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    body: JSON.stringify({
      author: currentUser.id,
      text: newComment,
      post: id,
    }),
  });
  return await res.json();
};
export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation(postNewComment, {
    onMutate: async ({ id, currentUser, newComment }) => {
      // console.log(currentUser);
      await queryClient.cancelQueries(['post-comments', id]);
      const previousComments = queryClient.getQueryData(['post-comments', id]);
      queryClient.setQueryData(['post-comments', id], (oldPostComments) => {
        return [
          ...oldPostComments,
          {
            author: {
              username: currentUser.username,
              id: currentUser.id,
            },
            text: newComment,
            post: id,
            timestamp: new Date().toISOString(),
          },
        ];
      });
      return { previousComments };
    },
    onError: (_err, newCommentData, context) => {
      queryClient.setQueryData(
        ['post-comments', newCommentData.id],
        context.previousComments
      );
    },
    onSettled: (_data, _err, newCommentData) => {
      queryClient.invalidateQueries(['post-comments', newCommentData.id]);
    },
  });
};

const deleteComment = async ({ e, id }) => {
  const res = await fetch(`${BASE_URL}/posts/${id}/comments/${e.target.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  });
  return await res.json();
};
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteComment, {
    onMutate: async ({ e, id }) => {
      await queryClient.cancelQueries(['post-comments', id]);
      const previousComments = queryClient.getQueryData(['post-comments', id]);
      queryClient.setQueryData(['post-comments', id], (oldPostComments) => {
        const newPostComments = [...oldPostComments];
        const index = newPostComments.findIndex(
          (comment) => comment._id === e.target.id
        );
        newPostComments.splice(index, 1);
        return newPostComments;
      });
      return { previousComments };
    },
    onError: (_err, deletePostData, context) => {
      queryClient.setQueryData(
        ['post-comments', deletePostData.id],
        context.previousComments
      );
    },
    onSettled: (_err, _data, deletePostData) => {
      queryClient.invalidateQueries(['post-comments', deletePostData.id]);
    },
  });
};

const saveCommentEdit = async ({ e, id, editedCommentText }) => {
  const res = await fetch(`${BASE_URL}/posts/${id}/comments/${e.target.id}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    body: JSON.stringify({
      text: editedCommentText,
    }),
  });
  return await res.json();
};
export const useSaveCommentEdit = () => {
  const queryClient = useQueryClient();
  return useMutation(saveCommentEdit, {
    onMutate: async ({ e, id, editedCommentText }) => {
      await queryClient.cancelQueries(['post-comments', id]);
      const previousComments = queryClient.getQueryData(['post-comments', id]);
      queryClient.setQueryData(['post-comments', id], (oldPostComments) => {
        const newPostComments = [...oldPostComments];
        const editedCommentIndex = newPostComments.findIndex(
          (comment) => comment._id === e.target.id
        );
        const editedComment = newPostComments.find(
          (comment) => comment._id === e.target.id
        );
        newPostComments.splice(editedCommentIndex, 1, {
          ...editedComment,
          text: editedCommentText,
        });
        return newPostComments;
      });
      return { previousComments };
    },
    onError: (_err, editPostData, context) => {
      queryClient.setQueryData(
        ['post-comments', editPostData.id],
        context.previousComments
      );
    },
    onSettled: (_data, _err, editPostData) => {
      queryClient.invalidateQueries(['post-comments', editPostData.id]);
    },
  });
};

const publishToggle = async ({ post }) => {
  const res = await fetch(`${BASE_URL}/posts/${post._id}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    body: JSON.stringify({
      published: !post.published,
    }),
  });
  const data = await res.json();
  // console.log(data.updatedPost);
  return data.updatedPost;
};
export const usePublishToggle = () => {
  const queryClient = useQueryClient();
  return useMutation(publishToggle, {
    onMutate: async ({ post }) => {
      await queryClient.cancelQueries(['post', post._id]);
      await queryClient.cancelQueries('posts');
      const previousPost = queryClient.getQueryData(['post', post._id]);
      const previousPosts = queryClient.getQueryData('posts');
      queryClient.setQueryData(['post', post._id], () => {
        queryClient.setQueryData('posts', (oldPosts) => {
          const newPosts = [...oldPosts];
          const updatedPostIndex = newPosts.findIndex(
            (newPost) => newPost._id === post._id
          );
          newPosts.splice(updatedPostIndex, 1, {
            ...post,
            published: !post.published,
          });
          return newPosts;
        });
        return { ...post, published: !post.published };
      });
      return { previousPost, previousPosts };
    },
    onError: (_err, { post }, context) => {
      queryClient.setQueryData(
        ['post', context.previousPost._id],
        context.previousPost
      );
      queryClient.setQueryData('posts', context.previousPosts);
    },
    onSettled: (_data, _err, { post }) => {
      queryClient.invalidateQueries(['post', post._id]);
      queryClient.invalidateQueries('posts');
    },
  });
};

const editPost = async ({ postData, values }) => {
  // console.log(values.imgUrl);
  const res = await fetch(`${BASE_URL}/posts/${postData._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    body: JSON.stringify({
      _id: postData._id,
      author: postData.author ? postData.author : null,
      title: values.title,
      text: values.text,
      published: values.published,
      imgUrl: values.imgUrl,
      timestamp: postData.timestamp,
    }),
  });
  const data = await res.json();
  //does not return updated post
  return data;
};
export const useEditPost = (id) => {
  const queryClient = useQueryClient();
  return useMutation(editPost, {
    onMutate: async ({ postData, values }) => {
      await queryClient.cancelQueries(['post', postData._id]);
      await queryClient.cancelQueries('posts');
      const previousPost = queryClient.getQueryData(['post'], postData._id);
      const previousPosts = queryClient.getQueryData('posts');
      queryClient.setQueryData(['post', postData._id], (oldPost) => {
        // console.log(values);
        return {
          ...oldPost,
          _id: postData._id,
          author: postData.author ? postData.author : null,
          title: values.title,
          text: values.text,
          published: values.published,
          imgUrl: values.imgUrl,
          timestamp: postData.timestamp,
        };
      });
      return { previousPost, previousPosts };
    },
    onError: (_err, _updatedPost, context) => {
      queryClient.setQueryData(
        ['post', context.previousPost._id],
        context.previousPost
      );
      queryClient.setQueryData('posts', context.previousPosts);
    },
    onSettled: (_data, _err, editedPost) => {
      queryClient.invalidateQueries(['post', editedPost.postData._id]);
      queryClient.invalidateQueries('posts');
    },
  });
};

const createPost = async ({ currentUser, newPost }) => {
  function generateImageSourceUrl() {
    const hash = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/id/${hash}/250`;
  }
  // console.log(currentUser, newPost);
  const res = await fetch(`${BASE_URL}/posts/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    body: JSON.stringify({
      author: currentUser.id,
      title: newPost.title,
      imgUrl: newPost.imgUrl === '' ? generateImageSourceUrl() : newPost.imgUrl,
      text: newPost.text,
      published: newPost.published,
    }),
  });
  const data = await res.json();
  return data.post;
};
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation(createPost, {
    onMutate: async ({ currentUser, newPost }) => {
      await queryClient.cancelQueries('posts');
      const previousPostData = queryClient.getQueryData('posts');
      queryClient.setQueryData('posts', (oldPostsData) => {
        // console.log(oldPostsData);
        return [
          {
            author: {
              username: currentUser.username,
              id: currentUser.id,
            },
            title: newPost.title,
            imgUrl: newPost.imgUrl,
            text: newPost.text,
            published: newPost.published,
          },
          ...oldPostsData,
        ];
      });
      return { previousPostData };
    },
    onError: (_error, _newPostData, context) => {
      queryClient.setQueryData('posts', context.previousPostData);
    },
    onSettled: () => {
      queryClient.invalidateQueries('posts');
    },
  });
};

const createUser = async ({ userData }) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: userData.username,
      password: userData.password,
      fname: userData.fname,
      lname: userData.lname,
    }),
  });

  const data = await res.json();
  if (!data.success) {
    throw {
      message: 'Error creating user',
      errors: data,
    };
  }
  return data.user;
};
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ userData }) => {
      // Check if user exists in cache before making the API call
      const cachedUsers = queryClient.getQueryData('users') || [];
      const userExistsInCache = cachedUsers.some(
        (user) => user.username === userData.username
      );

      if (userExistsInCache) {
        throw {
          message: 'Username is already in cache.',
          field: 'usernameTaken',
        };
      }

      return createUser({ userData });
    },
    {
      onSuccess: (newUser) => {
        queryClient.setQueryData('users', (oldUsers = []) => [
          newUser,
          ...oldUsers,
        ]);
      },
      onError: (error) => {
        return error;
      },
    }
  );
};

export const useCachedUser = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData('current-user');
};
