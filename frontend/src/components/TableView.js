import {useEffect, useState} from 'react';

const TableView = ({asAdmin}) => {
    const [majors, setMajors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [sections, setSections] = useState([]);
    const [enrollments, setEnrollments] = useState([]);


    const dataSource = process.env.REACT_APP_DATA_SOURCE;

    const getEmail = (firstName, lastName) => `${newStudentFirstName}.${newStudentLastName}@mymail.champlain.edu`.toLowerCase().replace(/[^0-9a-zA-Z.@]/g, '');

    // Creations

    const [majorText, setMajorText] = useState('');
    const [divisionText, setDivisionText] = useState('');
    const createMajor = async (e) => {
        e.preventDefault();
        console.log(majorText, divisionText);
        await fetch(`${dataSource}/majors`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({major_name: majorText, division: divisionText})
        });
        setMajorText(null);
        setDivisionText(null);
        fetchData();
    }

    // Student creation
    const [newStudentFirstName, setNewStudentFirstName] = useState('');
    const [newStudentLastName, setNewStudentLastName] = useState('');
    const [newStudentGraduatingYear, setNewStudentGraduatingYear] = useState('');
    const [newStudentMajorId, setNewStudentMajorId] = useState('');

    // Course creation
    const [newCoursePrefix, setNewCoursePrefix] = useState('');
    const [newCourseNumber, setNewCourseNumber] = useState('');
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseDescription, setNewCourseDescription] = useState('');

    const createCourse = async (e) => {
        e.preventDefault();
        await fetch(`${dataSource}/courses`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                prefix: newCoursePrefix,
                number: newCourseNumber,
                name: newCourseName,
                description: newCourseDescription,
            })
        });
        setNewCoursePrefix('');
        setNewCourseNumber('');
        setNewCourseName('');
        setNewCourseDescription('');
        fetchData();
    }

    const createStudent = async (e) => {
        e.preventDefault();
        await fetch(`${dataSource}/students`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                first_name: newStudentFirstName,
                last_name: newStudentLastName,
                email: getEmail(newStudentFirstName, newStudentLastName),
                major_id: newStudentMajorId,
                graduating_year: newStudentGraduatingYear
            })
        });
        setNewStudentFirstName('');
        setNewStudentLastName('');
        setNewStudentGraduatingYear('');
        setNewStudentMajorId('');
        fetchData();
    }

    // Section creation
    const [newSectionCourseId, setNewSectionCourseId] = useState('');
    const [newSectionTime, setNewSectionTime] = useState('');
    const [newSectionRoom, setNewSectionRoom] = useState('');

    const createSection = async (e) => {
        e.preventDefault();
        await fetch(`${dataSource}/sections`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                course_id: newSectionCourseId,
                time: newSectionTime,
                room: newSectionRoom
            })
        });
        setNewSectionCourseId('');
        setNewSectionTime('');
        setNewSectionRoom('');
        fetchData();
    }

    // Enrollment creation
    const [newEnrollmentStudentId, setNewEnrollmentStudentId] = useState('');
    const [newEnrollmentSectionId, setNewEnrollmentSectionId] = useState('');

    const createEnrollment = async (e) => {
        e.preventDefault();

        const selectedCourseId = sections.find(section => section.course_section_id === parseInt(newEnrollmentSectionId)).course_id;

        // if there already exists a section in which the student is enrolled for this course
        if (enrollments.some(enroll =>
            enroll.student_id === parseInt(newEnrollmentStudentId) &&
            enroll.course_id === selectedCourseId
        )) {
            window.alert("You cannot enroll a student in multiple sections of the same course!");

        } else {
            await fetch(`${dataSource}/enrollments`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    student_id: newEnrollmentStudentId,
                    course_section_id: newEnrollmentSectionId
                })
            });
        }

        setNewEnrollmentStudentId('');
        setNewEnrollmentSectionId('');
        fetchData();
    }

    // Major Editing
    const deleteMajor = async (id) => {
        await fetch(`${dataSource}/majors/${id}`, {method: 'DELETE'});
        fetchData();
    }

    const [editingMajorId, setEditingMajorId] = useState(null);
    const [editingMajorText, setEditingMajorText] = useState('');
    const [editingDivisionText, setEditingDivisionText] = useState('');

    const updateMajor = async (id) => {
        await fetch(`${dataSource}/majors/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({major: editingMajorText, division: editingDivisionText})
        });
        setEditingMajorId(null);
        fetchData();
    }

    // Course Editing
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [editingCoursePrefix, setEditingCoursePrefix] = useState('');
    const [editingCourseNumber, setEditingCourseNumber] = useState('');
    const [editingCourseName, setEditingCourseName] = useState('');
    const [editingCourseDescription, setEditingCourseDescription] = useState('');

    const updateCourse = async (id) => {
        await fetch(`${dataSource}/courses/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                prefix: editingCoursePrefix,
                number: editingCourseNumber,
                name: editingCourseName,
                description: editingCourseDescription,
            })
        });
        setEditingCourseId(null);
        fetchData();
    }

    const deleteCourse = async (id) => {
        await fetch(`${dataSource}/courses/${id}`, {method: 'DELETE'});
        fetchData();
    }

    // Students editing
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [editingStudentFirstName, setEditingStudentFirstName] = useState('');
    const [editingStudentLastName, setEditingStudentLastName] = useState('');
    const [editingStudentGraduatingYear, setEditingStudentGraduatingYear] = useState('');
    const [editingStudentMajor, setEditingStudentMajor] = useState('');

    const updateStudent = async (id) => {
        await fetch(`${dataSource}/students/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                first_name: editingStudentFirstName,
                last_name: editingStudentLastName,
                email: getEmail(newStudentFirstName, newStudentLastName),
                graduating_year: editingStudentGraduatingYear,
                major_id: editingStudentMajor,
            })
        });
        setEditingStudentId(null);
        fetchData();
    }

    const deleteStudent = async (id) => {
        await fetch(`${dataSource}/students/${id}`, {method: 'DELETE'});
        fetchData();
    }

    // Section editing
    const [editingSectionId, setEditingSectionId] = useState(null);
    const [editingSectionTime, setEditingSectionTime] = useState('');
    const [editingSectionRoom, setEditingSectionRoom] = useState('');

    const updateSection = async (e) => {
        e.preventDefault();
        await fetch(`${dataSource}/sections/${editingSectionId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                time: editingSectionTime,
                room: editingSectionRoom
            })
        });
        setEditingSectionId(null);
        setEditingSectionTime('');
        setEditingSectionRoom('');
        fetchData();
    };

    const deleteSection = async (id) => {
        await fetch(`${dataSource}/sections/${id}`, {method: 'DELETE'});
        fetchData();
    };


    // Enrollments Editing
    const [editingEnrollmentId, setEditingEnrollmentId] = useState(null);
    const [editingQuizGrade1, setEditingQuizGrade1] = useState(0);
    const [editingQuizGrade2, setEditingQuizGrade2] = useState(0);
    const [editingProjectGrade1, setEditingProjectGrade1] = useState(0);
    const [editingProjectGrade2, setEditingProjectGrade2] = useState(0);
    const [editingFinalExamGrade, setEditingFinalExamGrade] = useState(0);

    const clampGrade = (grade) => Math.min(Math.max(grade, 0), 100);

    const updateEnrollment = async (studentId, sectionId) => {
        await fetch(`${dataSource}/enrollments/${studentId}/${sectionId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                quiz_grade_1: clampGrade(editingQuizGrade1),
                quiz_grade_2: clampGrade(editingQuizGrade2),
                project_grade_1: clampGrade(editingProjectGrade1),
                project_grade_2: clampGrade(editingProjectGrade2),
                final_exam_grade: clampGrade(editingFinalExamGrade),
            })
        });
        setEditingEnrollmentId(null);
        fetchData();
    }

    const deleteEnrollment = async (studentId, sectionId) => {
        await fetch(`${dataSource}/enrollments/${studentId}/${sectionId}`, {
            method: 'DELETE'
        });
        fetchData();
    }

    const fetchData = () => {
        fetch(`${dataSource}/majors`)
            .then(res => res.json())
            .then(setMajors);
        fetch(`${dataSource}/courses`)
            .then(res => res.json())
            .then(setCourses);
        fetch(`${dataSource}/students`)
            .then(res => res.json())
            .then(setStudents);
        fetch(`${dataSource}/sections`)
            .then(res => res.json())
            .then(setSections);
        fetch(`${dataSource}/enrollments`)
            .then(res => res.json())
            .then(setEnrollments);

    }

    useEffect(() => {
        fetchData()
    });


    return (
        <div>
            {/* Majors */}
            <div>
                <h2>Majors</h2>
                {asAdmin && (
                    <div>
                        <form onSubmit={createMajor}>
                            <>
                                <input
                                    name="major_name"
                                    placeholder="Major Name"
                                    value={majorText || ''}
                                    onChange={(e) => setMajorText(e.target.value)}
                                    required
                                />
                                <input
                                    name="division"
                                    placeholder="Division"
                                    value={divisionText || ''}
                                    onChange={(e) => setDivisionText(e.target.value)}
                                    required
                                />
                            </>
                            <button type="submit">Add</button>
                        </form>
                    </div>
                )}
                <table border="1" cellPadding="6" style={{marginBottom: '2em'}}>
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
                            <td>
                                {editingMajorId === major.major_id ? (
                                    <input
                                        value={editingMajorText}
                                        onChange={(e) => setEditingMajorText(e.target.value)}
                                    />
                                ) : (
                                    major.major
                                )}
                            </td>
                            <td>
                                {editingMajorId === major.major_id ? (
                                    <input
                                        value={editingDivisionText}
                                        onChange={(e) => setEditingDivisionText(e.target.value)}
                                    />
                                ) : (
                                    major.division
                                )}
                            </td>
                            {asAdmin && (
                                <td>
                                    {editingMajorId === major.major_id ? (
                                        <>
                                            <button onClick={() => updateMajor(major.major_id)}>Save</button>
                                            <button onClick={() => setEditingMajorId(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => {
                                                setEditingMajorId(major.major_id);
                                                setEditingMajorText(major.major);
                                                setEditingDivisionText(major.division);
                                            }}>Edit
                                            </button>
                                            <button onClick={() => deleteMajor(major.major_id)}>Delete</button>
                                        </>
                                    )}

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
                {asAdmin && (
                    <div>
                        <form onSubmit={createCourse}>
                            <input
                                placeholder="Prefix"
                                value={newCoursePrefix}
                                onChange={(e) => setNewCoursePrefix(e.target.value)}
                                required
                            />
                            <input
                                placeholder="Number"
                                value={newCourseNumber}
                                onChange={(e) => setNewCourseNumber(e.target.value)}
                                required
                            />
                            <input
                                placeholder="Course Name"
                                value={newCourseName}
                                onChange={(e) => setNewCourseName(e.target.value)}
                                required
                            />
                            <input
                                placeholder="Course Description"
                                value={newCourseDescription}
                                onChange={(e) => setNewCourseDescription(e.target.value)}
                            />
                            <button type="submit">Add Course</button>
                        </form>
                    </div>
                )}
                <table border="1" cellPadding="6" style={{marginBottom: '2em'}}>
                    <thead>
                    <tr>
                        <th>Course ID</th>
                        {asAdmin ?
                            <>
                                <th>Course Prefix</th>
                                <th>Course Number</th>
                            </>
                            :
                            <th>Course Number</th>
                        }

                        <th>Course Name</th>
                        <th>Course Description</th>
                        {asAdmin && <th>Actions</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map(course => (
                        <tr key={course.course_id}>
                            <td>{course.course_id}</td>
                            {asAdmin ? (
                                editingCourseId === course.course_id ? (
                                    <>
                                        <td>
                                            <input
                                                value={editingCoursePrefix}
                                                onChange={(e) => setEditingCoursePrefix(e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                value={editingCourseNumber}
                                                onChange={(e) => setEditingCourseNumber(e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                value={editingCourseName}
                                                onChange={(e) => setEditingCourseName(e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                value={editingCourseDescription}
                                                onChange={(e) => setEditingCourseDescription(e.target.value)}
                                            />
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{course.prefix}</td>
                                        <td>{course.number}</td>
                                        <td>{course.name}</td>
                                        <td>{course.description}</td>
                                    </>
                                )
                            ) : (
                                <>
                                    <td>{`${course.prefix}-${course.number}`}</td>
                                    <td>{course.name}</td>
                                    <td>{course.description}</td>
                                </>
                            )}
                            {asAdmin && (
                                <td>
                                    {editingCourseId === course.course_id ? (
                                        <>
                                            <button onClick={() => updateCourse(course.course_id)}>Save</button>
                                            <button onClick={() => setEditingCourseId(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => {
                                                setEditingCourseId(course.course_id);
                                                setEditingCoursePrefix(course.prefix);
                                                setEditingCourseNumber(course.number);
                                                setEditingCourseName(course.name);
                                                setEditingCourseDescription(course.description);
                                            }}>
                                                Edit
                                            </button>
                                            <button onClick={() => deleteCourse(course.course_id)}>Delete</button>
                                        </>
                                    )}
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
                {asAdmin && (
                    <div>
                        <form onSubmit={createSection}>
                            <select
                                value={newSectionCourseId}
                                onChange={(e) => setNewSectionCourseId(e.target.value)}
                                required
                            >
                                <option value="">Select Course</option>
                                {courses.map(course => (
                                    <option key={course.course_id}
                                            value={course.course_id}>{`${course.prefix}-${course.number}: ${course.name}`}</option>
                                ))}
                            </select>
                            <input
                                placeholder="Time"
                                value={newSectionTime}
                                onChange={(e) => setNewSectionTime(e.target.value)}
                                required
                            />
                            <input
                                placeholder="Room"
                                value={newSectionRoom}
                                onChange={(e) => setNewSectionRoom(e.target.value)}
                                required
                            />
                            <button type="submit">Add Section</button>
                        </form>
                    </div>
                )}
                <table border="1" cellPadding="6" style={{marginBottom: '2em'}}>
                    <thead>
                    <tr>
                        <th>Section ID</th>
                        <th>Course</th>
                        <th>Time</th>
                        <th>Room</th>
                        {asAdmin && <th>Actions</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {sections.map(section => (
                        <tr key={section.course_section_id}>
                            <td>{section.course_section_id}</td>
                            <td>{section.prefix}-{section.number}-{section.section_number}: {section.name}</td>
                            <td>
                                {editingSectionId === section.course_section_id ? (
                                    <input
                                        value={editingSectionTime}
                                        onChange={(e) => setEditingSectionTime(e.target.value)}
                                    />
                                ) : (
                                    section.time
                                )}
                            </td>
                            <td>
                                {editingSectionId === section.course_section_id ? (
                                    <input
                                        value={editingSectionRoom}
                                        onChange={(e) => setEditingSectionRoom(e.target.value)}
                                    />
                                ) : (
                                    section.room
                                )}
                            </td>
                            {asAdmin && (
                                <td>
                                    {editingSectionId === section.course_section_id ? (
                                        <>
                                            <button onClick={(e) => updateSection(e)}>Save</button>
                                            <button onClick={() => setEditingSectionId(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => {
                                                setEditingSectionId(section.course_section_id);
                                                setEditingSectionTime(section.time);
                                                setEditingSectionRoom(section.room);
                                            }}>Edit
                                            </button>
                                            <button onClick={() => deleteSection(section.course_section_id)}>Delete
                                            </button>
                                        </>
                                    )}
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
                {asAdmin && (
                    <div>
                        <form onSubmit={createStudent}>
                            <input
                                placeholder="First Name"
                                value={newStudentFirstName}
                                onChange={(e) => setNewStudentFirstName(e.target.value)}
                                required
                            />
                            <input
                                placeholder="Last Name"
                                value={newStudentLastName}
                                onChange={(e) => setNewStudentLastName(e.target.value)}
                                required
                            />
                            <input
                                placeholder="Graduating Year"
                                type="number"
                                value={newStudentGraduatingYear}
                                onChange={(e) => setNewStudentGraduatingYear(e.target.value)}
                                required
                            />
                            <select
                                value={newStudentMajorId}
                                onChange={(e) => setNewStudentMajorId(e.target.value)}
                                required
                            >
                                <option value="">Select Major</option>
                                {majors.map(major => (
                                    <option key={major.major_id} value={major.major_id}>{major.major}</option>
                                ))}
                            </select>
                            <button type="submit">Add Student</button>
                        </form>
                    </div>
                )}
                <table border="1" cellPadding="6" style={{marginBottom: '2em'}}>
                    <thead>
                    <tr>
                        <th>Student ID</th>
                        {asAdmin ?
                            <>
                                <th>First Name</th>
                                <th>Last Name</th>
                            </>
                            :
                            <th>Name</th>
                        }

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
                            {asAdmin ? (
                                editingStudentId === student.student_id ? (
                                    <>
                                        <td>
                                            <input
                                                value={editingStudentFirstName}
                                                onChange={(e) => setEditingStudentFirstName(e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                value={editingStudentLastName}
                                                onChange={(e) => setEditingStudentLastName(e.target.value)}
                                            />
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{student.first_name}</td>
                                        <td>{student.last_name}</td>
                                    </>
                                )
                            ) : (
                                <td>{`${(student.preferred_name === null ? student.first_name : student.preferred_name)} ${student.last_name}`}</td>
                            )}
                            <td>{student.email}</td>
                            <td>
                                {editingStudentId === student.student_id ? (
                                    <select
                                        value={editingStudentMajor}
                                        onChange={(e) => setEditingStudentMajor(e.target.value)}
                                    >
                                        <option value="">Select Major</option>
                                        {majors.map((major) => (
                                            <option key={major.major_id} value={major.major_id}>
                                                {major.major}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    student.major
                                )}
                            </td>
                            <td>
                                {editingStudentId === student.student_id ? (
                                    <input
                                        type="number"
                                        value={editingStudentGraduatingYear}
                                        onChange={(e) => setEditingStudentGraduatingYear(e.target.value)}
                                    />
                                ) : (
                                    student.graduating_year
                                )}
                            </td>
                            {asAdmin && (
                                <td>
                                    {editingStudentId === student.student_id ? (
                                        <>
                                            <button onClick={() => updateStudent(student.student_id)}>Save</button>
                                            <button onClick={() => setEditingStudentId(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => {
                                                setEditingStudentId(student.student_id);
                                                setEditingStudentFirstName(student.first_name);
                                                setEditingStudentLastName(student.last_name);
                                                setEditingStudentGraduatingYear(student.graduating_year);
                                                setEditingStudentMajor(student.major_id);
                                            }}>
                                                Edit
                                            </button>
                                            <button onClick={() => deleteStudent(student.student_id)}>Delete</button>
                                        </>
                                    )}
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
                {asAdmin && (
                    <div>
                        <form onSubmit={createEnrollment}>
                            <select
                                value={newEnrollmentStudentId}
                                onChange={(e) => setNewEnrollmentStudentId(e.target.value)}
                                required
                            >
                                <option value="">Select Student</option>
                                {students.map(student => (
                                    <option key={student.student_id} value={student.student_id}>
                                        {(student.preferred_name || student.first_name) + ' ' + student.last_name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={newEnrollmentSectionId}
                                onChange={(e) => setNewEnrollmentSectionId(e.target.value)}
                                required
                            >
                                <option value="">Select Section</option>
                                {sections.map(section => (
                                    <option key={section.course_section_id} value={section.course_section_id}>
                                        {`${section.prefix}-${section.number}-${section.section_number}`}
                                    </option>
                                ))}
                            </select>
                            <button type="submit">Enroll Student</button>
                        </form>
                    </div>
                )}
                <table border="1" cellPadding="6" style={{marginBottom: '2em'}}>
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
                    {enrollments.map(enrollment => {
                        const enrollmentKey = `student-${enrollment.student_id}-section-${enrollment.course_section_id}`;
                        const isEditing = editingEnrollmentId === enrollmentKey;
                        return (
                            <tr key={enrollmentKey}>
                                <td>{`${(enrollment.preferred_name === null ? enrollment.first_name : enrollment.preferred_name)} ${enrollment.last_name}`}</td>
                                <td>{`${enrollment.prefix}-${enrollment.number}-${enrollment.section_number}`}</td>

                                {isEditing ? (
                                    <>
                                        <td><input type="number" value={editingQuizGrade1}
                                                   onChange={(e) => setEditingQuizGrade1(e.target.value)}/></td>
                                        <td><input type="number" value={editingQuizGrade2}
                                                   onChange={(e) => setEditingQuizGrade2(e.target.value)}/></td>
                                        <td><input type="number" value={editingProjectGrade1}
                                                   onChange={(e) => setEditingProjectGrade1(e.target.value)}/></td>
                                        <td><input type="number" value={editingProjectGrade2}
                                                   onChange={(e) => setEditingProjectGrade2(e.target.value)}/></td>
                                        <td><input type="number" value={editingFinalExamGrade}
                                                   onChange={(e) => setEditingFinalExamGrade(e.target.value)}/></td>
                                    </>
                                ) : (
                                    <>
                                        <td>{enrollment.quiz_grade_1 ?? 0}</td>
                                        <td>{enrollment.quiz_grade_2 ?? 0}</td>
                                        <td>{enrollment.project_grade_1 ?? 0}</td>
                                        <td>{enrollment.project_grade_2 ?? 0}</td>
                                        <td>{enrollment.final_exam_grade ?? 0}</td>
                                    </>
                                )}

                                {asAdmin && (
                                    <td>
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={() => updateEnrollment(enrollment.student_id, enrollment.course_section_id)}>Save
                                                </button>
                                                <button onClick={() => setEditingEnrollmentId(null)}>Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => {
                                                    setEditingEnrollmentId(enrollmentKey);
                                                    setEditingQuizGrade1(enrollment.quiz_grade_1 ?? 0);
                                                    setEditingQuizGrade2(enrollment.quiz_grade_2 ?? 0);
                                                    setEditingProjectGrade1(enrollment.project_grade_1 ?? 0);
                                                    setEditingProjectGrade2(enrollment.project_grade_2 ?? 0);
                                                    setEditingFinalExamGrade(enrollment.final_exam_grade ?? 0);
                                                }}>Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteEnrollment(enrollment.student_id, enrollment.course_section_id)}>Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


export default TableView;