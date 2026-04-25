import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import './Layout.css';

export default function Layout() {
  const navigate = useNavigate();
  const collegeLogo = "https://pilatharacascollege.ac.in/wp-content/uploads/elementor/thumbs/logo-1-rm6miqeg3b4jzwhhj9e95xp03a69hk0rhbc4g90ilc.png";

  return (
    <div className="layout-wrapper">
      <nav className="main-navbar">
        <div className="nav-container">
          <div className="nav-logo-box" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
            <img src={collegeLogo} alt="Logo" className="nav-logo-img" />
          </div>
          <div className="nav-menu">
            <Link to="/home" className="nav-item">Home</Link>
            <Link to="/dashboard" className="nav-item">Dashboard</Link>
            <Link to="/students" className="nav-item">Students</Link>
            <Link to="/marks" className="nav-item">Marks</Link>
            <Link to="/attendance" className="nav-item">Attendance</Link>
            <Link to="/contact" className="nav-item">Contact</Link>
            <button onClick={() => navigate('/login')} className="logout-btn">
              <LogOut size={16} style={{ marginRight: '8px' }} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="layout-body">
        <div className="layout-overlay"></div>
        <div className="content-container">
          <Outlet /> {/* This is where Home/Dashboard/etc. appear */}
        </div>
      </main>

      <footer className="layout-footer">
        <p>© 2026 Pilathara Co-operative Arts & Science College. All rights reserved.</p>
      </footer>
    </div>
  );
}