import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessageToRender] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5500/loginstudent",
        formData
      );
      const { token } = response.data;
      console.log("Login token is" + token);
      localStorage.setItem("token", token);
      navigate("/profile");
      // const message = (
      //   <span style={{ color: "green" }}>You have successfully registered</span>
      // );
      // setMessageToRender(message);
    } catch (error) {
      console.log("Login Failed" + error);
      const message = <span style={{ color: "red" }}>Unsuccessful Login</span>;
      setMessageToRender(message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    <div className="registration-container">
      <h2>Login Page</h2>
      <form>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter Email"
        />{" "}
        <br />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Enter Password"
        />{" "}
        <button onClick={handleSubmit} type="submit">
          Login
        </button>
      </form>
      <br />
      {message}

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
