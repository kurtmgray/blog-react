import { Link } from "react-router-dom";
import React from 'react';
import { useCurrentUser } from "../hooks/usePostData";
import navLogo from './assets/svg/nav-logo.svg'


function Navbar() {
    const { data: currentUser } = useCurrentUser()

    return (
        <div className='navbar'>
            <div className='navbar-title'>
                <Link to='/'><img src={navLogo} alt='navLogo'/></Link>
            </div>
            <div className='navbar-links'>
                <h3 className='navbar-link'><Link to='/'>Home  </Link></h3>
                {!currentUser ? (
                    <div className='navbar-links'>
                        <h3 className='navbar-link'><Link to='/signup'>Sign Up  </Link></h3>
                        <h3 className='navbar-link'><Link to='/login'>Log In  </Link></h3>
                    </div>
                ) : (
                    <div className='navbar-links'>
                        <h3 className='navbar-link'><Link to='/create'>Create  </Link></h3>
                        <h3 className='navbar-link'><Link to='/dashboard'>Dashboard  </Link></h3>
                        <h3 className='navbar-link'><Link to='/logout'>Log Out</Link></h3>
                    </div> 
                )}
                {currentUser && currentUser.admin ? 
                    <h3 className='navbar-link'><Link to='/admin'>Admin  </Link></h3>: null}
            </div>
        </div>
    )
}

export default Navbar