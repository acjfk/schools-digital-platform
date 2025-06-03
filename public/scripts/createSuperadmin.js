const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const superadminData = {
  uid: 'superadmin',
  email: 'superadmin@example.com',
  role: 'superadmin',
  schoolId: 'ALL',
  schoolType: 'all'
};

async function ensureSuperadminExists() {
  try {
    const snapshot = await db.collection('users')
      .where('role', '==', 'superadmin')
      .get();

    if (!snapshot.empty) {
      console.log('✅ Superadmin already exists.');
      snapshot.forEach(doc => {
        console.log(`ID: ${doc.id}`);
        console.log(doc.data());
      });
      return;
    }

    const newDoc = await db.collection('users').add(superadminData);
    console.log('✅ Superadmin created with ID:', newDoc.id);

  } catch (error) {
    console.error('❌ Error checking or creating superadmin:', error);
  }
}

ensureSuperadminExists();
