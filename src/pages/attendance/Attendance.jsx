import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Phone, MessageSquare } from 'lucide-react';
import './Attendance.css';

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
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
    setError('');
    try {
      const response = await api.get('/students');
      if (response.data.success) {
        setStudents(response.data.data);
      } else {
        setError(response.data.message || "Failed to load students.");
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Unable to connect to server. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = async (student) => {
    setSelectedStudent(student);
    setModalLoading(true);
    setAttendanceStats([]);
    try {
      const response = await api.get(`/attendance/stats?studentId=${student._id}`);
      if (response.data.success) {
        // Map data for recharts
        const chartData = response.data.data.map(item => ({
          subject: item.subjectName,
          percentage: item.percentage,
          present: item.present,
          total: item.total
        }));
        setAttendanceStats(chartData);
      }
    } catch (err) {
      console.error("Error fetching attendance stats:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setAttendanceStats([]);
  };

  const getOverallAverage = () => {
    if (attendanceStats.length === 0) return 0;
    const sum = attendanceStats.reduce((acc, curr) => acc + curr.percentage, 0);
    return Math.round(sum / attendanceStats.length);
  };

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h2>Attendance Intelligence</h2>
      </div>

      {error && <div className="error-alert">{error}</div>}

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
              <p>Attendance Tracking</p>
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
              <p>View Attendance Stats</p>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="student-list-grid animate-slide-up">
          {students.filter(s => s.department === selectedDept && s.program === selectedProg).length === 0 ? (
            <div className="empty-state">
              <h3>No Students Found</h3>
              <p>No records match this program selection.</p>
            </div>
          ) : (
            students
              .filter(s => s.department === selectedDept && s.program === selectedProg)
              .map(student => (
                <div 
                  key={student._id} 
                  className="student-attendance-card"
                  onClick={() => handleStudentClick(student)}
                >
                  <div className="stu-name">{student.name}</div>
                  <div className="stu-details">
                    <div>Roll: {student.rollNumber}</div>
                    <div>Year {student.year} | Sem {student.semester}</div>
                  </div>
                  <div className="stu-badge">View Analysis</div>
                </div>
              ))
          )}
        </div>
      )}

      {selectedStudent && (
        <div className="att-modal-overlay" onClick={closeModal}>
          <div className="att-modal-content" onClick={e => e.stopPropagation()}>
            <button className="att-modal-close" onClick={closeModal}>&times;</button>
            <div className="att-modal-inner">
              <div className="att-modal-header">
                <h3>{selectedStudent.name}'s Attendance</h3>
                <p>{selectedStudent.department} | Roll: {selectedStudent.rollNumber}</p>
              </div>

              {modalLoading ? (
                <div className="modal-loading">Analyzing records...</div>
              ) : attendanceStats.length > 0 ? (
                <>
                  <div className="graph-section">
                    <div style={{ width: '100%', height: 350 }}>
                      <ResponsiveContainer>
                        <BarChart data={attendanceStats}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="subject" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            interval={0}
                            angle={-15}
                            textAnchor="end"
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            domain={[0, 100]}
                          />
                          <Tooltip 
                            cursor={{ fill: '#f1f5f9' }}
                            contentStyle={{ 
                              borderRadius: '12px', 
                              border: 'none', 
                              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                            }}
                          />
                          <Bar 
                            dataKey="percentage" 
                            radius={[8, 8, 0, 0]} 
                            barSize={40}
                          >
                            {attendanceStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="stats-summary">
                    <div className="stat-item">
                      <span className="stat-label">Overall Attendance</span>
                      <div className={`stat-value ${getOverallAverage() >= 75 ? 'high' : 'low'}`}>
                        {getOverallAverage()}%
                      </div>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Subjects Tracked</span>
                      <div className="stat-value">{attendanceStats.length}</div>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Status</span>
                      <div className={`stat-value ${getOverallAverage() >= 75 ? 'high' : 'low'}`}>
                        {getOverallAverage() >= 75 ? 'Eligible' : 'Shortage'}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-marks-message">
                  No attendance records found for this student.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
