import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCreateUser, useLogin } from "../hooks/usePostData";
import jwt_decode from "jwt-decode";


function Signup() {
  // deleted {setCurrentUser}
  const [disable, setDisable] = useState(true);
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    confirm: "",
    fname: "",
    lname: "",
    user: null,
  });
  const [errors, setErrors] = useState({});
  const { mutate: login } = useLogin();
  const { mutate: createUser } = useCreateUser();
  let navigate = useNavigate();



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
    if (userData.user) {
      login({ userData });
      setUserData(prev => ({ ...prev, user: null }));
    }
  }, [userData.user]);

  async function handleCallbackResponse(response) {
    console.log("encoded JWT id token: " + response.credential);
    let userObject = await jwt_decode(response.credential);
    console.log(userObject);
    setUserData(prev => ({ ...prev, user: userObject }));
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    createUser(
      { userData }, 
      { 
        onSuccess: () => {
          setUserData({
            username: "",
            password: "",
            confirm: "",
            fname: "",
            lname: "",
          })
          navigate("/login");
        },
       onError: ({errors}) => {
          console.log(errors);
          const fieldErrors = errors.errors.reduce((acc, curr) => {
            acc[curr.param] = curr.msg;
            return acc
          }, {});
          setErrors(fieldErrors);
          setUserData(prev => ({
            ...prev,
            password: "",
            confirm: "",
          }));
        }   
      }
    );
  };

  useEffect(() => {
    userData.username &&
    userData.password &&
    userData.fname &&
    userData.lname &&
    userData.confirm === userData.password
      ? setDisable(false)
      : setDisable(true);
  }, [
    userData.username,
    userData.password,
    userData.confirm,
    userData.fname,
    userData.lname,
  ]);
  return (
    <div className="signup-container">
      <div className="signup">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={(e) =>
              setUserData((v) => ({ ...v, [e.target.name]: e.target.value }))
            }
            required
          ></input>
          {errors.username && (
            <p style={{ color: "red", marginTop: "-1.8rem", fontSize: "0.9rem" }}>{errors.username}</p>
          )}
          <label htmlFor="fname">First Name</label>
          <input
            type="text"
            name="fname"
            value={userData.fname}
            onChange={(e) =>
              setUserData((v) => ({ ...v, [e.target.name]: e.target.value }))
            }
            required
          ></input>
          {errors.fname && (
            <p style={{ color: "red", marginTop: "-1.8rem", fontSize: "0.9rem"   }}>{errors.fname}</p>
          )}
          <label htmlFor="lname">Last Name</label>
          <input
            type="text"
            name="lname"
            value={userData.lname}
            onChange={(e) =>
              setUserData((v) => ({ ...v, [e.target.name]: e.target.value }))
            }
            required
          ></input>
          {errors.lname && (
            <p style={{ color: "red", marginTop: "-1.8rem", fontSize: "0.9rem"   }}>{errors.lname}</p>
          )}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={(e) =>
              setUserData((v) => ({ ...v, [e.target.name]: e.target.value }))
            }
            required
          ></input>
          {errors.password && (
            <p style={{ color: "red", marginTop: "-1.8rem", fontSize: "0.9rem"   }}>{errors.password}</p>
          )}
          <label htmlFor="confirm">Confirm password</label>
          <input
            type="password"
            name="confirm"
            value={userData.confirm}
            onChange={(e) =>
              setUserData((v) => ({ ...v, [e.target.name]: e.target.value }))
            }
            required
          ></input>
          {userData.confirm === userData.password ? null : (
            <p>Passwords do not match.</p>
          )}
          <button type="submit" disabled={disable}>
            Create Account
          </button>
        </form>
        <br />
        <p style={{ fontSize: "0.8rem" }}>or sign up with your Google account</p>
        <div id="signInDiv"></div>
        <p style={{ fontSize: "0.8rem" }}>
          Already have an account? <a href="/login">Log in</a>
        </p>

      </div>
    </div>
  );
}

export default Signup;
