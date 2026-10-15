const fs = require('fs');
let code = fs.readFileSync('client/src/App.jsx', 'utf8');

if (!code.includes('<Route path="/verify-email" element=')) {
  code = code.replace(
    '<Route path="/verify-email/:token" element={<DebugErrorBoundary><VerifyEmail /></DebugErrorBoundary>} />',
    '<Route path="/verify-email/:token" element={<DebugErrorBoundary><VerifyEmail /></DebugErrorBoundary>} />\n      <Route path="/verify-email" element={<DebugErrorBoundary><VerifyEmail /></DebugErrorBoundary>} />'
  );
  fs.writeFileSync('client/src/App.jsx', code);
  console.log("Updated App.jsx with fallback route");
}
