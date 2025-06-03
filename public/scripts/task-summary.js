// task-summary.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import {
  getFirestore, collection, query, where, getDocs, orderBy
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

import {
  getAuth, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCEOKkVAgU_W_O1iozwpBAf6dIqmRHbrmk",
  authDomain: "schools-digital-platform.firebaseapp.com",
  projectId: "schools-digital-platform",
  storageBucket: "schools-digital-platform.appspot.com",
  messagingSenderId: "774968868905",
  appId: "1:774968868905:web:361220738186df28919c38"
};

// Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const tableBody = document.querySelector("#taskTable tbody");
const emailDisplay = document.getElementById("teacher-email");
const totalCount = document.getElementById("totalCount");

let allTasks = [];

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "login.html";

  emailDisplay.textContent = user.email;

  const q = query(
    collection(db, "tasks"),
    where("email", "==", user.email),
    orderBy("submittedAt", "desc")
  );

  const snapshot = await getDocs(q);
  allTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  displayTasks(allTasks);

  document.getElementById("termFilter").addEventListener("change", filterTasks);
  document.getElementById("weekFilter").addEventListener("change", filterTasks);
});

function displayTasks(tasks) {
  tableBody.innerHTML = "";
  tasks.forEach(task => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${task.week}</td>
      <td>${task.term}</td>
      <td>${task.task}</td>
      <td>${task.dueDate || '-'}</td>
      <td>${task.submittedAt?.toDate().toLocaleString() || '-'}</td>
      <td>${task.status || 'Pending'}</td>
    `;
    tableBody.appendChild(tr);
  });
  totalCount.textContent = tasks.length;
}

}

function filterTasks() {
  const term = document.getElementById("termFilter").value;
  const week = document.getElementById("weekFilter").value;

  const filtered = allTasks.filter(task =>
    (term === "" || task.term == term) &&
    (week === "" || task.week == week)
  );

  displayTasks(filtered);
}

// Export functions
window.exportToExcel = function () {
  const wb = XLSX.utils.table_to_book(document.getElementById("taskTable"), { sheet: "Tasks" });
  XLSX.writeFile(wb, "task_summary.xlsx");
};

window.exportToPDF = function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Task Summary", 14, 10);
  doc.autoTable({ html: '#taskTable', startY: 20 });
  doc.save("task_summary.pdf");
};
