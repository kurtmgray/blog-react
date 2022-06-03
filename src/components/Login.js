import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCurrentUser, useLogin } from "../hooks/usePostData";

function Login() {
  const [values, setValues] = useState({ username: "", password: "" });
  const [err] = useState(null);

  let navigate = useNavigate();

  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const { mutate: login } = useLogin();
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
        </form>
      </div>
    </div>
  );
}

export default Login;
