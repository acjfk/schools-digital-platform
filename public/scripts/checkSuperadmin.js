const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Make sure this file exists

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function findSuperadminUser() {
  try {
    const snapshot = await db.collection('users')
      .where('role', '==', 'superadmin')
      .get();

    if (snapshot.empty) {
      console.log('No superadmin users found.');
      return;
    }

    console.log('✅ Superadmin user(s) found:\n');
    snapshot.forEach(doc => {
      console.log(`🆔 ID: ${doc.id}`);
      console.log(doc.data());
      console.log('---');
    });
  } catch (error) {
    console.error('❌ Error querying superadmin user:', error);
  }
}

findSuperadminUser();
