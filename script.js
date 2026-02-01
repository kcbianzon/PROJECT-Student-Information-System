// script.js
fetch("https://project-student-information-system.onrender.com")
  .then((res) => res.json())
  .then((data) => {
    const list = document.getElementById("items");
    data.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.name;
      list.appendChild(li);
    });
  })
  .catch((err) => console.error("Error fetching items:", err));
