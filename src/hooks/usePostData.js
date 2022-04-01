import { useQuery, useMutation, useQueryClient } from "react-query";

// Login.js
const fetchCurrentUser = async (token) => {
    if (!token) return null
    const res = await fetch('http://localhost:8000/api/users', {
        headers: { 
            Authorization: 'Bearer ' + token 
        },
    })
    return await res.json()
}
export const useFetchCurrentUser = (token) => {
    return useQuery(["current-user", token], () => fetchCurrentUser(token))
}

const login = async ({username, password}) => {
    console.log(username, password)
    const res = await fetch('http://localhost:8000/api/users/login', {
        method: "POST",
        headers: { 
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    return await res.json()
}
export const useLogin = () => {
    const queryClient = useQueryClient()
    return useMutation(login, {
        onSuccess: (response) => {
            console.log(response)
            queryClient.setQueryData("current-user", response)       
        }
    })
}

// SinglePost.js
const fetchAllPosts = async () => {
    const res = await fetch('http://localhost:8000/api/posts')
    const data = await res.json()
    const timeSortedPosts = data.posts.sort((a, b) => (b.timestamp > a.timestamp) ? 1 : -1)
    return timeSortedPosts
}
export const usePostData = () => {
    return useQuery("posts", fetchAllPosts)
}

const fetchSinglePost = async (token, id) => {
    const res = await fetch(`http://localhost:8000/api/posts/${id}`, {
        headers: {
            Authorization: 'Bearer ' + token 
        }
    })
    const json = await res.json()
    debugger;
    return await json.post
    // return { post:json.updatedPost}
}
export const useSinglePost = (token, id) => {

    return useQuery(["post", id], () => fetchSinglePost(token, id))
}

const deleteSinglePost = async ({e, token}) => {
    await fetch(`http://localhost:8000/api/posts/${e.target.id}`, {
        method: "DELETE",
        headers: {
            Authorization: 'Bearer ' + token
        },
    })
}
export const useDeleteSinglePost = () => {
    const queryClient = useQueryClient()
    return useMutation(deleteSinglePost, {
        onSuccess: () => {
            queryClient.invalidateQueries("posts")
        }
    })
}

const fetchPostComments = async (token, id) => {
    const res = await fetch(`http://localhost:8000/api/posts/${id}/comments`, {
        headers: {
            Authorization: 'Bearer ' + token
        }
    })
    const data = await res.json()
    const timeSortedComments = data.comments.sort((a, b) => (b.timestamp > a.timestamp) ? -1 : 1)
    return timeSortedComments
}
export const usePostComments = (token, id) => {
    return useQuery("post-comments", () => fetchPostComments(token, id))
}

const postNewComment = async ({token, id, currentUser, newComment}) => {
    const res = await fetch(`http://localhost:8000/api/posts/${id}/comments`, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json', 
            Authorization: 'Bearer ' + token  
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

const deleteComment = async ({e, token, id}) => {
    const res = await fetch(`http://localhost:8000/api/posts/${id}/comments/${e.target.id}`, {
        method: "DELETE",
        headers: {
            Authorization: 'Bearer ' + token
        },
    })
    return await res.json()
}
export const useDeleteComment = () => {
    const queryClient = useQueryClient()
    return useMutation(deleteComment, {
        onSuccess: () => {
            queryClient.invalidateQueries("post-comments")
        }    
    })
}

const saveEdit = async ({e, token, id, editedComment}) => {
    const res = await fetch(`http://localhost:8000/api/posts/${id}/comments/${e.target.id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
                Authorization: 'Bearer ' + token
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

const publishToggle = async ({e, token, post}) => {    
    const res = await fetch(`http://localhost:8000/api/posts/${e.target.id}`, {
        method: "PATCH",
        headers: { 
            "Content-type": "application/json",
            Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
            published: !post.published
        }),
    })
    const json = await res.json()

    return json.updatedPost
}
export const usePublishToggle = (id) => {
    const queryClient = useQueryClient()
    
    return useMutation(publishToggle, {
        // mutationKey: ["posts", id]
        // not working as expected...
        // need to click out of window for render items to update
        onSuccess: (response) => {
            queryClient.setQueryData(["post", id], response)
        }
    })
}