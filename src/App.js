import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Admin from "./components/Admin";
import Home from "./components/Home";
import Login from "./components/Login";
import Create from "./components/Create";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import SinglePost from "./components/SinglePost";
import EditPost from "./components/EditPost";
import Logout from "./components/Logout";
import Loading from "./components/Loading";
import GoogleAuth from "./components/GoogleAuth";
import { usePostData } from "./hooks/usePostData";
import { useState, useEffect } from "react";


function App() {
  const { data: posts, isLoading, isError } = usePostData();
  
  if (isError) return "Error...";
  if (isLoading) return <Loading isLoading={isLoading} />;

  return (
    <>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home posts={posts} />}></Route>
            <Route path="/admin" element={<Admin />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/auth/google" element={<GoogleAuth />}></Route>
            <Route path="/logout" element={<Logout />}></Route>
            <Route path="/create" element={<Create />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/posts/:id" element={<SinglePost />} />
            <Route path="/posts/:id/edit" element={<EditPost />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
