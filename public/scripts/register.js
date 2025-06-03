import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ✅ Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyCEOKkVAgU_W_O1iozwpBAf6dIqmRHbrmk",
  authDomain: "schools-digital-platform.firebaseapp.com",
  projectId: "schools-digital-platform",
  storageBucket: "schools-digital-platform.firebasestorage.app",
  messagingSenderId: "774968868905",
  appId: "1:774968868905:web:361220738186df28919c38",
  measurementId: "G-FHZG5M1YS5"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const schoolType = document.getElementById("schoolType").value;
  const schoolID = document.getElementById("schoolID").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // ✅ Store user info in Firestore
    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      schoolID,
      schoolType,
      role: "pending", // role assigned later by admin or head
      createdAt: new Date().toISOString()
    });

    registerMessage.textContent = "✅ Registration successful! Please login.";
    registerMessage.style.color = "green";
    registerForm.reset();
  } catch (error) {
    registerMessage.textContent = `❌ Error: ${error.message}`;
    registerMessage.style.color = "red";
  }
});
