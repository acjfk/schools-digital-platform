const fs = require('fs');
const path = require('path');

const publicDir = './public';
const firebaseModules = [
  'firebase-app',
  'firebase-auth',
  'firebase-firestore'
];

function checkHTML(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];

  if (!content.includes('<script type="module"')) {
    errors.push("❌ Missing <script type='module'>");
  }

  // ✅ Accept firebase-config.js as valid Firebase import
  const containsDirectImport = firebaseModules.some(mod => content.includes(mod));
  const includesFirebaseConfig = content.includes("firebase-config.js");

  if (!containsDirectImport && !includesFirebaseConfig) {
    errors.push("❌ Firebase modules not imported");
  }

  return errors;
}

function checkJS(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];

  if (!content.includes('initializeApp')) {
    errors.push("❌ Missing initializeApp()");
  }

  const containsImport = firebaseModules.some(mod => content.includes(mod));
  if (!containsImport && !filePath.includes("firebase-config.js")) {
    errors.push("❌ Missing Firebase module import");
  }

  return errors;
}

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory
      ? walk(dirPath, callback)
      : callback(path.join(dir, f));
  });
}

walk(publicDir, (filePath) => {
  if (filePath.endsWith('.html')) {
    const issues = checkHTML(filePath);
    if (issues.length > 0) {
      console.log(`⚠️ HTML File: ${filePath}`);
      issues.forEach(i => console.log("   → " + i));
    }
  } else if (filePath.endsWith('.js')) {
    const issues = checkJS(filePath);
    if (issues.length > 0) {
      console.log(`⚠️ JS File: ${filePath}`);
      issues.forEach(i => console.log("   → " + i));
    }
  }
});
