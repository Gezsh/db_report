import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../../redux/features/user";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";

const Login = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user); // Get Redux state

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart()); // Start loading

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        { mail, password },
        { withCredentials: true }
      );

      dispatch(loginSuccess(response.data)); // Save user data to Redux
      navigate("/report"); // Navigate after successful login

    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || "Invalid credentials, please try again."));
    }
  };

  return (
    <>
      
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}
          <input
            type="email"
            placeholder="Enter your email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
