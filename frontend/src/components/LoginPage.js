import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import profileImg from "../asset/img_avatar2.png";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../services/weatherService";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userInfo")) navigate("/");
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    userLogin(credentials).then(({ data }) => {
      if (data.message === "Authorized") {
        localStorage.setItem("userInfo", JSON.stringify(data.data));
        navigate("/");
      } else {
        alert(data.message);
      }
    });
  };

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="modal-content animate" onSubmit={handleSubmit}>
        <div className="imgcontainer">
          <img src={profileImg} alt="Avatar" className="avatar" />
        </div>
        <div className="field-container">
          {["username", "password"].map((field) => (
            <React.Fragment key={field}>
              <label htmlFor={field}>
                <b>{field.charAt(0).toUpperCase() + field.slice(1)}</b>
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                id={field}
                placeholder={`Enter ${field}`}
                value={credentials[field]}
                onChange={handleChange}
                required
              />
            </React.Fragment>
          ))}
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
