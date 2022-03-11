import './App.css';
import React, { useState, useEffect } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Login from './components/Login'
import Create from './components/Create'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard'
import SinglePost from './components/SinglePost'


function App() {
  const [validUser, setValidUser] = useState(undefined)
  const [posts, setPosts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()


  useEffect( () => {
    fetch('http://localhost:8000/api/posts')
    .then(res => res.json())
    .then(data => setPosts(data.posts))
    .catch(err => {
      console.error('error fetching data', err)
      setError(error)
    })
    .finally(() => {
      setLoading(false)
    })
  }, [loading])

  console.log(posts)
  if (error) return 'Error...'
  if (loading) return 'Loading...'

  return (
    <div>
      <BrowserRouter>
        <Navbar 
          validUser={validUser} 
          setValidUser={setValidUser}
        />
        <Routes>
          <Route path='/' element={
            <Home 
              posts={posts}
              validUser={validUser}
            />  
          }>  
          </Route>
          <Route path='/login' element={
            <Login 
              setValidUser={setValidUser}
            />  
          }>
          </Route>
          <Route path='/create' element={
            <Create 
              validUser={validUser}
              posts={posts}
              setPosts={setPosts}
            />
          }>
          </Route>
          <Route path='/signup' element={
            <Signup
              setValidUser={setValidUser}
            />  
          }>
          </Route>
          <Route path='/dashboard' element={
            <Dashboard 
              validUser={validUser}
              posts={posts}
              setPosts={setPosts}
            />
          }>  
          </Route>
          {posts && posts.map(post => (
            <Route path={`posts/${post._id}`} element={
              <SinglePost 
                key={post._id}
                loading={loading}
                setLoading={setLoading}
                id={post._id}
                validUser={validUser}
              />
            }>
            </Route>  
          ))}
        </Routes>
      </BrowserRouter>  

    </div>
  );
}

export default App;
