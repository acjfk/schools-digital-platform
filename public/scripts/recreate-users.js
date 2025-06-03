const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const users = [
  { uid: "superadmin_uid", email: "superadmin@example.com", password: "password123", role: "superadmin", schoolID: "All Schools" },
  { uid: "principal_uid", email: "principal@high.edu", password: "password123", role: "principal", schoolID: "High School" },
  { uid: "adminhs_uid", email: "adminhs@high.edu", password: "password123", role: "school-admin-hs", schoolID: "High School" },
  { uid: "hod_uid", email: "hod@high.edu", password: "password123", role: "hod", schoolID: "High School" },
  { uid: "teacherhs_uid", email: "teacher@high.edu", password: "password123", role: "teacher", schoolID: "High School" },
  { uid: "headteacher_uid", email: "headteacher@primary.edu", password: "password123", role: "headteacher", schoolID: "Primary School" },
  { uid: "adminps_uid", email: "adminps@primary.edu", password: "password123", role: "school-admin-ps", schoolID: "Primary School" },
  { uid: "teacherps_uid", email: "teacher@primary.edu", password: "password123", role: "teacher", schoolID: "Primary School" }
];

async function recreateUsers() {
  for (const user of users) {
    try {
      const userRecord = await admin.auth().createUser({
        uid: user.uid,
        email: user.email,
        password: user.password
      });

      console.log(`✅ Auth created: ${user.email}`);

      const userDoc = {
        uid: user.uid,
        email: user.email,
        role: user.role,
        schoolID: user.schoolID
      };

      await db.collection("users").doc(user.uid).set(userDoc);
      console.log(`📄 Firestore user created: ${user.email}`);
    } catch (err) {
      if (err.code === "auth/email-already-exists" || err.message.includes("already exists")) {
        console.log(`⚠️ Skipped existing user: ${user.email}`);
      } else {
        console.error(`❌ Error for ${user.email}:`, err.message);
      }
    }
  }
}

recreateUsers();
