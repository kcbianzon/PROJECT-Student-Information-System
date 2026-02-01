/** GOAL!!!!!!!
 Student dashboard
 * loads and displays student data.
 * modal for viewing schedules.
 * provides logout .
 * edits prodfile
 * data is retrieved from local storage so that it displays the necessary data coming from the admin dashboard stored in the local storage.
 */
document.addEventListener("DOMContentLoaded", function () {
  loadStudentData();

  // Schedule
  const openScheduleBtn = document.getElementById("openScheduleModal");
  const scheduleModal = document.getElementById("scheduleModal");
  const closeScheduleBtn = document.getElementById("closeScheduleModal");
  const modalTable = document.getElementById("modalScheduleTable");

  if (openScheduleBtn && scheduleModal && closeScheduleBtn && modalTable) {
    openScheduleBtn.onclick = function () {
      console.log("Schedule modal open clicked");
      modalTable.innerHTML = `
        <tr>
          <th>Day</th>
          <th>Time</th>
          <th>Subject</th>
        </tr>
      `;
      var students = JSON.parse(localStorage.getItem("students")) || [];
      var loggedInStudentID = localStorage.getItem("loggedInStudentID");
      var loggedInStudent = students.find(
        (student) => student.id === loggedInStudentID,
      );
      var scheduleArr = loggedInStudent.schedule || [];
      if (scheduleArr.length === 0) {
        modalTable.innerHTML += `<tr><td colspan="3">No schedule available.</td></tr>`;
      } else {
        scheduleArr.forEach((item) => {
          modalTable.innerHTML += `<tr>
            <td>${item.day}</td>
            <td>${item.time}</td>
            <td>${item.subject}</td>
          </tr>`;
        });
      }
      scheduleModal.style.display = "block";
    };
    closeScheduleBtn.onclick = function () {
      scheduleModal.style.display = "none";
    };
  }

  const openProfileBtn = document.getElementById("openProfileModal");
  const profileModal = document.getElementById("profileModal");
  const closeProfileBtn = document.getElementById("closeProfileModal");
  const profileForm = document.getElementById("profileForm");
  const editProfilePic = document.getElementById("editProfilePic");

  if (openProfileBtn && profileModal && closeProfileBtn && profileForm) {
    openProfileBtn.onclick = function () {
      console.log("Profile modal open clicked");
      var students = JSON.parse(localStorage.getItem("students")) || [];
      var loggedInStudentID = localStorage.getItem("loggedInStudentID");
      var loggedInStudent = students.find(
        (student) => student.id === loggedInStudentID,
      );
      document.getElementById("editEmail").value = loggedInStudent.email || "";
      document.getElementById("editContact").value =
        loggedInStudent.contact || "";
      // Reset file input
      if (editProfilePic) editProfilePic.value = "";
      profileModal.style.display = "block";
    };
    closeProfileBtn.onclick = function () {
      profileModal.style.display = "none";
    };
    profileForm.onsubmit = function (e) {
      e.preventDefault();
      var students = JSON.parse(localStorage.getItem("students")) || [];
      var loggedInStudentID = localStorage.getItem("loggedInStudentID");
      var loggedInStudent = students.find(
        (student) => student.id === loggedInStudentID,
      );
      loggedInStudent.email = document.getElementById("editEmail").value.trim();
      loggedInStudent.contact = document
        .getElementById("editContact")
        .value.trim();
      var newPass = document.getElementById("editPassword").value.trim();
      if (newPass) {
        loggedInStudent.password = newPass;
      }
      // Handle profile picture upload
      if (editProfilePic && editProfilePic.files && editProfilePic.files[0]) {
        var reader = new FileReader();
        reader.onload = function (evt) {
          loggedInStudent.profilePic = evt.target.result;
          localStorage.setItem("students", JSON.stringify(students));
          alert("Profile updated!");
          profileModal.style.display = "none";
          loadStudentData();
        };
        reader.readAsDataURL(editProfilePic.files[0]);
        return; // Prevent double save
      }
      localStorage.setItem("students", JSON.stringify(students));
      alert("Profile updated!");
      profileModal.style.display = "none";
      loadStudentData();
    };
  }

  window.onclick = function (event) {
    const scheduleModal = document.getElementById("scheduleModal");
    const profileModal = document.getElementById("profileModal");
    if (event.target === scheduleModal) scheduleModal.style.display = "none";
    if (event.target === profileModal) profileModal.style.display = "none";
  };

  var idInput = document.getElementById("modalStudentID");
  var contactInput = document.getElementById("modalStudentContact");
  if (idInput) allowOnlyNumbers(idInput);
  if (contactInput) allowOnlyNumbers(contactInput);

  var editContact = document.getElementById("editContact");
  if (editContact) allowOnlyNumbers(editContact);
});

function loadStudentData() {
  var studentName = document.getElementById("studentName");
  var studentID = document.getElementById("studentID");
  var studentCourse = document.getElementById("studentCourse");
  var gradeTable = document.getElementById("gradeTable");
  var studentEmail = document.getElementById("studentEmail");
  var studentContact = document.getElementById("studentContact");
  var attendanceList = document.getElementById("attendanceList");
  var attendanceTable = document.getElementById("attendanceTable");
  var studentProfilePic = document.getElementById("studentProfilePic");
  var students = JSON.parse(localStorage.getItem("students")) || [];
  var loggedInStudentID = localStorage.getItem("loggedInStudentID");

  var loggedInStudent = students.find(
    (student) => student.id === loggedInStudentID,
  );

  if (loggedInStudent) {
    studentName.innerText = loggedInStudent.name;
    studentID.innerText = loggedInStudent.id;
    studentCourse.innerText = loggedInStudent.course;
    studentEmail.innerText = loggedInStudent.email || "N/A";
    studentContact.innerText = loggedInStudent.contact || "N/A";
    if (studentProfilePic) {
      if (loggedInStudent.profilePic) {
        studentProfilePic.src = loggedInStudent.profilePic;
      } else {
        studentProfilePic.src =
          "https://ui-avatars.com/api/?name=" +
          encodeURIComponent(loggedInStudent.name || "Student");
      }
    }

    // Grades
    gradeTable.innerHTML = `
      <tr>
        <th>Course</th>
        <th>Grade</th>
      </tr>
      <tr>
        <td>${loggedInStudent.course}</td>
        <td>${loggedInStudent.grade || "Pending"}</td>
      </tr>
    `;

    // Attendance
    attendanceTable.innerHTML = `
      <tr>
        <th>Date</th>
        <th>Status</th>
      </tr>
    `;
    if (loggedInStudent.attendance && loggedInStudent.attendance.length > 0) {
      loggedInStudent.attendance.forEach((date) => {
        attendanceTable.innerHTML += `
          <tr>
            <td>${date}</td>
            <td><span class="attendance-present">Present</span></td>
          </tr>
        `;
      });
    } else {
      attendanceTable.innerHTML += `
        <tr>
          <td colspan="2">No attendance records yet.</td>
        </tr>
      `;
    }
  }
}

function logout() {
  localStorage.removeItem("loggedInStudentID");
  window.location.href = "/PROJECT-Student-Information-System/index.html";
}

function allowOnlyNumbers(input) {
  input.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 12);
  });
}
