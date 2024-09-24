const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studentDB', {
useNewUrlParser: true,
useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection error', err));

// Student Schema
const studentSchema = new mongoose.Schema({
firstName: String,
lastName: String,
course: String,
year: {
    type: String,
    enum: ['First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Fifth Year'],
},
enrolled: Boolean,
});

const Student = mongoose.model('Student', studentSchema);

// CRUD Routes

// Create Student
app.post('/students', async (req, res) => {
try {
    const student = new Student(req.body);
    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
} catch (err) {
    res.status(400).json({ error: err.message });
}
});

// Read all Students
app.get('/students', async (req, res) => {
try {
    const students = await Student.find();
    res.status(200).json(students);
} catch (err) {
    res.status(400).json({ error: err.message });
}
});

// Read Single Student
app.get('/students/:id', async (req, res) => {
try {
    const student = await Student.findById(req.params.id);
    if (!student) {
    return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json(student);
} catch (err) {
    res.status(400).json({ error: err.message });
}
});

// Update Student
app.put('/students/:id', async (req, res) => {
try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) {
    return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json(student);
} catch (err) {
    res.status(400).json({ error: err.message });
}
});

// Delete Student
app.delete('/students/:id', async (req, res) => {
try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
    return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted' });
} catch (err) {
    res.status(400).json({ error: err.message });
}
});

// Start server
app.listen(port, () => {
console.log(`Server running on port ${port}`);
});
