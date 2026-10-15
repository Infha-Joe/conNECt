const fs = require('fs');

let code = fs.readFileSync('client/src/main.jsx', 'utf8');

const importStatement = `import { BadgeProvider } from "./context/BadgeContext.jsx";`;
code = code.replace('import { AuthProvider } from "./context/AuthContext.jsx";', 'import { AuthProvider } from "./context/AuthContext.jsx";\n' + importStatement);

code = code.replace('<App />', '<BadgeProvider>\n            <App />\n          </BadgeProvider>');

fs.writeFileSync('client/src/main.jsx', code);
console.log("Updated main.jsx with BadgeProvider");
