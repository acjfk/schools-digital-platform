const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

// Mapping: email -> { role, schoolID }
const userMetadata = {
  "superadmin@example.com": { role: "superadmin", schoolID: "All school" },
  "principal@high.edu": { role: "principal", schoolID: "high001" },
  "adminhs@high.edu": { role: "school-admin-hs", schoolID: "high001" },
  "hod@high.edu": { role: "hod", schoolID: "high001" },
  "teacher@high.edu": { role: "teacher", schoolID: "high001" },
  "headteacher@primary.edu": { role: "headteacher", schoolID: "primary001" },
  "adminps@primary.edu": { role: "school-admin-ps", schoolID: "primary001" },
  "teacher@primary.edu": { role: "teacher", schoolID: "primary001" },
};

async function resetUsersCollection() {
  const usersRef = db.collection("users");

  // 1. Delete existing users
  const snapshot = await usersRef.get();
  const batch = db.batch();
  snapshot.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  console.log("✅ All existing Firestore users deleted.");

  // 2. Add new users based on actual Auth list
  const list = await auth.listUsers(1000);
  for (const user of list.users) {
    const metadata = userMetadata[user.email];
    if (!metadata) {
      console.log(`⚠️ Skipped unknown user: ${user.email}`);
      continue;
    }

    await usersRef.doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      role: metadata.role,
      schoolID: metadata.schoolID,
    });

    console.log(`✅ Added: ${user.email} (${metadata.role})`);
  }

  console.log("🎉 Firestore users recreated successfully.");
}

resetUsersCollection().catch(console.error);
