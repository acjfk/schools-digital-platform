const fs = require("fs");
const path = require("path");

const htmlDir = path.join(__dirname, "../public");
const scriptsDir = path.join(__dirname, "../public/scripts");

// Always include this base Firebase config
const coreScript = "scripts/firebase-config.js";

// Scan each HTML file and inject Firebase + matching script
function injectScripts(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const originalContent = content;
  const fileName = path.basename(filePath, ".html");
  const lowerContent = content.toLowerCase();

  let injected = false;

  // Inject firebase-config.js if missing
  if (!lowerContent.includes(coreScript.toLowerCase())) {
    const tag = `\n<script type="module" src="${coreScript}"></script>`;
    content = content.replace(/<\/body>/i, tag + "\n</body>");
    injected = true;
  }

  // Auto-match to a script with the same name (if it exists)
  const candidateScript = `scripts/${fileName}.js`;
  const fullScriptPath = path.join(scriptsDir, `${fileName}.js`);

  if (fs.existsSync(fullScriptPath) && !lowerContent.includes(candidateScript.toLowerCase())) {
    const tag = `\n<script type="module" src="${candidateScript}"></script>`;
    content = content.replace(/<\/body>/i, tag + "\n</body>");
    injected = true;
  }

  // Write only if something was injected
  if (injected && content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Updated: ${filePath}`);
  } else {
    console.log(`✔️ Already OK: ${filePath}`);
  }
}

// Recursively walk HTML files
function fixHtmlFiles(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      fixHtmlFiles(fullPath);
    } else if (file.endsWith(".html")) {
      injectScripts(fullPath);
    }
  });
}

fixHtmlFiles(htmlDir);
