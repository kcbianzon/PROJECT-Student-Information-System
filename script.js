const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas using environment variable
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Student Schema
const StudentSchema = new mongoose.Schema({
  name: String,
  id: String,
  course: String,
  grade: String,
  email: String,
  contact: String,
  password: String,
  attendance: [String],
  schedule: [
    {
      day: String,
      time: String,
      subject: String,
    },
  ],
  profilePic: String,
});

const Student = mongoose.model("Student", StudentSchema);

//
// ROUTES
//

// 1. Get all students
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// 2. Get a single student by ID
app.get("/students/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });
  res.json(student);
});

// 3. Add a new student
app.post("/students", async (req, res) => {
  const newStudent = new Student(req.body);
  await newStudent.save();
  res.json(newStudent);
});

// 4. Update student info
app.put("/students/:id", async (req, res) => {
  const updatedStudent = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  if (!updatedStudent)
    return res.status(404).json({ error: "Student not found" });
  res.json(updatedStudent);
});

// 5. Delete a student
app.delete("/students/:id", async (req, res) => {
  const deletedStudent = await Student.findByIdAndDelete(req.params.id);
  if (!deletedStudent)
    return res.status(404).json({ error: "Student not found" });
  res.json({ message: "Student deleted successfully" });
});

// 6. Student login
app.post("/students/login", async (req, res) => {
  const { username, password } = req.body;
  const student = await Student.findOne({ name: username });

  if (!student) return res.status(401).json({ error: "Invalid credentials" });

  // If student has a password set, check it; otherwise default to "student123"
  const validPassword = student.password
    ? student.password === password
    : password === "student123";

  if (!validPassword)
    return res.status(401).json({ error: "Invalid credentials" });

  res.json(student);
});

// 7. Mark attendance
app.post("/students/:id/attendance", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });

  const today = new Date().toLocaleDateString();
  if (!student.attendance.includes(today)) {
    student.attendance.push(today);
    await student.save();
    return res.json({ message: "Attendance marked" });
  }
  res.json({ message: "Attendance already marked" });
});

// 8. Update schedule
app.put("/students/:id/schedule", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ error: "Student not found" });

  student.schedule = req.body.schedule;
  await student.save();
  res.json(student);
});

// Server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
