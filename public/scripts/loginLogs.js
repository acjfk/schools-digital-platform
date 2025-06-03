// loginLogs.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

async function getIpAddress() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  } catch {
    return "Unknown";
  }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const schoolType = document.getElementById('schoolType').value;
  const schoolID = document.getElementById('schoolID').value.trim();
  const loginMessage = document.getElementById('loginMessage');

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    await logLogin(email, schoolType, schoolID, 'success', null);

    loginMessage.style.color = 'green';
    loginMessage.textContent = 'Login successful! Redirecting...';

    if (schoolType === 'high') {
      window.location.href = '/high-dashboard.html';
    } else if (schoolType === 'primary') {
      window.location.href = '/primary-dashboard.html';
    } else {
      window.location.href = '/dashboard.html';
    }

  } catch (error) {
    const errorMsg = error.message;
    await logLogin(email, schoolType, schoolID, 'failed', errorMsg);

    loginMessage.style.color = 'red';
    loginMessage.textContent = `Login failed: ${errorMsg}`;
  }
});

async function logLogin(email, schoolType, schoolID, result, errorMessage) {
  try {
    await addDoc(collection(db, "loginLogs"), {
      email,
      schoolType,
      schoolID,
      result,
      error: errorMessage || null,
      timestamp: serverTimestamp(),
      referrer: document.referrer,
      ip: await getIpAddress()
    });
  } catch (err) {
    console.error("Logging to Firestore failed", err);
  }
}
