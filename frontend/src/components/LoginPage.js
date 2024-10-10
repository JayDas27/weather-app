import React, { useEffect, useState } from "react";

import "./LoginPage.css";
import profileImg from "../asset/img_avatar2.png";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../services/weatherService";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Function to check if the user is authorized
  const isAuthorized = () => {
    const token = localStorage.getItem("token");
    return token !== null;
  };

  useEffect(() => {
    if (isAuthorized()) {
      navigate("/");
    }
  }, [navigate]);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    const loginPayload = {
      username,
      password,
    };

    userLogin(loginPayload).then((response) => {
      const res = response.data;

      if (res.message === "Authorized") {
        localStorage.setItem("token", res.token);
        navigate("/");
      } else {
        alert(res.message);
      }
    });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form className="modal-content animate" onSubmit={handleSubmit}>
        <div className="imgcontainer">
          <img src={profileImg} alt="Avatar" className="avatar" />
        </div>

        <div className="field-container">
          <label htmlFor="uname">
            <b>Username</b>
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="psw">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
