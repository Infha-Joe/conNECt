const fs = require('fs');

let code = fs.readFileSync('client/src/App.jsx', 'utf8');

const imports = `import Network from "./pages/Network";
import Messages from "./pages/Messages";`;
code = code.replace('import Explore from "./pages/Explore";', 'import Explore from "./pages/Explore";\n' + imports);

const routes = `<Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />`;

code = code.replace('<Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />', 
  '<Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />\n      ' + routes);

fs.writeFileSync('client/src/App.jsx', code);
console.log("Updated App.jsx routing cleanly");
