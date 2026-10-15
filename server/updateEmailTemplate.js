const fs = require("fs");
let code = fs.readFileSync("server/controllers/authController.js", "utf8");

// Change localhost to a fake domain in the email to avoid spam filters catching localhost links
code = code.replace(
  /const verificationUrl = \`\$\{process\.env\.CLIENT_URL\}\/verify-email\/\$\{verificationToken\}\`;/g,
  'const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;\n    console.log("\\n=== VERIFICATION LINK ===\\n" + verificationUrl + "\\n=========================\\n");'
);

// Simplify the message to avoid spam triggers
code = code.replace(
  /const message = `[\s\S]*?`;/g,
  `const message = \`
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Welcome to conNECt!</h2>
        <p>Hi \${name || user.name},</p>
        <p>Here is your account activation link:</p>
        <p><a href="\${verificationUrl}" style="background: #0f172a; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Activate Account</a></p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser: <br/> \${verificationUrl}</p>
      </div>
    \`;`
);

fs.writeFileSync("server/controllers/authController.js", code);
console.log("Updated authController.js to log the verification link and improve email template to avoid spam.");
