// rating-summary.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCEOKkVAgU_W_O1iozwpBAf6dIqmRHbrmk",
  authDomain: "schools-digital-platform.firebaseapp.com",
  projectId: "schools-digital-platform",
  storageBucket: "schools-digital-platform.appspot.com",
  messagingSenderId: "774968868905",
  appId: "1:774968868905:web:361220738186df28919c38"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const termSelect = document.getElementById("termSelect");
const weekSelect = document.getElementById("weekSelect");
const teacherSelect = document.getElementById("teacherSelect");
const ratingTableBody = document.getElementById("ratingTableBody");
const averageRatingDisplay = document.getElementById("averageRatingDisplay");
const exportBtn = document.getElementById("exportBtn");

onAuthStateChanged(auth, (user) => {
  if (user) {
    loadTeachers();
    loadRatings();
  } else {
    window.location.href = "index.html";
  }
});

termSelect.addEventListener("change", loadRatings);
weekSelect.addEventListener("change", loadRatings);
teacherSelect.addEventListener("change", loadRatings);
exportBtn.addEventListener("click", exportToCSV);

async function loadTeachers() {
  const ratingsSnapshot = await getDocs(collection(db, "ratings"));
  const teacherNames = new Set();
  ratingsSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.teacher) teacherNames.add(data.teacher);
  });

  teacherNames.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    teacherSelect.appendChild(opt);
  });
}

async function loadRatings() {
  const selectedTerm = termSelect.value;
  const selectedWeek = weekSelect.value;
  const selectedTeacher = teacherSelect.value;

  const snapshot = await getDocs(collection(db, "ratings"));
  let total = 0, count = 0;
  ratingTableBody.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    if ((selectedTerm && data.term != selectedTerm) ||
        (selectedWeek && data.week != selectedWeek) ||
        (selectedTeacher && data.teacher != selectedTeacher)) {
      return;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.teacher}</td>
      <td>${data.week}</td>
      <td>${data.term}</td>
      <td>${data.rating}</td>
      <td>${data.comment || ""}</td>
      <td>${new Date(data.timestamp?.seconds * 1000).toLocaleString()}</td>
    `;
    ratingTableBody.appendChild(row);

    if (data.rating) {
      total += parseFloat(data.rating);
      count++;
    }
  });

  averageRatingDisplay.textContent = count > 0 ? `Average Rating: ${(total / count).toFixed(2)}` : "Average Rating: —";
}

function exportToCSV() {
  let csv = "Teacher,Week,Term,Rating,Comment,Rated At\n";
  const rows = ratingTableBody.querySelectorAll("tr");
  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    const rowData = Array.from(cells).map(td => `"${td.textContent}"`).join(",");
    csv += rowData + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "rating-summary.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
