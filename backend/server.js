const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// Auth
app.post('/login', (req, res) => {
    console.log('🛠️ LOGIN ATTEMPT RECEIVED');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
  
    const { user, password } = req.body;
    if (user === 'ADMIN' && password === 'ADMIN') {
      console.log('✅ Login success');
      res.json({ success: true });
    } else {
      console.log('❌ Invalid credentials');
      res.status(401).json({ success: false });
    }
  });

// Courses tables
app.get('/majors', (req, res) => {
    db.all('SELECT * FROM major', [], (err, rows) => res.json(rows));
})

app.delete('/majors/:id', (req, res) => {
    db.run('DELETE FROM major WHERE major_id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ deleted: this.changes });
    });
})

app.put('/majors/:id', (req, res) => {
    const {major, division} = req.body;
    db.run('UPDATE major SET major = ?, division = ? WHERE major_id = ?', 
        [major,  division, req.params.id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({id: this.lastID});
        });
});

app.post('/majors', (req, res) => {
    const {major_name, division} = req.body;
    db.run(`INSERT INTO major (major, division) VALUES (?, ?)`, 
        [major_name, division],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({id: this.lastID});
        });
});



app.get('/courses', (req, res) => {
    db.all('SELECT * FROM course', [], (err, rows) => res.json(rows));
});

app.delete('/courses/:id', (req, res) => {
    db.run('DELETE FROM course WHERE course_id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ deleted: this.changes });
    });
})

app.put('/courses/:id', (req, res) => {
    const {prefix, number, name, description} = req.body;
    db.run('UPDATE course SET prefix = ?, number = ?, name = ?, description = ? WHERE course_id = ?',
        [prefix, number, name, description, req.params.id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({id: this.lastID});
        });
});

app.post('/courses', (req, res) => {
    const {prefix, number, name, description} = req.body;
    db.run(`INSERT INTO course (prefix, number, name, description) VALUES (?, ?, ?, ?)`,
        [prefix, number, name, description],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({id: this.lastID});
        });
});

app.get('/students', (req, res) => {
    db.all(`SELECT * FROM student s
join major m 
ON s.major_id = m.major_id`, [], (err, rows) => res.json(rows));
});

app.delete('/students/:id', (req, res) => {
    db.run('DELETE FROM student WHERE student_id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ deleted: this.changes });
    });
})

app.put('/students/:id', (req, res) => {
    const {first_name, last_name, email, major_id, graduating_year} = req.body;
    db.run('UPDATE student SET first_name = ?, last_name = ?, email = ?, graduating_year = ?, major_id = ?  WHERE student_id = ?',
        [first_name, last_name, email, graduating_year, major_id, req.params.id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({id: this.lastID});
        });
});

app.post('/students', (req, res) => {
    const {first_name, last_name, email, major_id, graduating_year} = req.body;
    db.run(`INSERT INTO student (first_name, last_name, email, major_id, graduating_year) VALUES (?, ?, ?, ?, ?)`,
        [first_name, last_name, email, major_id, graduating_year],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({id: this.lastID});
        });
});

app.get('/sections', (req, res) => {
    db.all(`SELECT * FROM course_section cs
JOIN course c 
ON cs.course_id = c.course_id`, [], (err, rows) => res.json(rows));
});

app.delete('/sections/:id', (req, res) => {
    db.run('DELETE FROM course_section WHERE course_section_id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ deleted: this.changes });
    });
})

app.put('/sections/:id', (req, res) => {
    const {time, room} = req.body;
    console.log(req.body);
    db.run('UPDATE course_section SET time = ?, room = ? WHERE course_section_id = ?',
        [time, room, req.params.id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({id: this.lastID});
        });
});

app.post('/sections', (req, res) => {
    const {course_id, time, room} = req.body;
    
    // Get the next section number
    db.get('SELECT MAX(section_number) + 1 AS next_section_number FROM course_section WHERE course_id = ?', [course_id], (err, row) => {
        if (err) return res.status(500).json(err);

        const nextSectionNumber = row.next_section_number || 1;

        // Then make that section
        db.run('INSERT INTO course_section (course_id, section_number, time, room) VALUES (?, ?, ?, ?)',
            [course_id, nextSectionNumber, time, room],
            function (err) {
                if (err) return res.status(500).json(err);
                res.json({ id: this.lastID });
            }
        );
    });
});

app.get('/enrollments', (req, res) => {
    db.all(`SELECT * FROM student_course sc
JOIN student s
ON s.student_id = sc.student_id
JOIN course_section cs
ON cs.course_section_id = sc.course_section_id
JOIN course c
ON cs.course_id = c.course_id`, [], (err, rows) => res.json(rows));
});

app.delete('/enrollments/:student_id/:course_section_id', (req, res) => {
    db.run('DELETE FROM student_course WHERE student_id = ? AND course_section_id = ?', [req.params.student_id, req.params.course_section_id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ deleted: this.changes });
    });
})

app.put('/enrollments/:student_id/:course_section_id', (req, res) => {
    const {quiz_grade_1, quiz_grade_2, project_grade_1, project_grade_2, final_exam_grade} = req.body;
    db.run('UPDATE student_course SET quiz_grade_1 = ?, quiz_grade_2 = ?, project_grade_1 = ?, project_grade_2 = ?, final_exam_grade = ? WHERE student_id = ? AND course_section_id = ?',
        [quiz_grade_1, quiz_grade_2, project_grade_1, project_grade_2, final_exam_grade, req.params.student_id, req.params.course_section_id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({id: this.lastID});
        });
});

app.post('/enrollments', (req, res) => {
    const {student_id, course_section_id} = req.body;
    db.run(`INSERT INTO student_course (student_id, course_section_id) VALUES (?, ?)`,
        [student_id, course_section_id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({id: this.lastID});
        });
});

app.listen(5000, () => console.log('Backend running on port 5000'));
