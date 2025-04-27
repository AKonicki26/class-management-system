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

app.get('/courses', (req, res) => {
    db.all('SELECT * FROM course', [], (err, rows) => res.json(rows));
});

app.get('/students', (req, res) => {
    db.all(`SELECT * FROM STUDENT s
join major m 
ON s.major_id = m.major_id`, [], (err, rows) => res.json(rows));
});

app.get('/sections', (req, res) => {
    db.all(`SELECT * FROM course_section cs
JOIN course c 
ON cs.course_id = c.course_id`, [], (err, rows) => res.json(rows));
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

app.listen(5000, () => console.log('Backend running on port 5000'));
