// seed-firestore-users.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const users = [
  {
    email: "superadmin@example.com",
    role: "superadmin",
    schoolId: "ALL",
    schoolType: "both"
  },
  {
    email: "principal@high.edu",
    role: "principal",
    schoolId: "HS001",
    schoolType: "high"
  },
  {
    email: "adminhs@high.edu",
    role: "school-admin-hs",
    schoolId: "HS001",
    schoolType: "high"
  },
  {
    email: "hod@high.edu",
    role: "hod",
    schoolId: "HS001",
    schoolType: "high"
  },
  {
    email: "teacher@high.edu",
    role: "teacher",
    schoolId: "HS001",
    schoolType: "high"
  },
  {
    email: "headteacher@primary.edu",
    role: "headteacher",
    schoolId: "PS001",
    schoolType: "primary"
  },
  {
    email: "adminps@primary.edu",
    role: "school-admin-ps",
    schoolId: "PS001",
    schoolType: "primary"
  },
  {
    email: "teacher@primary.edu",
    role: "teacher",
    schoolId: "PS001",
    schoolType: "primary"
  },
];

async function seedUsers() {
  for (const user of users) {
    try {
      const userRecord = await admin.auth().getUserByEmail(user.email);
      const docRef = db.collection("users").doc(userRecord.uid);

      await docRef.set({
        uid: userRecord.uid,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        schoolType: user.schoolType,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Firestore profile created: ${user.email}`);
    } catch (error) {
      console.error(`❌ Failed for ${user.email}: ${error.message}`);
    }
  }

  console.log("🎉 All user documents seeded to Firestore.");
}

seedUsers();
