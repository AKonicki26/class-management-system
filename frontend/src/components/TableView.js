import { useEffect, useState } from 'react';

const TableView = ({asAdmin}) => {
    const [majors, setMajors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [sections, setSections] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    
    
    const datasource = process.env.REACT_APP_DATA_SOURCE;
    
    const fetchData = () => {
        fetch(`${datasource}/majors`)
            .then(res => res.json())
            .then(setMajors);
        fetch(`${datasource}/courses`)
            .then(res => res.json())
            .then(setCourses);
        fetch(`${datasource}/students`)
            .then(res => res.json())
            .then(setStudents);
        fetch(`${datasource}/sections`)
            .then(res => res.json())
            .then(setSections);
        fetch(`${datasource}/enrollments`)
            .then(res => res.json())
            .then(setEnrollments);
        
    }
    
    useEffect(() => {fetchData()});
    return (
        <div>
            {/* Majors */}
            <div>
                <h2>Majors</h2>
                <table border="1" cellPadding="6" style={{ marginBottom: '2em' }}>
                    <thead>
                    <tr>
                        <th>Major ID</th>
                        <th>Major Name</th>
                        <th>Division</th>
                        {asAdmin && <th>Actions</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {majors.map(major => (
                        <tr key={major.major_id}>
                            <td>{major.major_id}</td>
                            <td>{major.major}</td>
                            <td>{major.division}</td>
                            {asAdmin && (
                                <td>
                                    <button onClick={() => {}}>Edit</button>
                                    <button onClick={() => {}}>Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* Courses */}
            <div>
                <h2>Courses</h2>
                <table border="1" cellPadding="6" style={{ marginBottom: '2em' }}>
                    <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Course Number</th>
                        <th>Course Name</th>
                        <th>Course Description</th>
                        {asAdmin && <th>Actions</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map(course => (
                        <tr key={course.course_id}>
                            <td>{course.course_id}</td>
                            <td>{`${course.prefix}-${course.number}`}</td>
                            <td>{course.name}</td>
                            <td>{course.description}</td>
                            {asAdmin && (
                                <td>
                                    <button onClick={() => {}}>Edit</button>
                                    <button onClick={() => {}}>Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* Sections */}
            <div>
                <h2>Sections</h2>
                <table border="1" cellPadding="6" style={{ marginBottom: '2em' }}>
                    <thead>
                    <tr>
                        <th>Section ID</th>
                        <th>Course</th>
                        <th>Section Number</th>
                        <th>Time</th>
                        <th>Room</th>
                        {asAdmin && <th>Actions</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {sections.map(section => (
                        <tr key={section.course_section_id}>
                            <td>{section.course_section_id}</td>
                            <td>{`${section.prefix}-${section.number}`}</td>
                            <td>{section.section_number}</td>
                            <td>{section.time}</td>
                            <td>{section.room}</td>
                            {asAdmin && (
                                <td>
                                    <button onClick={() => {}}>Edit</button>
                                    <button onClick={() => {}}>Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* Students */}
            <div>
                <h2>Students</h2>
                <table border="1" cellPadding="6" style={{ marginBottom: '2em' }}>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>E-Mail</th>
                            <th>Major</th>
                            <th>Graduating Year</th>
                            {asAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                    {students.map(student => (
                        <tr key={student.student_id}>
                            <td>{student.student_id}</td>
                            <td>{`${(student.preferred_name === null ? student.first_name : student.preferred_name)} ${student.last_name}`}</td>
                            <td>{student.email}</td>
                            <td>{student.major}</td>
                            <td>{student.graduating_year}</td>
                            {asAdmin && (
                                <td>
                                    <button onClick={() => {}}>Edit</button>
                                    <button onClick={() => {}}>Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* Enrollments */}
            <div>
                <h2>Enrollments</h2>
                <table border="1" cellPadding="6" style={{ marginBottom: '2em' }}>
                    <thead>
                    <tr>
                        <th>Student</th>
                        <th>Section</th>
                        <th>Quiz Grade 1</th>
                        <th>Quiz Grade 2</th>
                        <th>Project Grade 1</th>
                        <th>Project Grade 2</th>
                        <th>Final Exam Grade</th>
                        {asAdmin && <th>Actions</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {enrollments.map(enrollment => (
                        <tr key={`student-${enrollment.student_id}-section-${enrollment.course_section_id}`}>
                            <td>{`${(enrollment.preferred_name === null ? enrollment.first_name : enrollment.preferred_name)} ${enrollment.last_name}`}</td>
                            <td>{`${enrollment.prefix}-${enrollment.number}-${enrollment.section_number}`}</td>
                            <td>{(enrollment.quiz_grade_1 === null ? 0 : enrollment.quiz_grade_1)}</td>
                            <td>{(enrollment.quiz_grade_2 === null ? 0 : enrollment.quiz_grade_2)}</td>
                            <td>{(enrollment.project_grade_1 === null ? 0 : enrollment.project_grade_1)}</td>
                            <td>{(enrollment.project_grade_2 === null ? 0 : enrollment.project_grade_2)}</td>
                            <td>{(enrollment.final_exam_grade === null ? 0 : enrollment.final_exam_grade)}</td>
                            {asAdmin && (
                                <td>
                                    <button onClick={() => {}}>Edit</button>
                                    <button onClick={() => {}}>Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


export default TableView;