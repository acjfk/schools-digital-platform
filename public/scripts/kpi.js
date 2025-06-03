import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCEOKkVAgU_W_O1iozwpBAf6dIqmRHbrmk",
  authDomain: "schools-digital-platform.firebaseapp.com",
  projectId: "schools-digital-platform",
  storageBucket: "schools-digital-platform.appspot.com",
  messagingSenderId: "774968868905",
  appId: "1:774968868905:web:361220738186df28919c38",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const kpiForm = document.getElementById('kpiForm');

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert('You must be signed in.');
    window.location.href = 'login.html';
  }

  kpiForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const roleDescription = document.getElementById('roleDescription').value;
    const activities = document.getElementById('activities').value;
    const comments = document.getElementById('comments').value;
    const rating = parseInt(document.getElementById('rating').value);

    try {
      await addDoc(collection(db, 'kpiAssessments'), {
        uid: user.uid,
        email: user.email,
        roleDescription,
        activities,
        comments,
        rating,
        submittedAt: serverTimestamp(),
      });

      alert('KPI submitted successfully!');
      kpiForm.reset();
    } catch (error) {
      console.error('Error submitting KPI:', error);
      alert('Failed to submit KPI.');
    }
  });
});
