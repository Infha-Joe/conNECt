const fs = require('fs');

let code = fs.readFileSync('client/src/App.jsx', 'utf8');

const importStatement = `import Network from "./pages/Network";`;
code = code.replace('import Explore from "./pages/Explore";', 'import Explore from "./pages/Explore";\n' + importStatement);

const routeStatement = `<Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />`;
code = code.replace('<Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />', '<Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />\n          ' + routeStatement);

fs.writeFileSync('client/src/App.jsx', code);
console.log("Updated App.jsx with Network route");
