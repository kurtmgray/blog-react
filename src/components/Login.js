import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCurrentUser, useLogin } from "../hooks/usePostData";
import jwt_decode from "jwt-decode";

function Login() {
  const [values, setValues] = useState({
    username: "",
    password: "",
    user: null,
  });
  const [err] = useState(null);

  let navigate = useNavigate();

  const { data: currentUser } = useCurrentUser();
  const { mutate: login } = useLogin();

  async function handleCallbackResponse(response) {
    console.log("encoded JWT id token: " + response.credential);
    let userObject = await jwt_decode(response.credential);
    console.log(userObject);
    setValues({ ...values, user: userObject });
    // login({ values });
    // setValues({ ...values, user: null });
  }

  useEffect(() => {
    if (values.user) {
      login({ values });
      setValues({ ...values, user: null });
    }
  }, [values.user]);

  // google auth
  useEffect(() => {
    /* global google from script in HTML*/
    google.accounts.id.initialize({
      client_id:
        "23789127279-4aob3sd10qbt8rc5sc2kpupqma2tbg80.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });
    const signInDiv = document.getElementById("signInDiv");
    google.accounts.id.renderButton(signInDiv, {
      theme: "outline",
      size: "extra-large",
    });
  }, []);

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    login({ values });
    setValues({ username: "", password: "" });
  };

  return (
    <div className="login-container">
      <div className="login">
        <h1>Log In</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Enter your username</label>
          <input
            type="text"
            name="username"
            value={values.username}
            onChange={(e) =>
              setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
            }
            required
          ></input>
          <label htmlFor="password">Enter your password</label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={(e) =>
              setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
            }
            required
          ></input>
          {err ? <p>{err.message}</p> : null}
          <button type="submit">Log In</button>
          {/* <div>
            <a href="http://localhost:8000/auth/google">Sign in with Google</a>
          </div> */}
        </form>
        <div id="signInDiv"></div>
      </div>
    </div>
  );
}

export default Login;
