import { Link } from "react-router-dom";
import React from "react";
import { useCurrentUser } from "../hooks/usePostData";
import navLogo from "./assets/svg/nav-logo.svg";
import "./fonts/SyneMono-Regular.ttf";


function Navbar() {
  const { data: currentUser } = useCurrentUser();

  return (
    <div className="navbar">
      <div className="navbar-title">
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={navLogo} alt="navLogo" />
        </Link>
      </div>
      <div className="navbar-links">
        <h3 className="navbar-link">
          <Link to="/" style={{ textDecoration: "none" }}>
            Home{" "}
          </Link>
        </h3>
        {!currentUser ? (
          <div className="navbar-links">
            <h3 className="navbar-link">
              <Link to="/signup" style={{ textDecoration: "none" }}>
                Sign Up{" "}
              </Link>
            </h3>
            <h3 className="navbar-link">
              <Link to="/login" style={{ textDecoration: "none" }}>
                Log In{" "}
              </Link>
            </h3>
          </div>
        ) : (
          <div className="navbar-links">
            <h3 className="navbar-link">
              <Link to="/create" style={{ textDecoration: "none" }}>
                Create{" "}
              </Link>
            </h3>
            <h3 className="navbar-link">
              <Link to="/dashboard" style={{ textDecoration: "none" }}>
                Dashboard{" "}
              </Link>
            </h3>
            <h3 className="navbar-link">
              <Link to="/logout" style={{ textDecoration: "none" }}>
                Log Out
              </Link>
            </h3>
          </div>
        )}
        {currentUser && currentUser.admin ? (
          <h3 className="navbar-link">
            <Link to="/admin" style={{ textDecoration: "none" }}>
              Admin{" "}
            </Link>
          </h3>
        ) : null}
      </div>
    </div>
  );
}

export default Navbar;
