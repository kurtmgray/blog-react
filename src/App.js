import './App.css';
import React, { useState, useEffect, useMemo } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login'
import Create from './components/Create'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import SinglePost from './components/SinglePost'
import Protected from './components/Protected';
import { UserContext } from './UserContext';

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [posts, setPosts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()

  const value = useMemo(() => ({currentUser, setCurrentUser}), [currentUser, setCurrentUser])

  useEffect(() => {
    const bearerToken = localStorage.getItem('token')
    const token = bearerToken.slice(7)    

    const getUser = async () => {
      const res = await fetch('http://localhost:8000/api/users', {
        headers: { Authorization: token },
      })
      const data = await res.json()
      setCurrentUser(data.user)
    }

    if (token) {
      getUser()
    }
  }, [])

  useEffect( () => {
    fetch('http://localhost:8000/api/posts')
    .then(res => res.json())
    .then(data => setPosts(data.posts))
    .catch(err => {
      console.error('error fetching data', err)
      setError(err)
    })
    .finally(() => {
      setLoading(false)
    })
  }, [])

  console.log(posts)

  if (error) return 'Error...'
  if (loading) return 'Loading...'

  return (
    <div>
      <BrowserRouter>
        <UserContext.Provider value={value}>  
          <Navbar 
             
          
          />
          <Routes>
            <Route path='/' element={
              <Home 
                posts={posts}
                
              />  
            }>  
            </Route>
            <Route path='/login' element={
              <Login 
              
              />  
            }>
            </Route>
            <Route path='/protected' element={
              <Protected />
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
              <Signup
              
              />  
            }>
            </Route>
            <Route path='/dashboard' element={
              <Dashboard 
                
                posts={posts}
                setPosts={setPosts}
              />
            }>  
            </Route>
            {posts && posts.map(post => (
              <Route 
                path={`posts/${post._id}`} 
                key={post._id} 
                element={ 
                  <SinglePost 
                    loading={loading}
                    setLoading={setLoading}
                    id={post._id}
                    
                  />
              }>
              </Route>  
            ))}
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>  

    </div>
  );
}

export default App;
