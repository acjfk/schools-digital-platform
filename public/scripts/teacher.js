// teacher-dashboard.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

import {
  getAuth,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

// ✅ Your Firebase config — adjust if needed
const firebaseConfig = {
  apiKey: "AIzaSyCEOKkVAgU_W_O1iozwpBAf6dIqmRHbrmk",
  authDomain: "schools-digital-platform.firebaseapp.com",
  projectId: "schools-digital-platform",
  storageBucket: "schools-digital-platform.appspot.com",
  messagingSenderId: "774968868905",
  appId: "1:774968868905:web:361220738186df28919c38"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Wait for authentication
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById('teacher-email').textContent = user.email;

    const form = document.getElementById('taskForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const week = document.getElementById('week').value;
      const task = document.getElementById('task').value.trim();
      const term = document.getElementById('term').value;
      const dueDate = document.getElementById('dueDate').value;

      if (!week || !task || !term || !dueDate) {
        alert("Please fill in all fields.");
        return;
      }

      try {
        await addDoc(collection(db, 'tasks'), {
          email: user.email,
          uid: user.uid,
          week,
          term,
          task,
          dueDate,
          submittedAt: serverTimestamp()
        });

        alert("Task submitted successfully!");
        form.reset();
      } catch (error) {
        console.error("Error submitting task: ", error);
        alert("Failed to submit task.");
      }
    });
  } else {
    window.location.href = 'login.html';
  }
});
