import React from "react";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        <div className="text-section">
          <h1>Welcome to DB Report System</h1>
          <p>
            Streamline your database monitoring and reporting with our 
            user-friendly system. Get real-time updates and ensure 
            seamless operations.
          </p>
        </div>
        <div className="button-section">
          <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
          <button className="register-btn" onClick={() => navigate("/register")}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
