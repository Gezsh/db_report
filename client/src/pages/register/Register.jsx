import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mail: "",
    user_id: "",
    role: "staff", // Default role
    password: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/register",
        formData,
        { withCredentials: true }
      );

      setSuccessMessage("Registration successful! Redirecting...");
      setError(null);
      
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Redirect after 2 seconds

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong, please try again.");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        
        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        <input type="text" name="user_id" placeholder="User id" value={formData.user_id} onChange={handleChange} required />
        <input type="email" name="mail" placeholder="Email (bankofabyssinia.com)" value={formData.mail} onChange={handleChange} required />
        
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="staff">Staff</option>
          <option value="manager">Manager</option>
        </select>
        
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;