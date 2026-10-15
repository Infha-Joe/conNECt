import fs from 'fs';

let content = fs.readFileSync('server/controllers/authController.js', 'utf8');

// Update register function token generation
content = content.replace(
  /const verificationToken = crypto\.randomBytes\(32\)\.toString\("hex"\);\s*userPayload\.verificationToken = verificationToken;/g,
  `const rawToken = crypto.randomBytes(32).toString("hex");\n    // We append the _id later after creation, or generate the _id now? Wait, User.create doesn't have _id yet.`
);
