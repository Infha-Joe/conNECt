const fs = require('fs');

let code = fs.readFileSync('client/src/App.jsx', 'utf8');

const imports = `import Network from "./pages/Network";
import Messages from "./pages/Messages";`;
code = code.replace('import Explore from "./pages/Explore";', 'import Explore from "./pages/Explore";\n' + imports);

const routes = `<Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />`;

code = code.replace('<Route path="*" element={<Navigate to="/login" replace />} />', 
  routes + '\n      <Route path="*" element={<Navigate to="/login" replace />} />');

fs.writeFileSync('client/src/App.jsx', code);
console.log("Injected before wildcard route");
