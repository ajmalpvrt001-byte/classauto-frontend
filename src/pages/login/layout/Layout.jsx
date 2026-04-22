import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./layout.css";
import Home from "../home/Home";
const Layout = () => {
  return (
    <div className="app-container">
      
      {/* Sidebar */}
      <div className="sidebar">
        <h3 className="logo">Sample App</h3>
        <h2 className="title">Dashboard</h2>

        <nav>
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/about" className="nav-item">About</Link>
          <Link to="/counter" className="nav-item">Counter</Link>
        </nav>
      </div>

      {/* Main Section */}
      <div className="main-content">
        
        {/* Navbar */}
        <div className="navbar">
          <h2>Welcome</h2>

          <div className="profile">
            <div className="avatar">M</div>
            <span>Ajmal</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="content">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="footer">
          <p>© 2026 Sample App. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
};

export default Layout;