import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div>
            <div className='title'>
                <h1>Bob Loblaw's Law Blog</h1>            
            </div>
            <div className='auth_buttons'>
                <Link to='/'>Home</Link>
                <Link to='/signup'>Sign Up</Link>
                <Link to='/login'>Log In</Link>
                <Link to='/logout'>Log Out</Link>
            </div>
        </div>
    )
}

export default Navbar