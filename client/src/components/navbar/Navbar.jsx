import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/user";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge(); // Clear persisted storage
    navigate("/");
  };

  // Check if sidebar is present (i.e., not on Home, Login, or Register pages)
  const hasSidebar = location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <nav className={`navbar ${hasSidebar ? "with-sidebar" : ""}`}>
      <div className="nav-logo">
        <Link to="/">DB Report.</Link>
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/settings">Settings</Link>
        <button className="logout-btn" onClick={handleLogout} >Logout</button>
      </div>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </nav>
  );
};

export default Navbar;


