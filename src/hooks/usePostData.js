import { useQuery, useMutation, useQueryClient } from "react-query";

// Login.js
const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) return null
    const res = await fetch('http://localhost:8000/api/users', {
        headers: { 
            Authorization: 'Bearer ' + token 
        },
    })
    const data = await res.json()
    console.log(data)    
    return data.user
}
export const useCurrentUser = () => {
    return useQuery("current-user", () => fetchCurrentUser())
}

const login = async ({ values }) => {
    const res = await fetch('http://localhost:8000/api/users/login', {
        method: "POST",
        headers: { 
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            username: values.username,
            password: values.password
        })
    })
    const data = await res.json()
    return data
}
export const useLogin = () => {
    const queryClient = useQueryClient()
    return useMutation(login, {
        onSuccess: (response) => {
            queryClient.setQueryData("current-user", response.user)
            localStorage.setItem('token', response.token)       
        }
    })
}

const fetchAllPosts = async () => {
    const res = await fetch('http://localhost:8000/api/posts')
    const data = await res.json()
    const timeSortedPosts = data.posts.sort((a, b) => (b.timestamp > a.timestamp) ? 1 : -1)
    return timeSortedPosts
}
export const usePostData = () => {
    return useQuery("posts", fetchAllPosts)
}

const fetchSinglePost = async (id) => {
    const res = await fetch(`http://localhost:8000/api/posts/${id}`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token') 
        }
    })
    const data = await res.json()
    return data.post
}
export const useSinglePost = (id) => {
    return useQuery(["post", id], () => fetchSinglePost(id))
}

const deleteSinglePost = async (singlePostId) => {
    const res = await fetch(`http://localhost:8000/api/posts/${singlePostId}`, {
        method: "DELETE",
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        },
    })
    const deletedPost = await res.json()
    return deletedPost
}
export const useDeleteSinglePost = () => {
    const queryClient = useQueryClient()
    return useMutation(deleteSinglePost, {
        onSuccess: (deletedPost) => {
            queryClient.setQueryData("posts", oldPosts => {
                const newPosts = [...oldPosts]
                const index = newPosts.findIndex(post => post._id === deletedPost.id)
                newPosts.splice(index, 1)
                return newPosts
            })
        }
    })
}

const fetchPostComments = async (id) => {
    const res = await fetch(`http://localhost:8000/api/posts/${id}/comments`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    })
    const data = await res.json()
    const timeSortedComments = data.comments.sort((a, b) => (b.timestamp > a.timestamp) ? -1 : 1)
    return timeSortedComments
}
export const usePostComments = (id) => {
    return useQuery("post-comments", () => fetchPostComments(id))
}

const postNewComment = async ({id, currentUser, newComment}) => {
    const res = await fetch(`http://localhost:8000/api/posts/${id}/comments`, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json', 
            Authorization: 'Bearer ' + localStorage.getItem('token') 
        },
        body: JSON.stringify({
            author: currentUser.id,
            text: newComment,
            post: id
        })
    })
    return await res.json()
}
export const useAddComment = () => {
    const queryClient = useQueryClient()
    return useMutation(postNewComment, {
        // update handling
        onSuccess: (response) => {
            queryClient.setQueryData("post-comments", (oldPostComments) => {
                return [...oldPostComments, response.comment] 
            })
        }
    })
}

const deleteComment = async ({e, id}) => {
    const res = await fetch(`http://localhost:8000/api/posts/${id}/comments/${e.target.id}`, {
        method: "DELETE",
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        },
    })
    return await res.json()
}
export const useDeleteComment = () => {
    const queryClient = useQueryClient()
    return useMutation(deleteComment, {
        onSuccess: (response) => {
            queryClient.setQueryData("post-comments", oldComments => {
                const newComments = [...oldComments]
                const index = newComments.findIndex(comment => comment._id === response.id)
                newComments.splice(index, 1)
                return newComments
            })
        }    
    })
}

const saveEdit = async ({e, id, editedComment}) => {
    const res = await fetch(`http://localhost:8000/api/posts/${id}/comments/${e.target.id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
                Authorization: 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                text: editedComment
            })
        })
        return await res.json()
}
export const useSaveEdit = () => {
    const queryClient = useQueryClient()
    return useMutation(saveEdit, {
        onSuccess: (response) => {
            console.log(response.updatedComment)
            queryClient.setQueryData("post-comments", (oldPostComments) => {
                const newPostComments = [...oldPostComments]
                const updatedCommentIndex = newPostComments.findIndex(post => post._id === response.updatedComment._id)
                newPostComments.splice(updatedCommentIndex, 1, response.updatedComment)
                return newPostComments
            })
        }
    })
}

const publishToggle = async ({ post }) => {    
    const res = await fetch(`http://localhost:8000/api/posts/${post._id}`, {
        method: "PATCH",
        headers: { 
            "Content-type": "application/json",
            Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
            published: !post.published
        }),
    })
    const data = await res.json()
    return data.updatedPost
}
export const usePublishToggle = (id) => {
    const queryClient = useQueryClient()
    return useMutation(publishToggle, {
        onSuccess: (response) => {
            if (id) {
                queryClient.setQueryData(["post", id], response)
            }    
            queryClient.setQueryData("posts", oldPosts => {
                const newPosts = [...oldPosts]
                const updatedPostIndex = newPosts.findIndex(post => post._id === response._id)
                newPosts.splice(updatedPostIndex, 1, response)
                return newPosts
            })
        }
    })
}

const editPost = async ({ id, postData, values }) => {
    const res = await fetch(`http://localhost:8000/api/posts/${id}`, {
        method: "PUT",
        headers: { 
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token') 
        },
        body: JSON.stringify({
            _id: postData._id,
            author: postData.author ? postData.author : null,
            title: values.title,
            text: values.text,
            published: values.published,
            imgUrl: postData.imgUrl,
            timestamp: postData.timestamp
        })
    })
    const data = await res.json()
    //does not yet return updated post
    return data
}
export const useEditPost = (id) => {
    const queryClient = useQueryClient()
    return useMutation(editPost, {
        onSuccess: () => {
            if (id) {
                queryClient.invalidateQueries(["post", id])
            }    
            queryClient.invalidateQueries("posts")
        }
    })
}

const createPost = async ({ currentUser, newPost }) => {
    console.log(currentUser, newPost)
    const res = await fetch("http://localhost:8000/api/posts/", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json', 
            Authorization: 'Bearer ' + localStorage.getItem('token')  
        },
        body: JSON.stringify({
            author: currentUser.id,
            title: newPost.title,
            imgUrl: newPost.imgUrl,
            text: newPost.text,
            published: newPost.published,

        })
    })
    const data = await res.json()
    console.log(data)
    return data.post
}
export const useCreatePost = () => {
    const queryClient = useQueryClient()
    return useMutation(createPost, {
        onSuccess: (response) => {
            queryClient.setQueryData("posts", (oldPosts) => {
                return [response,...oldPosts] 
            })
        }
    })
}