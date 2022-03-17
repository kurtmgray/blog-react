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
            <div className='nav_buttons'>
                <Link to='/'>Home  </Link>
                <Link to='/create'>Create  </Link>
                {!currentUser ? (
                    <div>
                        <Link to='/signup'>Sign Up  </Link>
                        <Link to='/login'>Log In  </Link>
                    </div>
                ) : (
                    <div>
                        <Link to='/dashboard'>Dashboard  </Link> 
                        <Link to='/logout'>Log Out</Link>
                    </div> 
                )}
                {currentUser && currentUser.admin ? <Link to='/admin'>Admin  </Link> : null}
            </div>
        </div>
    )
}

export default Navbar