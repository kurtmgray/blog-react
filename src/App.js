import './App.css';
import React, { useState, useEffect, useMemo } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Admin from './components/Admin';
import Home from './components/Home'
import Login from './components/Login'
import Create from './components/Create'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import SinglePost from './components/SinglePost'
import EditPost from './components/EditPost';
import Logout from './components/Logout'
import { UserContext } from './UserContext';

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [posts, setPosts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()

  const value = useMemo(() => ({currentUser, setCurrentUser}), [currentUser, setCurrentUser])

  useEffect(() => {
    const token = localStorage.getItem('token')
        
    if (token) {
      const getUser = async () => {
        try {
          const res = await fetch('http://localhost:8000/api/users', {
            headers: { 
              Authorization: 'Bearer ' + token 
            },
          })
          const data = await res.json()
          setCurrentUser(data.user)
        } catch (err) {
          console.error(err)
        }
      } 
      getUser()
    } else {
      setCurrentUser(null)
    }
  }, [])

  useEffect( () => {
    const getAllPosts = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/posts')
        const data = await res.json()
        const timeSortedPosts = data.posts.sort((a, b) => (b.timestamp > a.timestamp) ? 1 : -1)
        setPosts(timeSortedPosts)
        setLoading(false)
      } catch (err) {
        console.error('error fetching data', err)
        setError(err)
      }
    }
    getAllPosts()
  }, [])

  console.log(posts)

  if (error) return 'Error...'
  if (loading) return 'Loading...'

  return (
    <div className='App'>
      <BrowserRouter>
        <UserContext.Provider value={value}>  
          <Navbar />
          <Routes>
            <Route path='/' element={
              <Home 
                posts={posts}
              />  
            }>  
            </Route>
            <Route path='/admin' element={
                <Admin 
                  posts={posts}
                  setPosts={setPosts}
                />  
            }>
            </Route>
            <Route path='/login' element={
              <Login />  
            }>
            </Route>
            <Route path='/logout' element={
              <Logout />
            }>
            </Route>
            <Route path='/create' element={
              <Create 
                posts={posts}
                setPosts={setPosts}
              />
            }>
            </Route>
            <Route path='/signup' element={
              <Signup />  
            }>
            </Route>
            <Route path='/dashboard' element={
              <Dashboard 
                posts={posts} 
                setPosts={setPosts}
              />
            }>  
            </Route>
            <Route 
              path='/posts/:id' 
              element={<SinglePost
                posts={posts} 
                setPosts={setPosts}
              />}  
            />  
            <Route 
              path='/posts/:id/edit' 
              element={<EditPost/>}
            />
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>  

    </div>
  );
}

export default App;
