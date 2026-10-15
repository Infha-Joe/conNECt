import fs from 'fs';
let content = fs.readFileSync('client/src/App.jsx', 'utf8');

// Add the import if it's not there
if (!content.includes('import NetworkFeed')) {
  content = content.replace(
    'import Network from "./pages/Network";',
    'import Network from "./pages/Network";\nimport NetworkFeed from "./pages/NetworkFeed";'
  );
}

// Add the route if it's not there
if (!content.includes('path="/network-feed"')) {
  content = content.replace(
    '<Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />',
    '<Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />\n      <Route path="/network-feed" element={<ProtectedRoute><NetworkFeed /></ProtectedRoute>} />'
  );
}

fs.writeFileSync('client/src/App.jsx', content);
console.log("Added /network-feed route safely");
