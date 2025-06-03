const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

const superadminEmail = 'superadmin@example.com';
const defaultPassword = 'password123';

async function ensureSuperadminAuthUser() {
  try {
    // Try to get user by email
    const userRecord = await auth.getUserByEmail(superadminEmail);
    console.log('✅ Superadmin Auth user already exists:');
    console.log(`UID: ${userRecord.uid}`);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      // Create the user
      const newUser = await auth.createUser({
        email: superadminEmail,
        password: defaultPassword,
        displayName: 'Super Admin',
      });

      console.log('✅ Superadmin Auth user created:');
      console.log(`UID: ${newUser.uid}`);
    } else {
      console.error('❌ Error checking/creating auth user:', error);
    }
  }
}

ensureSuperadminAuthUser();
