import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authservice } from '../../../services/authservice';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import './Signup.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const collegeLogo = "https://pilatharacascollege.ac.in/wp-content/uploads/elementor/thumbs/logo-1-rm6miqeg3b4jzwhhj9e95xp03a69hk0rhbc4g90ilc.png";

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authservice.signup({ name, email, password });
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        
        {/* Left Side: Branding */}
        <div className="signup-sidebar">
          <div className="logo-box">
            <img src={collegeLogo} alt="College Logo" className="college-logo-img" />
          </div>
          <h1>Academic<br/>Registration Portal.</h1>
          <p>Create your account to access your personalized academic dashboard and stay synchronized with your department.</p>
        </div>

        {/* Right Side: Form */}
        <div className="signup-form-section">
          <div className="form-header">
            <h2>Get Started</h2>
            <p>Registration Portal</p>
          </div>

          <form className="signup-form" onSubmit={handleSignup}>
            <div className="form-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  style={{ paddingLeft: '45px' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Institutional Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="email" 
                  placeholder="name@college.com" 
                  style={{ paddingLeft: '45px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="password" 
                  placeholder="Create Secure Password" 
                  style={{ paddingLeft: '45px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            {error && <div className="error-message" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '10px', borderRadius: '10px', fontSize: '0.8rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Processing..." : "Create Account"}
            </button>
          </form>

          <p className="login-footer">
            Already a member? <span style={{ color: '#002147', cursor: 'pointer', fontWeight: '700' }} onClick={() => navigate("/login")}>Sign In</span>
          </p>
        </div>

      </div>
    </div>
  );
}