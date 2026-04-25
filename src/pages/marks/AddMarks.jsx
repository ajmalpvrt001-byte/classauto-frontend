import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AddMarks.css';

const AddMarks = ({ onCancel, onSuccess }) => {
    const [students, setStudents] = useState([]);
    const [allSubjects, setAllSubjects] = useState([]);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [formData, setFormData] = useState({
        studentId: '',
        examType: 'Internal',
        semester: 1,
        subjects: [{ subjectId: '', marks: '', maxMarks: 100 }]
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [selectedStudentInfo, setSelectedStudentInfo] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    // When student or semester changes, filter subjects
    useEffect(() => {
        if (selectedStudentInfo) {
            const matched = allSubjects.filter(
                s => s.program === selectedStudentInfo.program &&
                     s.semester === Number(formData.semester)
            );
            setFilteredSubjects(matched);
        } else {
            setFilteredSubjects([]);
        }
    }, [selectedStudentInfo, formData.semester, allSubjects]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [studentsRes, subjectsRes] = await Promise.all([
                api.get('/students?limit=0'),
                api.get('/subjects')
            ]);
            
            if (studentsRes.data.success) setStudents(studentsRes.data.data);
            if (subjectsRes.data.success) setAllSubjects(subjectsRes.data.data);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load student or subject data.");
        } finally {
            setLoading(false);
        }
    };

    const handleMainChange = (e) => {
        const { name, value } = e.target;

        // When student changes, grab their info for filtering
        if (name === 'studentId') {
            const student = students.find(s => s._id === value);
            setSelectedStudentInfo(student || null);
            // Reset subject rows and auto-set semester from student
            setFormData(prev => ({
                ...prev,
                studentId: value,
                semester: student ? student.semester : prev.semester,
                subjects: [{ subjectId: '', marks: '', maxMarks: 100 }]
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubjectChange = (index, field, value) => {
        const newSubjects = [...formData.subjects];
        newSubjects[index][field] = value;
        setFormData(prev => ({ ...prev, subjects: newSubjects }));
    };

    const addSubjectRow = () => {
        setFormData(prev => ({
            ...prev,
            subjects: [...prev.subjects, { subjectId: '', marks: '', maxMarks: 100 }]
        }));
    };

    const removeSubjectRow = (index) => {
        if (formData.subjects.length === 1) return;
        const newSubjects = formData.subjects.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, subjects: newSubjects }));
    };

    const validate = () => {
        if (!formData.studentId) return "Please select a student.";
        if (!formData.semester) return "Please enter a semester.";
        
        const subjectIds = new Set();
        for (const sub of formData.subjects) {
            if (!sub.subjectId) return "All rows must have a subject selected.";
            if (sub.marks === '') return "Please enter marks for all subjects.";
            if (Number(sub.marks) > Number(sub.maxMarks)) {
                const subName = filteredSubjects.find(s => s._id === sub.subjectId)?.name || 'subject';
                return `Marks cannot exceed max marks for ${subName}.`;
            }
            if (subjectIds.has(sub.subjectId)) return "Duplicate subjects are not allowed.";
            subjectIds.add(sub.subjectId);
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post('/marks/add', formData);
            if (response.data.success) {
                setSuccessMsg("Marks added successfully!");
                setTimeout(() => {
                    setSuccessMsg('');
                    onSuccess();
                }, 2000);
                
                // Reset form
                setFormData({
                    studentId: '',
                    examType: 'Internal',
                    semester: 1,
                    subjects: [{ subjectId: '', marks: '', maxMarks: 100 }]
                });
                setSelectedStudentInfo(null);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit marks.");
        } finally {
            setSubmitting(false);
        }
    };

    const totalMarks = formData.subjects.reduce((sum, sub) => sum + (Number(sub.marks) || 0), 0);
    const totalMax = formData.subjects.reduce((sum, sub) => sum + (Number(sub.maxMarks) || 0), 0);
    const percentage = totalMax > 0 ? ((totalMarks / totalMax) * 100).toFixed(1) : 0;

    if (loading) return <div className="add-marks-loading">Preparing form...</div>;

    return (
        <div className="add-marks-overlay">
            <div className="add-marks-card">
                <div className="form-header">
                    <h3>Add New Academic Record</h3>
                    <button className="btn-close-minimal" onClick={onCancel}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="main-fields">
                        <div className="field-group">
                            <label>Student</label>
                            <select 
                                name="studentId" 
                                value={formData.studentId} 
                                onChange={handleMainChange}
                                required
                            >
                                <option value="">Select Student</option>
                                {students.map(s => (
                                    <option key={s._id} value={s._id}>
                                        {s.name} ({s.rollNumber})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="field-group">
                            <label>Exam Type</label>
                            <select 
                                name="examType" 
                                value={formData.examType} 
                                onChange={handleMainChange}
                            >
                                <option value="Internal">Internal</option>
                                <option value="Semester">Semester</option>
                            </select>
                        </div>

                        <div className="field-group">
                            <label>Semester</label>
                            <input 
                                type="number" 
                                name="semester" 
                                min="1" 
                                max="8" 
                                value={formData.semester} 
                                onChange={handleMainChange}
                                required
                            />
                        </div>
                    </div>

                    {selectedStudentInfo && (
                        <div className="student-context">
                            Program: <strong>{selectedStudentInfo.program?.toUpperCase()}</strong> &nbsp;|&nbsp;
                            Dept: <strong>{selectedStudentInfo.department?.toUpperCase()}</strong> &nbsp;|&nbsp;
                            Showing <strong>{filteredSubjects.length}</strong> subjects for S{formData.semester}
                        </div>
                    )}

                    <div className="subjects-section">
                        <div className="subjects-header">
                            <h4>Subject-wise Marks</h4>
                            <div className="badge">Rows: {formData.subjects.length}</div>
                        </div>

                        {formData.subjects.map((sub, index) => (
                            <div key={index} className="subject-row">
                                <div className="field-group">
                                    <label>Subject</label>
                                    <select 
                                        value={sub.subjectId} 
                                        onChange={(e) => handleSubjectChange(index, 'subjectId', e.target.value)}
                                        required
                                    >
                                        <option value="">Choose Subject</option>
                                        {filteredSubjects.map(s => (
                                            <option key={s._id} value={s._id}>
                                                {s.name} ({s.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="field-group">
                                    <label>Marks</label>
                                    <input 
                                        type="number" 
                                        placeholder="Obtained"
                                        value={sub.marks} 
                                        onChange={(e) => handleSubjectChange(index, 'marks', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Max Marks</label>
                                    <input 
                                        type="number" 
                                        placeholder="Out of"
                                        value={sub.maxMarks} 
                                        onChange={(e) => handleSubjectChange(index, 'maxMarks', e.target.value)}
                                        required
                                    />
                                </div>

                                <button 
                                    type="button" 
                                    className="btn-remove"
                                    onClick={() => removeSubjectRow(index)}
                                    title="Remove row"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}

                        <button 
                            type="button" 
                            className="btn-add-row" 
                            onClick={addSubjectRow}
                        >
                            + Add Subject Row
                        </button>
                    </div>

                    {error && <div className="error-msg">⚠️ {error}</div>}

                    <div className="form-footer">
                        <div className="summary-stats">
                            <div className="stat">
                                <span className="stat-label">Total Score</span>
                                <span className="stat-value">{totalMarks} / {totalMax}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Percentage</span>
                                <span className="stat-value">{percentage}%</span>
                            </div>
                        </div>

                        <div className="actions">
                            <button 
                                type="submit" 
                                className="btn-submit"
                                disabled={submitting}
                            >
                                {submitting ? 'Saving...' : 'Submit Records'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {successMsg && <div className="success-toast">{successMsg}</div>}
        </div>
    );
};

export default AddMarks;
