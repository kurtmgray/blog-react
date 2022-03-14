import { Link } from "react-router-dom";
import React, { useContext } from 'react';
import { UserContext } from "../UserContext";

function Navbar() {
    const { currentUser } = useContext(UserContext)
    
    return (
        <div>
            <div className='title'>
                <h1>Bob Loblaw's Law Blog</h1>            
            </div>
            <div className='auth_buttons'>
                <Link to='/'>Home  </Link>
                {currentUser ? null : <Link to='/signup'>Sign Up  </Link>}
                {currentUser ? null : <Link to='/login'>Log In  </Link>}
                {currentUser ? <Link to='/create'>Create  </Link> : null}
                {currentUser ? <Link to='/dashboard'>Dashboard  </Link> : null}
                {!currentUser ? null : <Link to='/logout'>Log Out</Link>}
            </div>
        </div>
    )
}

export default Navbar