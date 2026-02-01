// Run after DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  loadStudents();
  document
    .getElementById("enrollForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      enrollStudent();
    });
});

// Global functions so HTML can call them
function openModal() {
  document.getElementById("enrollModal").style.display = "block";
}

function closeModal() {
  document.getElementById("enrollModal").style.display = "none";
}
function editStudent(id) {
  // Fetch student data
  fetch(
    `https://project-student-information-system.onrender.com/students/${id}`,
  )
    .then((res) => res.json())
    .then((student) => {
      // Fill modal with student data
      document.getElementById("modalStudentName").value = student.name;
      document.getElementById("modalStudentID").value = student.id;
      document.getElementById("modalStudentCourse").value = student.course;
      document.getElementById("modalStudentGrade").value = student.grade;
      document.getElementById("modalStudentEmail").value = student.email;
      document.getElementById("modalStudentContact").value = student.contact;

      // Show modal
      openModal();

      // Override form submit to update instead of create
      document.getElementById("enrollForm").onsubmit = async function (e) {
        e.preventDefault();
        await fetch(
          `https://project-student-information-system.onrender.com/students/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: document.getElementById("modalStudentName").value.trim(),
              id: document.getElementById("modalStudentID").value.trim(),
              course: document
                .getElementById("modalStudentCourse")
                .value.trim(),
              grade: document.getElementById("modalStudentGrade").value.trim(),
              email: document.getElementById("modalStudentEmail").value.trim(),
              contact: document
                .getElementById("modalStudentContact")
                .value.trim(),
            }),
          },
        );
        loadStudents();
        closeModal();
      };
    });
}

async function loadStudents() {
  const res = await fetch(
    "https://project-student-information-system.onrender.com/students",
  );
  const students = await res.json();

  const studentTable = document.getElementById("studentTable");
  studentTable.innerHTML = `
    <tr>
      <th>Name</th><th>ID</th><th>Course</th><th>Grade</th>
      <th>Email</th><th>Contact</th><th>Actions</th>
    </tr>
  `;

  students.forEach((student) => {
    const row = studentTable.insertRow(-1);
    row.insertCell(0).innerText = student.name;
    row.insertCell(1).innerText = student.id;
    row.insertCell(2).innerText = student.course || "None";
    row.insertCell(3).innerText = student.grade || "Pending";
    row.insertCell(4).innerText = student.email || "N/A";
    row.insertCell(5).innerText = student.contact || "N/A";
    row.insertCell(6).innerHTML = `
      <button onclick="editStudent('${student._id}')">Edit</button>
      <button onclick="deleteStudent('${student._id}')" style="background-color:red;">Un-Enroll</button>
    `;
  });
}

async function enrollStudent() {
  const newStudent = {
    name: document.getElementById("modalStudentName").value.trim(),
    id: document.getElementById("modalStudentID").value.trim(),
    course: document.getElementById("modalStudentCourse").value.trim(),
    grade: document.getElementById("modalStudentGrade").value.trim(),
    email: document.getElementById("modalStudentEmail").value.trim(),
    contact: document.getElementById("modalStudentContact").value.trim(),
  };

  const res = await fetch(
    "https://project-student-information-system.onrender.com/students",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent),
    },
  );

  if (res.ok) {
    loadStudents();
    closeModal();
  } else {
    alert("Error enrolling student");
  }
}

async function deleteStudent(id) {
  await fetch(
    `https://project-student-information-system.onrender.com/students/${id}`,
    {
      method: "DELETE",
    },
  );
  loadStudents();
}

function logout() {
  window.location.href = "/PROJECT-Student-Information-System/index.html";
}
