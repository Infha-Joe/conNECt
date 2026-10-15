const fs = require('fs');

let code = fs.readFileSync('client/src/App.jsx', 'utf8');

const importStatement = `import Messages from "./pages/Messages";`;
code = code.replace('import Network from "./pages/Network";', 'import Network from "./pages/Network";\n' + importStatement);

const routeStatement = `<Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />`;
code = code.replace('<Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />', '<Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />\n          ' + routeStatement);

fs.writeFileSync('client/src/App.jsx', code);
console.log("Updated App.jsx with Messages route");
