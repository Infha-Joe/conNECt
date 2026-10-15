const fs = require('fs');

let code = fs.readFileSync('client/src/main.jsx', 'utf8');

const importStatement = `import ErrorBoundary from "./components/ErrorBoundary.jsx";`;
code = code.replace('import { BadgeProvider } from "./context/BadgeContext.jsx";', 'import { BadgeProvider } from "./context/BadgeContext.jsx";\n' + importStatement);

code = code.replace('<App />', '<ErrorBoundary>\n              <App />\n            </ErrorBoundary>');

fs.writeFileSync('client/src/main.jsx', code);
console.log("Updated main.jsx with ErrorBoundary");
