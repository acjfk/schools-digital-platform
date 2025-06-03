import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// List of users to seed
const users = [
  {
    uid: "superadmin_uid",
    email: "superadmin@example.com",
    role: "superadmin",
    schoolId: "super_school",
    schoolType: "both"
  },
  {
    uid: "principal_uid",
    email: "principal@high.edu",
    role: "principal",
    schoolId: "HS001",
    schoolType: "high"
  },
  {
    uid: "adminhs_uid",
    email: "adminhs@high.edu",
    role: "school_admin_hs",
    schoolId: "HS001",
    schoolType: "high"
  },
  {
    uid: "hod_uid",
    email: "hod@high.edu",
    role: "hod",
    schoolId: "HS001",
    schoolType: "high"
  },
  {
    uid: "teacherhs_uid",
    email: "teacher@high.edu",
    role: "teacher",
    schoolId: "HS001",
    schoolType: "high"
  },
  {
    uid: "headteacher_uid",
    email: "headteacher@primary.edu",
    role: "headteacher",
    schoolId: "PS001",
    schoolType: "primary"
  },
  {
    uid: "adminps_uid",
    email: "adminps@primary.edu",
    role: "school_admin_ps",
    schoolId: "PS001",
    schoolType: "primary"
  },
  {
    uid: "teacherps_uid",
    email: "teacher@primary.edu",
    role: "teacher",
    schoolId: "PS001",
    schoolType: "primary"
  }
];

// Main function
document.getElementById("seedButton").addEventListener("click", () => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("❌ Please log in as Superadmin.");
      return;
    }

    const currentUserRef = doc(db, "users", user.uid);
    const currentUserSnap = await getDoc(currentUserRef);

    if (!currentUserSnap.exists() || currentUserSnap.data().role !== "superadmin") {
      alert("❌ Access denied: You must be Superadmin.");
      return;
    }

    for (const u of users) {
      const userRef = doc(db, "users", u.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        console.log(`✅ Already exists: ${u.email}`);
      } else {
        await setDoc(userRef, {
          email: u.email,
          role: u.role,
          schoolId: u.schoolId,
          schoolType: u.schoolType,
          createdAt: new Date()
        });
        console.log(`🆕 Created: ${u.email}`);
      }
    }

    alert("🎉 Seeding complete. Check Firestore!");
  });
});
