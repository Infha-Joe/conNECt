import fs from 'fs';
let content = fs.readFileSync('client/src/context/AuthContext.jsx', 'utf8');

content = content.replace(
  /loginManual, registerManual/g,
  "login: loginManual, register: registerManual, loginManual, registerManual"
);

fs.writeFileSync('client/src/context/AuthContext.jsx', content);
console.log("Patched AuthContext.jsx to correctly alias login and register functions");
