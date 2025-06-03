import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const form = document.getElementById("addUserForm");
const button = form.querySelector("button");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  button.disabled = true;

  const email = form.newEmail.value.trim();
  const role = form.newRole.value;
  const schoolId = form.schoolId.value.trim();
  const schoolType = form.schoolType.value.trim();

  try {
    // Create user in Firebase Auth with temporary password
    const tempPassword = "TempPass123"; // Or generate securely

    const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
    const uid = userCredential.user.uid;

    // Save additional info in Firestore
    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      role,
      schoolId,
      schoolType,
      createdAt: new Date().toISOString()
    });

    alert(`User ${email} added successfully! Temporary password: ${tempPassword}`);
    form.reset();
  } catch (error) {
    alert(`Error adding user: ${error.message}`);
  } finally {
    button.disabled = false;
  }
});
