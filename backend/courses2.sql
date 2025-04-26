DROP SCHEMA IF exists courses;

create schema courses;

use courses;

CREATE TABLE IF NOT EXISTS course (
	course_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    prefix VARCHAR(3) NOT NULL,
    number VARCHAR(3) NOT NULL,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE  IF NOT EXISTS course_section (
	course_section_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    section_number VARCHAR(2) NOT NULL,
    room VARCHAR(50) NOT NULL,
    time DATETIME NOT NULL,
    constraint fk_cs_course
		foreign key (course_id)
        REFERENCES course(course_id)
        ON DELETE cascade
		on update cascade
);

CREATE TABLE IF NOT EXISTS major (
	major_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    major VARCHAR(30) NOT NULL UNIQUE,
    division VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS student (
	student_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    preferred_name VARCHAR(20),
    email VARCHAR(50) NOT NULL UNIQUE,
    major_id INT NOT NULL,
    graduating_year INT NOT NULL,
    constraint fk_student_major
		foreign key (major_id)
        REFERENCES major(major_id)
        ON DELETE cascade
		on update cascade
);

CREATE TABLE IF NOT EXISTS student_course (
	student_id INT NOT NULL,
    course_section_id INT NOT NULL,
    PRIMARY KEY (student_id, course_section_id),
    quiz_grade_1 FLOAT,
    quiz_grade_2 FLOAT,
    project_grade_1 FLOAT,
    project_grade_2 FLOAT,
    final_exam_grade FLOAT,
    constraint fk_sc_student
		foreign key (student_id)
        REFERENCES student(student_id)
        ON DELETE cascade
		on update cascade,
	constraint fk_sc_course
		foreign key (course_section_id)
        REFERENCES course_section(course_section_id)
        ON DELETE cascade
		on update cascade
);
    
INSERT INTO major (major, division) VALUES 
	("Computer Science & Innovation", "Information Technology & Sciences"),
	("Data Analytics", "Information Technology & Sciences"),
    ("Game Programming", "Information Technology & Sciences"),
	("Game Design", "Communication & Creative Media");
    

INSERT INTO student (first_name, last_name, preferred_name, email, major_id, graduating_year) VALUES 
	("Anne" , "Konicki", "Astrid", "anne.konicki@mymail.champlain.edu", 1, 2026),
    ("Ophelia", "Duke", null, "ophelia.duke@mymail.champlain.edu", 4, 2026),
    ("Joshua", "Sinclair Chong", "Jupiter", "joshua.sinclairchong@mymail.champlain.edu", 3, 2026),
    ("Ryan", "Buck", null, "ryan.buck@mymail.champlain.edu", 1, 2027);
    
INSERT INTO course (prefix, number, name, description) VALUES
("CSI", "300", "Database Management Systems", "Imagine this is a course description"),
("DAT", "220", "Data Mining", "This is a different course description except its wayyyyy cooler");

INSERT INTO course_section (course_id, section_number, room, time) VALUES
(1, 01, "JOYCE 201", "2025-04-09 11:30:00"),
(1, 02, "JOYCE 201", "2025-04-09 10:00:00"),
(2, 01, "JOYCE 211", "2025-04-09 11:30:00");

INSERT INTO student_course (student_id, course_section_id) VALUES
(1, 1),
(1, 3),
(4, 1),
(2, 2);