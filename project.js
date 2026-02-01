document.addEventListener("DOMContentLoaded", function () {
  const studentBtn = document.getElementById("studentBtn");
  const facultyBtn = document.getElementById("facultyBtn");
  const loginForm = document.getElementById("loginForm");
  const roleInput = document.getElementById("role");
  const roleSelect = document.getElementById("role-select");

  studentBtn.onclick = function () {
    roleInput.value = "student";
    loginForm.style.display = "block";
    roleSelect.style.display = "none";
  };
  facultyBtn.onclick = function () {
    roleInput.value = "faculty";
    loginForm.style.display = "block";
    roleSelect.style.display = "none";
  };

  loginForm.onsubmit = function (e) {
    e.preventDefault();
    login();
  };
});

async function login() {
  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (role === "student") {
    const res = await fetch(
      "https://project-student-information-system.onrender.com/students/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      },
    );

    if (res.ok) {
      const student = await res.json();
      // Save student ID for student.js to use
      localStorage.setItem("loggedInStudentID", student._id);
      window.location.href = "student.html";
      return;
    }
  } else if (role === "faculty") {
    if (username === "admin" && password === "admin123") {
      window.location.href = "admin.html";
      return;
    }
  }
  alert("Invalid credentials!");
}

alert(
  "Welcome to the Student Information System! Please log in to faculty to setup student, username: admin, password: admin123. For student login, use any enrolled student credentials or default password student123 if none set.",
);
