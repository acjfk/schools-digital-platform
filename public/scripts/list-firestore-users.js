const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function listUsers() {
  const snapshot = await db.collection("users").get();
  console.log("📋 Firestore Users (uid -> email, role, schoolID):\n");
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`${data.uid} -> ${data.email}, ${data.role}, ${data.schoolID}`);
  });
}

listUsers();
