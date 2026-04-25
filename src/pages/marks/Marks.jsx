import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import AddMarks from './AddMarks';
import './Marks.css';

export default function Marks() {
  const [viewState, setViewState] = useState('dept'); // 'dept', 'class', 'table'
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedProg, setSelectedProg] = useState(null);
  const [selectedSem, setSelectedSem] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const departmentPrograms = {
    "commerce": ["bcom", "bcom ca", "bcom finance", "bcom co"],
    "computer science": ["bca", "cs"],
    "english": ["ba english"],
    "science": ["bsc physics", "bsc chemistry"],
    "management studies": ["bba", "bbattm"]
  };

  const departments = Object.keys(departmentPrograms);

  useEffect(() => {
    if (viewState === 'table') {
      fetchClassData();
    }
  }, [viewState, selectedProg, selectedSem]);

  const fetchClassData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch Students in this class
      const studentsRes = await api.get(`/students?department=${selectedDept}&program=${selectedProg}&semester=${selectedSem}&limit=0`);
      const classStudents = studentsRes.data.success ? studentsRes.data.data : [];
      setStudents(classStudents);

      if (classStudents.length === 0) {
        setMarksData([]);
        setSubjects([]);
        return;
      }

      // 2. Fetch Subjects for this class
      const subjectsRes = await api.get(`/subjects?program=${selectedProg}&semester=${selectedSem}`);
      const classSubjects = subjectsRes.data.success ? subjectsRes.data.data : [];
      setSubjects(classSubjects);

      // 3. Fetch Marks for these students
      const studentIds = classStudents.map(s => s._id).join(',');
      const marksRes = await api.get(`/marks?studentId=${studentIds}&semester=${selectedSem}`);
      setMarksData(marksRes.data.success ? marksRes.data.data : []);

    } catch (err) {
      console.error("Error fetching class data:", err);
      setError("Failed to load marklist data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeptSelect = (dept) => {
    setSelectedDept(dept);
    setViewState('class');
  };

  const handleClassSelect = (prog) => {
    setSelectedProg(prog);
    setViewState('table');
  };

  const getStudentMark = (studentId, subjectId) => {
    return marksData.find(m => 
      m.studentId?._id === studentId && 
      m.subjectId?._id === subjectId
    );
  };

  const renderBreadcrumbs = () => (
    <div className="selection-nav">
      <button className="nav-link" onClick={() => { setViewState('dept'); setSelectedDept(null); setSelectedProg(null); }}>
        Departments
      </button>
      {selectedDept && (
        <>
          <span className="nav-separator">/</span>
          <button className="nav-link" onClick={() => { setViewState('class'); setSelectedProg(null); }}>
            {selectedDept.toUpperCase()}
          </button>
        </>
      )}
      {selectedProg && (
        <>
          <span className="nav-separator">/</span>
          <button className="nav-link active">
            {selectedProg.toUpperCase()} (S{selectedSem})
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="marks-container">
      <div className="marks-header">
        <h2>Academic Mark Lists</h2>
        <button 
          className="btn-add-marks" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Close Form' : '+ Add Marks'}
        </button>
      </div>

      {showAddForm && (
        <AddMarks 
          onCancel={() => setShowAddForm(false)} 
          onSuccess={() => {
            setShowAddForm(false);
            if (viewState === 'table') fetchClassData();
          }} 
        />
      )}

      {renderBreadcrumbs()}

      {error && <div className="error-alert">{error}</div>}

      {viewState === 'dept' && (
        <div className="selection-grid animate-fade-in">
          {departments.map(dept => (
            <div key={dept} className="selection-card" onClick={() => handleDeptSelect(dept)}>
              <div className="card-initial">{dept[0].toUpperCase()}</div>
              <h3>{dept.toUpperCase()}</h3>
              <p>View Classes</p>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      )}

      {viewState === 'class' && (
        <div className="class-selection-container animate-slide-up">
          <div className="sem-selector">
            <label>Academic Semester:</label>
            <div className="sem-buttons">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <button 
                  key={s} 
                  className={`sem-btn ${selectedSem === s ? 'active' : ''}`}
                  onClick={() => setSelectedSem(s)}
                >
                  S{s}
                </button>
              ))}
            </div>
          </div>
          <div className="selection-grid">
            {departmentPrograms[selectedDept].map(prog => (
              <div key={prog} className="selection-card program-card" onClick={() => handleClassSelect(prog)}>
                <div className="card-initial">{prog[0].toUpperCase()}</div>
                <h3>{prog.toUpperCase()}</h3>
                <p>View Marklist</p>
                <div className="card-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewState === 'table' && (
        <div className="marklist-table-container animate-fade-in">
          {loading ? (
            <div className="table-loading">Gathering academic records...</div>
          ) : students.length === 0 ? (
            <div className="no-students-message">No students found in this class.</div>
          ) : (
            <div className="table-wrapper">
              <table className="class-marks-table">
                <thead>
                  <tr>
                    <th className="sticky-col">Roll No</th>
                    <th className="sticky-col">Student Name</th>
                    {subjects.map(sub => (
                      <th key={sub._id} className="subject-header">
                        {sub.name}
                        <span className="sub-code">{sub.code}</span>
                      </th>
                    ))}
                    <th className="total-header">Total</th>
                    <th className="perc-header">%</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => {
                    let studentTotal = 0;
                    let studentMaxTotal = 0;
                    
                    return (
                      <tr key={student._id}>
                        <td className="sticky-col roll-cell">{student.rollNumber}</td>
                        <td className="sticky-col name-cell">{student.name}</td>
                        {subjects.map(sub => {
                          const mark = getStudentMark(student._id, sub._id);
                          if (mark) {
                            studentTotal += mark.marks;
                            studentMaxTotal += mark.maxMarks;
                          }
                          return (
                            <td key={sub._id} className="mark-cell">
                              {mark ? (
                                <div className="mark-val">
                                  {mark.marks}
                                  <span className="max-m">/{mark.maxMarks}</span>
                                </div>
                              ) : <span className="no-mark">-</span>}
                            </td>
                          );
                        })}
                        <td className="total-cell">{studentTotal}</td>
                        <td className="perc-cell">
                          {studentMaxTotal > 0 ? Math.round((studentTotal / studentMaxTotal) * 100) : 0}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
