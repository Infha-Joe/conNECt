import fs from 'fs';
let content = fs.readFileSync('server/controllers/authController.js', 'utf8');

const freezeComment = `/* =========================================================================
 * ❄️ AUTHENTICATION IS FROZEN ❄️
 * Do not modify authentication files or password/JWT/email-verification logic 
 * while implementing unrelated features.
 * Reuse the existing auth system.
 * ========================================================================= */\n\n`;

if (!content.includes('AUTHENTICATION IS FROZEN')) {
  content = freezeComment + content;
  fs.writeFileSync('server/controllers/authController.js', content);
}

let userModel = fs.readFileSync('server/models/User.js', 'utf8');
if (!userModel.includes('AUTHENTICATION IS FROZEN')) {
  userModel = freezeComment + userModel;
  fs.writeFileSync('server/models/User.js', userModel);
}

let loginJsx = fs.readFileSync('client/src/pages/Login.jsx', 'utf8');
if (!loginJsx.includes('AUTHENTICATION IS FROZEN')) {
  loginJsx = freezeComment + loginJsx;
  fs.writeFileSync('client/src/pages/Login.jsx', loginJsx);
}

let registerJsx = fs.readFileSync('client/src/pages/Register.jsx', 'utf8');
if (!registerJsx.includes('AUTHENTICATION IS FROZEN')) {
  registerJsx = freezeComment + registerJsx;
  fs.writeFileSync('client/src/pages/Register.jsx', registerJsx);
}

let authContext = fs.readFileSync('client/src/context/AuthContext.jsx', 'utf8');
if (!authContext.includes('AUTHENTICATION IS FROZEN')) {
  authContext = freezeComment + authContext;
  fs.writeFileSync('client/src/context/AuthContext.jsx', authContext);
}
console.log("Added frozen comments to all auth files");
