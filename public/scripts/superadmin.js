// scripts/superadmin-dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, getDocs, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ Firebase Config (update these values with your actual config)
const firebaseConfig = {
apiKey: "AIzaSyCEOKkVAgU_W_O1iozwpBAf6dIqmRHbrmk",
  authDomain: "schools-digital-platform.firebaseapp.com",
  projectId: "schools-digital-platform",
  storageBucket: "schools-digital-platform.firebasestorage.app",
  messagingSenderId: "774968868905",
  appId: "1:774968868905:web:361220738186df28919c38",
  measurementId: "G-FHZG5M1YS5"
};

// ✅ Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🔒 Only allow superadmins
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadUsers();
    loadSchools();
  }
});

// 🔄 Load All Users
async function loadUsers() {
  const userList = document.getElementById('userList');
  userList.innerHTML = "<li>Loading users...</li>";

  try {
    const snapshot = await getDocs(collection(db, "users"));
    userList.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement("li");
      li.textContent = `${data.email} (${data.role}, ${data.schoolID}, ${data.schoolType})`;
      userList.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading users:", error);
    userList.innerHTML = "<li>Error loading users.</li>";
  }
}

// 🔄 Load All Schools
async function loadSchools() {
  const schoolList = document.getElementById('schoolList');
  schoolList.innerHTML = "<li>Loading schools...</li>";

  try {
    const snapshot = await getDocs(collection(db, "schools"));
    schoolList.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const li = document.createElement("li");
      li.textContent = `${data.schoolName} (ID: ${doc.id}, Type: ${data.schoolType})`;
      schoolList.appendChild(li);
    });
  } catch (error) {
    console.error("Error loading schools:", error);
    schoolList.innerHTML = "<li>Error loading schools.</li>";
  }
}

// ➕ Add New User Form
document.getElementById("addUserForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("newEmail").value.trim();
  const role = document.getElementById("newRole").value.trim().toLowerCase();
  const schoolID = document.getElementById("schoolId").value.trim();
  const schoolType = document.getElementById("schoolType").value.trim().toLowerCase();

  if (!email || !role || !schoolID || !schoolType) {
    alert("Please fill out all fields.");
    return;
  }

  try {
    await addDoc(collection(db, "invites"), {
      email,
      role,
      schoolID,
      schoolType,
      createdAt: serverTimestamp(),
      invitedBy: auth.currentUser.email
    });

    alert("Invite created successfully!");
    document.getElementById("addUserForm").reset();
  } catch (error) {
    console.error("Error adding invite:", error);
    alert("Error sending invite.");
  }
});
