import fs from 'fs';

let content = fs.readFileSync('server/controllers/authController.js', 'utf8');

// Replace both occurrences
content = content.replace(
  /const verificationUrl = `\$\{process\.env\.CLIENT_URL\}\/verify-email\/\$\{verificationToken\}`;/g,
  'const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";\n  const verificationUrl = `${frontendUrl}/verify-email/${verificationToken}`;'
);

fs.writeFileSync('server/controllers/authController.js', content);
console.log("Updated authController to use a robust fallback for the frontend URL.");
