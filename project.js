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
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  if (togglePassword && passwordInput) {
    const eye = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#888" stroke-width="2" d="M3 3l18 18M10.7 6.3A9.77 9.77 0 0 1 12 5c7 0 11 7 11 7a19.6 19.6 0 0 1-5.1 5.9M6.1 6.1A19.6 19.6 0 0 0 1 12s4 7 11 7a9.77 9.77 0 0 0 3.7-.7"/><circle cx="12" cy="12" r="3" stroke="#888" stroke-width="2"/></svg>`;
    const eyeOff = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#888" stroke-width="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3" stroke="#888" stroke-width="2"/></svg>`;

    togglePassword.innerHTML = eye;

    togglePassword.onclick = function () {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      togglePassword.innerHTML = type === "password" ? eye : eyeOff;
    };
  }
});

function login() {
  var role = document.getElementById("role").value;
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var students = JSON.parse(localStorage.getItem("students")) || [];

  if (role === "student") {
    var matchedStudent = students.find(
      (student) =>
        student.name === username &&
        (student.password
          ? student.password === password
          : password === "student123"),
    );
    if (matchedStudent) {
      localStorage.setItem("loggedInStudentID", matchedStudent.id);
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
