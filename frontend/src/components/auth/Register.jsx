import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confPassword: "",
  });
  const [message, setMessageToRender] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5500/registerstudent",
        formData
      );
      console.log("Registration successful");
      // navigate("/login");
      const message = (
        <span style={{ color: "green" }}>You have successfully registered</span>
      );
      setMessageToRender(message);
    } catch (error) {
      console.log("registration Failed" + error);
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
      <h2>Registration Page</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter name"
        />{" "}
        <br />
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
        <br />
        <input
          type="password"
          name="confPassword"
          value={formData.confPassword}
          onChange={handleChange}
          required
          placeholder="Confirm Password"
        />{" "}
        <br />
        <button type="submit">Register</button>
      </form>
      <br />
      {message}

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
