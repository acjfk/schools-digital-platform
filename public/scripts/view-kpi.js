import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';

const firebaseConfig = {
  apiKey: "AIzaSyCEOKkVAgU_W_O1iozwpBAf6dIqmRHbrmk",
  authDomain: "schools-digital-platform.firebaseapp.com",
  projectId: "schools-digital-platform",
  storageBucket: "schools-digital-platform.appspot.com",
  messagingSenderId: "774968868905",
  appId: "1:774968868905:web:361220738186df28919c38",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const tableBody = document.getElementById('kpiTableBody');

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert('You must be signed in.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const q = query(collection(db, 'kpiAssessments'), orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      tableBody.innerHTML = '<tr><td colspan="6">No submissions yet.</td></tr>';
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${data.email || ''}</td>
        <td>${data.roleDescription || ''}</td>
        <td>${data.activities || ''}</td>
        <td>${data.comments || ''}</td>
        <td>${data.rating || ''}</td>
        <td>${data.submittedAt?.toDate().toLocaleString() || ''}</td>
      `;

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error('Error fetching KPI assessments:', error);
    tableBody.innerHTML = '<tr><td colspan="6">Failed to load data.</td></tr>';
  }
});
