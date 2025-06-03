import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase instances
const auth = getAuth();
const db = getFirestore();

// Form and message element
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

    // Fetch Firestore user profile
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      loginMessage.textContent = "❌ User exists in Auth but not in Firestore.";
      loginMessage.style.color = "red";
      return;
    }

    const userData = userSnap.data();
    const role = userData.role || "unknown";
    const schoolID = userData.schoolID || "unknown";

    // ✅ Log login success
    await setDoc(doc(db, "loginLogs", `${uid}_${Date.now()}`), {
      uid,
      email,
      role,
      schoolID,
      timestamp: serverTimestamp(),
      status: "Success"
    });

    // ✅ Redirect based on role
    redirectToDashboard(role);

  } catch (error) {
    console.error("Login error:", error.message);
    loginMessage.textContent = `❌ Error: ${error.message}`;
    loginMessage.style.color = "red";

    // ❌ Log failed login
    await setDoc(doc(db, "loginLogs", `fail_${Date.now()}`), {
      email,
      timestamp: serverTimestamp(),
      status: "Failed",
      error: error.message
    });
  }
});

const redirectToDashboard = (role) => {
  const roleRedirects = {
    superadmin: "/superadmin-dashboard.html",
    principal: "/principal-dashboard.html",
    "school-admin-ps": "/adminps-dashboard.html",
    "school-admin-hs": "/adminhs-dashboard.html",
    headteacher: "/headteacher-dashboard.html",
    hod: "/hod-dashboard
