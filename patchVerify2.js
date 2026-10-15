import fs from 'fs';

let content = fs.readFileSync('server/controllers/authController.js', 'utf8');

content = content.replace(
  /user\.verificationToken = undefined; \/\/ Clears the token/g,
  `// We deliberately DO NOT clear user.verificationToken string here so we can find the user if they click the link again and tell them "Your account is already verified." We invalidate it by clearing the expiration instead.`
);

fs.writeFileSync('server/controllers/authController.js', content);
console.log("Updated verifyEmail token invalidation strategy.");
