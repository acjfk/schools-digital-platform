import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';

const firebaseConfig = {
  apiKey: "AIzaSyCEOKkVAgU_W_O1iozwpBAf6dIqmRHbrmk",
  authDomain: "schools-digital-platform.firebaseapp.com",
  projectId: "schools-digital-platform",
  storageBucket: "schools-digital-platform.firebasestorage.app",
  messagingSenderId: "774968868905",
  appId: "1:774968868905:web:361220738186df28919c38",
  measurementId: "G-FHZG5M1YS5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const teacherList = document.getElementById('teacherList');

const fetchHighTeachers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.role === 'teacher' && data.schoolType === 'high') {
      const li = document.createElement('li');
      li.textContent = `${data.email} - ${data.schoolId}`;
      teacherList.appendChild(li);
    }
  });
};

fetchHighTeachers();
