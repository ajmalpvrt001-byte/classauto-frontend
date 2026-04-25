import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, BookOpen, Users, PhoneCall, GraduationCap } from 'lucide-react';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="app-wrapper">
      {/* Hero Header */}
      <header className="hero-section">
        <p style={{ color: '#3b82f6', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>Academic Portal</p>
        <h2>Digital Campus Management</h2>
        <p>Empowering education through seamless digital coordination and real-time tracking.</p>
      </header>

      {/* Main Content Area */}
      <div className="card-grid">
        
        <div className="feature-card">
          <div className="card-icon">
            <BarChart3 size={32} color="#3b82f6" />
          </div>
          <h3>Attendance</h3>
          <p>Real-time tracking of student presence and automated intelligence reports.</p>
          <button className="btn-secondary" onClick={() => navigate('/attendance')}>Access Database</button>
        </div>

        <div className="feature-card">
          <div className="card-icon">
            <BookOpen size={32} color="#3b82f6" />
          </div>
          <h3>Mark List</h3>
          <p>Comprehensive academic performance records and subject-wise analysis.</p>
          <button className="btn-secondary" onClick={() => navigate('/marks')}>View Results</button>
        </div>

        <div className="feature-card">
          <div className="card-icon">
            <Users size={32} color="#3b82f6" />
          </div>
          <h3>Parent Directory</h3>
          <p>Secure gateway to student guardian information and communication logs.</p>
          <button className="btn-secondary" onClick={() => navigate('/contact')}>Open Directory</button>
        </div>

        <div className="feature-card">
          <div className="card-icon">
            <GraduationCap size={32} color="#3b82f6" />
          </div>
          <h3>Student Database</h3>
          <p>Manage core student profiles, enrollments, and academic history.</p>
          <button className="btn-secondary" onClick={() => navigate('/students')}>Manage Database</button>
        </div>

      </div>
    </div>
  );
}