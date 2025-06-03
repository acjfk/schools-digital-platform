import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const uid = user.uid;

    // First check in 'users'
    let userSnap = await getDoc(doc(db, "users", uid));
    let userData = null;

    if (userSnap.exists()) {
      userData = userSnap.data();
    } else {
      // Then check in 'systemAdministrators'
      userSnap = await getDoc(doc(db, "systemAdministrators", uid));
      if (userSnap.exists()) {
        userData = userSnap.data();
      } else {
        loginMessage.textContent = "❌ User not found in any collection.";
        loginMessage.style.color = "red";
        return;
      }
    }

    const role = userData.role || "unknown";
    const schoolID = userData.schoolID || "global"; // system users won't have schoolID

    await setDoc(doc(db, "loginLogs", `${uid}_${Date.now()}`), {
      uid,
      email,
      role,
      schoolID,
      timestamp: serverTimestamp(),
      status: "Success"
    });

    switch (role) {
      case "superadmin":
        window.location.href = "/superadmin-dashboard.html";
        break;
      case "principal":
        window.location.href = "/principal-dashboard.html";
        break;
      case "school-admin-ps":
        window.location.href = "/adminps-dashboard.html";
        break;
      case "school-admin-hs":
        window.location.href = "/adminhs-dashboard.html";
        break;
      case "headteacher":
        window.location.href = "/headteacher-dashboard.html";
        break;
      case "hod":
        window.location.href = "/hod-dashboard.html";
        break;
      case "teacher":
        window.location.href = "/teacher-dashboard.html";
        break;
      default:
        alert(`Unrecognized role: ${role}`);
        break;
    }

  } catch (error) {
    console.error("Login error:", error.message);
    loginMessage.textContent = `❌ Error: ${error.message}`;
    loginMessage.style.color = "red";

    await setDoc(doc(db, "loginLogs", `fail_${Date.now()}`), {
      email,
      timestamp: serverTimestamp(),
      status: "Failed",
      error: error.message
    });
  }
});
