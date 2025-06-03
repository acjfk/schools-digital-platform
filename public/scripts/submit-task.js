// /public/scripts/submit-task.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Handle form submission
document.getElementById('taskForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const term = document.getElementById('term').value;
  const week = document.getElementById('week').value;
  const description = document.getElementById('description').value;

  // 🧑 Check if user is logged in
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("❌ You are not logged in.");
      return;
    }

    // 🔍 Fetch user data from Firestore
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert("❌ User profile not found.");
        return;
      }

      const { schoolId, schoolType } = userSnap.data();

      // 📥 Save task inside school's task collection
      const taskRef = doc(collection(db, `schools/${schoolId}/tasks`));
      await setDoc(taskRef, {
        submittedBy: user.uid,
        schoolId,
        schoolType,
        term,
        week: Number(week),
        description,
        timestamp: new Date(),
        status: "pending"
      });

      alert("✅ Task submitted successfully!");
      e.target.reset();

    } catch (error) {
      console.error("Error submitting task:", error);
      alert("❌ Failed to submit task.");
    }
  });
});
