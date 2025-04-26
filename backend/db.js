const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, 'dev.sqlite');
const db = new sqlite3.Database(dbPath);

// Create tables if not exists
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS course
    (
        course_id
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        prefix
        VARCHAR
            (
        3
            ) NOT NULL,
        number VARCHAR
            (
                3
            ) NOT NULL,
        name VARCHAR
            (
                50
            ) NOT NULL UNIQUE,
        description TEXT
        );`);

    db.run(`CREATE TABLE IF NOT EXISTS course_section
    (
        course_section_id
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        course_id
        INTEGER
        NOT
        NULL,
        section_number
        VARCHAR
            (
        2
            ) NOT NULL,
        room VARCHAR
            (
                50
            ) NOT NULL,
        time DATETIME NOT NULL,
        CONSTRAINT fk_cs_course FOREIGN KEY
            (
                course_id
            )
        REFERENCES course
            (
                course_id
            )
        ON DELETE CASCADE
        ON UPDATE CASCADE
        );`);

    db.run(`CREATE TABLE IF NOT EXISTS major
    (
        major_id
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        major
        VARCHAR
            (
        30
            ) NOT NULL UNIQUE,
        division VARCHAR
            (
                60
            ) NOT NULL
        );`);

    db.run(`CREATE TABLE IF NOT EXISTS student
    (
        student_id
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        first_name
        VARCHAR
            (
        20
            ) NOT NULL,
        last_name VARCHAR
            (
                30
            ) NOT NULL,
        preferred_name VARCHAR
            (
                20
            ),
        email VARCHAR
            (
                50
            ) NOT NULL UNIQUE,
        major_id INTEGER NOT NULL,
        graduating_year INTEGER NOT NULL,
        CONSTRAINT fk_student_major FOREIGN KEY
            (
                major_id
            )
        REFERENCES major
            (
                major_id
            )
        ON DELETE CASCADE
        ON UPDATE CASCADE
        );`);

    db.run(`CREATE TABLE IF NOT EXISTS student_course
    (
        student_id
        INTEGER
        NOT
        NULL,
        course_section_id
        INTEGER
        NOT
        NULL,
        quiz_grade_1
        FLOAT,
        quiz_grade_2
        FLOAT,
        project_grade_1
        FLOAT,
        project_grade_2
        FLOAT,
        final_exam_grade
        FLOAT,
        PRIMARY
        KEY
            (
        student_id,
        course_section_id
            ),
        CONSTRAINT fk_sc_student FOREIGN KEY
            (
                student_id
            )
        REFERENCES student
            (
                student_id
            )
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        CONSTRAINT fk_sc_course FOREIGN KEY
            (
                course_section_id
            )
        REFERENCES course_section
            (
                course_section_id
            )
        ON DELETE CASCADE
        ON UPDATE CASCADE
        );`);
});

module.exports = db;
