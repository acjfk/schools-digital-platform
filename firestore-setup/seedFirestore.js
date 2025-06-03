const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seed() {
  const schoolId = "school123";

  // 1. Add a school document
  await db.collection("schools").doc(schoolId).set({
    name: "Sample Primary School",
    type: "primary"
  });

  // 2. Add a sample teacher
  await db.collection("users").doc("teacher1").set({
    role: "teacher",
    schoolId: schoolId,
    email: "teacher1@example.com"
  });

  // 3. Add Headteacher
  await db.collection("users").doc("headUser123").set({
    role: "headteacher",
    schoolId: schoolId,
    email: "head@example.com"
  });

  // 4. Add Principal
  await db.collection("users").doc("principalUser123").set({
    role: "principal",
    schoolId: schoolId,
    email: "principal@example.com"
  });

  // 5. Add Admin (Primary School)
  await db.collection("users").doc("psAdmin123").set({
    role: "ps_admin",
    schoolId: schoolId,
    schoolType: "primary",
    email: "psadmin@example.com"
  });

  // 6. Add Superadmin
  await db.collection("users").doc("superadmin123").set({
    role: "superadmin",
    email: "superadmin@example.com"
  });

  // 7. Sample task
  await db.collection("schools").doc(schoolId).collection("tasks").add({
    submittedBy: "teacher1",
    schoolId: schoolId,
    task: "Submit weekly lesson plan",
    week: 1,
    timestamp: new Date()
  });

  // 8. Sample staff record
  await db.collection("schools").doc(schoolId).collection("staffRecords").add({
    name: "Jane Doe",
    tpf: "TPF123",
    role: "teacher",
    qualification: "B.Ed",
    yearsTeaching: 5,
    age: 30,
    schoolsTaughtAt: 2,
    currentSchool: "Sample Primary School"
  });

  // 9. Sample KPI entry
  await db.collection("schools").doc(schoolId).collection("kpis").add({
    staffId: "teacher1",
    roleDescription: "Class Teacher",
    activities: "Lesson delivery, discipline management",
    ownComment: "Performing duties as required",
    rating: 8
  });

  // 10. Sample invite
  await db.collection("emailInvites").add({
    invitedBy: "superadmin123",
    email: "newteacher@example.com",
    role: "teacher",
    schoolId: schoolId,
    timestamp: new Date()
  });

  // 11. Forgot password request
  await db.collection("forgotPasswordRequests").add({
    email: "teacher1@example.com",
    schoolId: schoolId,
    requestedAt: new Date()
  });

  // 12. Log
  await db.collection("logs").add({
    type: "login",
    user: "teacher1@example.com",
    status: "success",
    timestamp: new Date()
  });

  console.log("✅ Seeding complete.");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
});
