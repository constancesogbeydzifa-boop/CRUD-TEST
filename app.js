require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

// Temporary student storage
let students = [];

// CREATE: Register a new student
app.post('/students', (req, res) => {
    const student = {
        id: students.length + 1,
        studentID: `UGS-${students.length + 1}`,
        name: req.body.name,
        email: req.body.email,
        course: req.body.course,
        loginTime: null,
        logoutTime: null,
        status: 'Logged Out'
    };

    students.push(student);

    res.status(201).json({
        message: 'Student registered successfully!',
        profile: student
    });
});


// READ: Get all registered students
app.get('/students', (req, res) => {
    res.status(200).json({
        message: 'Students retrieved successfully!',
        students: students
    });
});


// READ: Get one student by ID
app.get('/students/:id', (req, res) => {
    const student = students.find(s => s.id === Number(req.params.id));

    if (!student) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    res.json(student);
});


// PATCH: Update student details
app.patch('/students/:id', (req, res) => {
    const student = students.find(s => s.id === Number(req.params.id));

    if (!student) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    const { name, email, course } = req.body;

    if (name !== undefined) student.name = name;
    if (email !== undefined) student.email = email;
    if (course !== undefined) student.course = course;

    res.json({
        message: 'Student details updated successfully!',
        student: student
    });
});


// LOGIN: Record student login time
app.post('/students/:id/login', (req, res) => {
    const student = students.find(s => s.id === Number(req.params.id));

    if (!student) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    student.loginTime = new Date().toISOString();
    student.status = 'Logged In';

    res.json({
        message: 'Student logged in successfully!',
        student: student
    });
});


// LOGOUT: Record student logout time
app.post('/students/:id/logout', (req, res) => {
    const student = students.find(s => s.id === Number(req.params.id));

    if (!student) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    student.logoutTime = new Date().toISOString();
    student.status = 'Logged Out';

    res.json({
        message: 'Student logged out successfully!',
        student: student
    });
});


// DELETE: Remove a student
app.delete('/students/:id', (req, res) => {
    const studentIndex = students.findIndex(
        s => s.id === Number(req.params.id)
    );

    if (studentIndex === -1) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    students.splice(studentIndex, 1);

    res.json({
        message: 'Student deleted successfully!'
    });
});


// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});