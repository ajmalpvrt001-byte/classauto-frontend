import React, { useState } from "react";
import { useNavigate } from "react-router";
import { authservice } from "../../../services/authservice";
import { Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import "./Login.css";

export default function Login() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const collegeLogo = "https://pilatharacascollege.ac.in/wp-content/uploads/elementor/thumbs/logo-1-rm6miqeg3b4jzwhhj9e95xp03a69hk0rhbc4g90ilc.png";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authservice.login({ email, password });
      console.log("Login successful:", response);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        
        {/* LEFT SIDE - Form */}
        <div className="left">
          <div className="logo-box">
            <img src={collegeLogo} alt="College Logo" className="logo-img" />
          </div>

          <div className="avatar">
            <UserIcon size={32} color="white" />
          </div>

          <form className="form" onSubmit={handleLogin}>
            <div className="input-group">
              <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="email" 
                placeholder="Email Address" 
                style={{ paddingLeft: '45px' }}
                value={email}
                onChange={(e) => setemail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="password" 
                  placeholder="Password"
                  style={{ paddingLeft: '45px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-options">
                <a href="#" className="forgot-link">Forgot Password?</a>
              </div>

            {error && <div className="error-message">{error}</div>}

            <button className="login-btn" disabled={loading}>
              {loading ? "Verifying Credentials..." : "Sign In to Dashboard"}
            </button>
            <div className="support-link">
              Need help? <a href="#">Contact IT Support</a>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE - Branding */}
        <div className="right">
          <div className="nav">
            <button className="sign-btn" onClick={() => navigate("/Signup")}>Create Account</button>
          </div>

          <div className="welcome">
            <p style={{ color: '#fbbf24', fontWeight: '700', marginBottom: '10px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Official Portal</p>
            <h1>Pilathara<br/>Co-operative<br/>Arts & Science.</h1>
            <p>Welcome to the official academic portal of Pilathara Co-operative Arts and Science College.</p>
          </div>

          <div className="footer-note" style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            © 2026 Pilathara Co-operative Arts & Science College. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  );
}