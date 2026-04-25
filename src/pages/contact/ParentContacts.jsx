import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Search, Phone, User, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import './ParentContacts.css';

export default function ParentContacts() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedProg, setSelectedProg] = useState(null);

  const departmentPrograms = {
    "commerce": ["bcom", "bcom ca", "bcom finance", "bcom co"],
    "computer science": ["bca", "cs"],
    "english": ["ba english"],
    "science": ["bsc physics", "bsc chemistry"],
    "management studies": ["bba", "bbattm"]
  };

  const departments = Object.keys(departmentPrograms);


  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/students');
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Unable to load student contact list.");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedStudentId(expandedStudentId === id ? null : id);
  };

  return (
    <div className="parent-contacts-container">
      <header className="parent-contacts-header">
        <h2>Parent Contact Directory</h2>
        <p>Find and connect with parents instantly.</p>
      </header>

      <div className="search-section">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          className="search-bar" 
          placeholder="Search by student name or roll number..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="selection-nav">
        <button 
          className={`nav-link ${!selectedDept ? 'active' : ''}`} 
          onClick={() => { setSelectedDept(null); setSelectedProg(null); }}
        >
          Departments
        </button>
        {selectedDept && (
          <>
            <span className="nav-separator">/</span>
            <button 
              className={`nav-link ${selectedDept && !selectedProg ? 'active' : ''}`}
              onClick={() => setSelectedProg(null)}
            >
              {selectedDept.toUpperCase()}
            </button>
          </>
        )}
        {selectedProg && (
          <>
            <span className="nav-separator">/</span>
            <button className="nav-link active">
              {selectedProg.toUpperCase()}
            </button>
          </>
        )}
      </div>

      {!selectedDept ? (
        <div className="selection-grid">
          {departments.map(dept => (
            <div key={dept} className="selection-card" onClick={() => setSelectedDept(dept)}>
              <div className="card-initial">{dept[0].toUpperCase()}</div>
              <h3>{dept.toUpperCase()}</h3>
              <p>Parent Contacts</p>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      ) : !selectedProg ? (
        <div className="selection-grid">
          {departmentPrograms[selectedDept].map(prog => (
            <div key={prog} className="selection-card program-card" onClick={() => setSelectedProg(prog)}>
              <div className="card-initial">{prog[0].toUpperCase()}</div>
              <h3>{prog.toUpperCase()}</h3>
              <p>View Directory</p>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="student-contact-grid animate-slide-up">
          {students.filter(s => s.department === selectedDept && s.program === selectedProg).length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              No students found matching your selection.
            </div>
          ) : (
            students
              .filter(s => s.department === selectedDept && s.program === selectedProg)
              .map(student => (
                <div 
                  key={student._id} 
                  className={`student-contact-card ${expandedStudentId === student._id ? 'active' : ''}`}
                  onClick={() => toggleExpand(student._id)}
                >
                  <div className="stu-info-header">
                    <div className="stu-initial">
                      {student.name.charAt(0)}
                    </div>
                    <div className="stu-meta">
                      <h4>{student.name}</h4>
                      <p>Roll: {student.rollNumber}</p>
                    </div>
                    <div className="expand-icon">
                      {expandedStudentId === student._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  {!expandedStudentId || expandedStudentId !== student._id ? (
                    <div className="reveal-hint">
                      <Phone size={14} /> Click to reveal parent contact
                    </div>
                  ) : (
                    <div className="parent-info-reveal" onClick={e => e.stopPropagation()}>
                      <div className="parent-detail-item">
                        <div className="icon"><User size={20} /></div>
                        <div>
                          <span className="label">Parent Name</span>
                          <span className="value">{student.parentName}</span>
                        </div>
                      </div>
                      <div className="parent-detail-item">
                        <div className="icon"><Phone size={20} /></div>
                        <div>
                          <span className="label">Phone Number</span>
                          <span className="value">{student.parentPhone}</span>
                        </div>
                      </div>

                      <div className="contact-actions">
                        <a href={`tel:${student.parentPhone}`} className="action-link call-action">
                          <Phone size={16} /> Call
                        </a>
                        <a href={`https://wa.me/${student.parentPhone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="action-link wa-action">
                          <MessageSquare size={16} /> WhatsApp
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
}
