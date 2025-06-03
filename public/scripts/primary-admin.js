import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase config
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

const teacherList = document.getElementById("primaryTeacherList");

async function loadPrimarySchoolStaff() {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("schoolType", "==", "primary"));

    const snapshot = await getDocs(q);
    teacherList.innerHTML = "";

    if (snapshot.empty) {
      teacherList.innerHTML = "<li>No primary school staff found.</li>";
      return;
    }

    snapshot.forEach(doc => {
      const data = doc.data();
      const { name, email, role, schoolID } = data;

      if (["teacher", "hod", "headteacher"].includes(role)) {
        const li = document.createElement("li");
        li.textContent = `${name || "Unnamed"} (${role}) - ${email} [${schoolID || "No ID"}]`;
        teacherList.appendChild(li);
      }
    });
  } catch (error) {
    console.error("Error loading staff:", error);
    teacherList.innerHTML = "<li>Error loading staff data.</li>";
  }
}

loadPrimarySchoolStaff();
