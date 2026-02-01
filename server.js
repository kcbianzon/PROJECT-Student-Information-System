const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://ADMIN:1234@kenneth.mc3y14c.mongodb.net/studentDB?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Student schema
const StudentSchema = new mongoose.Schema({
  name: String,
  id: String,
  course: String,
  grade: String,
  email: String,
  contact: String,
  password: String,
  attendance: [String],
  schedule: [{ day: String, time: String, subject: String }],
  profilePic: String,
});

const Student = mongoose.model("Student", StudentSchema);

// Routes
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.post("/students", async (req, res) => {
  const newStudent = new Student(req.body);
  await newStudent.save();
  res.json(newStudent);
});

app.get("/students/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ error: "Not found" });
  res.json(student);
});

app.put("/students/:id", async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

app.delete("/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.post("/students/login", async (req, res) => {
  const { username, password } = req.body;
  const student = await Student.findOne({ name: username });
  if (!student) return res.status(401).json({ error: "Invalid credentials" });

  const validPassword = student.password
    ? student.password === password
    : password === "student123";

  if (!validPassword)
    return res.status(401).json({ error: "Invalid credentials" });
  res.json(student);
});
app.put("/students/:id/attendance", async (req, res) => {
  const student = await Student.findById(req.params.id);
  student.attendance.push(req.body.date);
  await student.save();
  res.json(student);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
