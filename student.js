document.addEventListener("DOMContentLoaded", function () {
  loadStudentData();
});
async function markAttendance(id, date) {
  await fetch(
    `https://project-student-information-system.onrender.com/students/${id}/attendance`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    },
  );
  loadStudentData(id);
}

async function loadStudentData() {
  const studentId = localStorage.getItem("loggedInStudentID");
  const res = await fetch(
    `https://your-app.onrender.com/students/${studentId}`,
  );
  const student = await res.json();

  document.getElementById("studentName").innerText = student.name;
  document.getElementById("studentID").innerText = student.id;
  document.getElementById("studentCourse").innerText = student.course;
  document.getElementById("studentEmail").innerText = student.email || "N/A";
  document.getElementById("studentContact").innerText =
    student.contact || "N/A";

  const gradeTable = document.getElementById("gradeTable");
  gradeTable.innerHTML = `
    <tr><th>Course</th><th>Grade</th></tr>
    <tr><td>${student.course}</td><td>${student.grade || "Pending"}</td></tr>
  `;

  const attendanceTable = document.getElementById("attendanceTable");
  attendanceTable.innerHTML = `
    <tr><th>Date</th><th>Status</th></tr>
  `;
  if (student.attendance && student.attendance.length > 0) {
    student.attendance.forEach((date) => {
      attendanceTable.innerHTML += `
        <tr><td>${date}</td><td><span class="attendance-present">Present</span></td></tr>
      `;
    });
  } else {
    attendanceTable.innerHTML += `<tr><td colspan="2">No attendance records yet.</td></tr>`;
  }
}

function logout() {
  localStorage.removeItem("loggedInStudentID");
  window.location.href = "/PROJECT-Student-Information-System/index.html";
}
