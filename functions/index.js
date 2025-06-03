const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.createUser = functions.https.onCall(async (data, context) => {
  const { email, password, role, schoolId, schoolType } = data;

  if (!context.auth || context.auth.token.role !== "superadmin") {
    throw new functions.https.HttpsError("permission-denied", "Only superadmins can create users.");
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    await admin.firestore().collection("users").doc(userRecord.uid).set({
      email,
      role,
      schoolId,
      schoolType,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { uid: userRecord.uid };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});
