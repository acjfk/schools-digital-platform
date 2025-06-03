// school-head.js
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { app } from "./firebaseConfig.js";

const db = getFirestore(app);
const auth = getAuth(app);

// DOM refs
const taskTable = document.getElementById("taskTable");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    loadTasks(user);
  } else {
    window.location.href = "login.html";
  }
});

async function loadTasks(user) {
  const tasksRef = collection(db, "tasks");
  const snapshot = await getDocs(tasksRef);

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (!data.rating && data.status === "submitted") {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${data.teacherName || data.teacherEmail}</td>
        <td>${data.week}</td>
        <td>${data.task}</td>
        <td>
          <select id="rating-${docSnap.id}">
            ${[...Array(10)].map((_, i) => `<option value="${i+1}">${i+1}</option>`).join('')}
          </select>
        </td>
        <td>
          <button onclick="submitRating('${docSnap.id}')">Submit</button>
        </td>
      `;
      taskTable.appendChild(row);
    }
  });
}

window.submitRating = async function(taskId) {
  const ratingVal = document.getElementById(`rating-${taskId}`).value;
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, {
    rating: parseInt(ratingVal),
    ratedAt: new Date().toISOString(),
    status: "rated"
  });
  alert("Rating submitted");
  location.reload();
}

window.logout = function() {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};
