import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Phone, User, Globe, MessageSquare, Edit2, Trash2 } from 'lucide-react';
import './Students.css';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedProg, setSelectedProg] = useState(null);


  const initialFormState = {
    name: '',
    rollNumber: '',
    department: '',
    program: '',
    year: '',
    semester: '',
    parentName: '',
    parentPhone: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  const departmentPrograms = {
    "commerce": ["bcom", "bcom ca", "bcom finance", "bcom co"],
    "computer science": ["bca", "cs"],
    "english": ["ba english"],
    "science": ["bsc physics", "bsc chemistry"],
    "management studies": ["bba", "bbattm"]
  };

  const departments = Object.keys(departmentPrograms);
  const currentPrograms = formData.department ? departmentPrograms[formData.department] : [];

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
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset program if department changes
      ...(name === 'department' && { program: '' })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let response;
      if (editingStudentId) {
        response = await api.put(`/students/${editingStudentId}`, formData);
      } else {
        response = await api.post('/students', formData);
      }
      
      if (response.data.success) {
        setShowModal(false);
        setFormData(initialFormState);
        setEditingStudentId(null);
        fetchStudents();
      }
    } catch (err) {
      console.error("Error saving student:", err);
      setError(err.response?.data?.message || "Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      rollNumber: student.rollNumber,
      department: student.department,
      program: student.program,
      year: student.year,
      semester: student.semester,
      parentName: student.parentName,
      parentPhone: student.parentPhone
    });
    setEditingStudentId(student._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await api.delete(`/students/${id}`);
        if (response.data.success) {
          fetchStudents();
        }
      } catch (err) {
        console.error("Error deleting student:", err);
        setError("Failed to delete student");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudentId(null);
    setFormData(initialFormState);
    setError('');
  };

  return (
    <div className="students-container">
      <div className="header-actions">
        <h2>Students Database</h2>
        <button className="add-btn" onClick={() => {
          setEditingStudentId(null);
          setFormData(initialFormState);
          setShowModal(true);
        }}>+ Add Student</button>
      </div>

      {error && <div className="error-alert">{error}</div>}
      
      {/* Breadcrumbs / Navigation */}
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
        /* Department Selection Grid */
        <div className="selection-grid">
          {departments.map(dept => (
            <div key={dept} className="selection-card" onClick={() => setSelectedDept(dept)}>
              <div className="card-initial">{dept[0].toUpperCase()}</div>
              <h3>{dept.toUpperCase()}</h3>
              <p>{departmentPrograms[dept].length} Programs</p>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      ) : !selectedProg ? (
        /* Program Selection Grid */
        <div className="selection-grid">
          {departmentPrograms[selectedDept].map(prog => (
            <div key={prog} className="selection-card program-card" onClick={() => setSelectedProg(prog)}>
              <div className="card-initial">{prog[0].toUpperCase()}</div>
              <h3>{prog.toUpperCase()}</h3>
              <p>View Students</p>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      ) : (
        /* Student Table View */
        <div className="table-wrapper animate-slide-up">
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Year/Sem</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && students.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Loading students...</td>
                </tr>
              ) : students.filter(s => s.department === selectedDept && s.program === selectedProg).length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No students found in this program.</td>
                </tr>
              ) : (
                students
                  .filter(s => s.department === selectedDept && s.program === selectedProg)
                  .map(student => (
                    <tr key={student._id}>
                      <td style={{ fontWeight: 600 }}>{student.name}</td>
                      <td>{student.rollNumber}</td>
                      <td>Y{student.year} / S{student.semester}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-btns" style={{ justifyContent: 'flex-end' }}>
                          <button className="edit-btn" onClick={() => handleEdit(student)} title="Edit">
                            <Edit2 size={18} />
                          </button>
                          <button className="delete-btn" onClick={() => handleDelete(student._id)} title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingStudentId ? 'Edit Student' : 'Add New Student'}</h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>

            <form className="student-form" onSubmit={handleSubmit}>
              <div className="form-group full-width">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>Roll Number</label>
                <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>Department</label>
                <select name="department" value={formData.department} onChange={handleInputChange} required>
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept} style={{ textTransform: 'capitalize' }}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Program</label>
                <select name="program" value={formData.program} onChange={handleInputChange} required disabled={!formData.department}>
                  <option value="">Select Program</option>
                  {currentPrograms.map(prog => (
                    <option key={prog} value={prog} style={{ textTransform: 'uppercase' }}>{prog}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Year</label>
                <input type="number" name="year" min="1" value={formData.year} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>Semester</label>
                <input type="number" name="semester" min="1" max="8" value={formData.semester} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>Parent Name</label>
                <input type="text" name="parentName" value={formData.parentName} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>Parent Phone</label>
                <input type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleInputChange} required />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeModal} disabled={loading}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : editingStudentId ? 'Update Student' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
