import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/user";
import { persistor } from "../../redux/store";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const role = user?.data?.role;

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge(); // Clear persisted storage
    navigate("/");
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">📌 DB Report</h2>
      <nav className="sidebar-links">
        {role === "staff" ? (
          <>
            <Link to="/report">📝 Make Report</Link>
            <Link to="/history">📜 History</Link>
            <Link to="/settings">⚙️ Settings</Link>
          </>
        ) : (
          <>
            <Link to="/review-report">📋 Review Reports</Link>
            <Link to="/history">📜 History</Link>
            <Link to="/databases">📂 Databases</Link>
          </>
        )}
      </nav>
      <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
    </div>
  );
};

export default Sidebar;
