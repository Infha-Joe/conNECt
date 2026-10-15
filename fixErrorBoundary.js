import fs from 'fs';
let content = fs.readFileSync('client/src/components/DebugErrorBoundary.jsx', 'utf8');
content = content.replace(
  "<h2>VerifyEmail Crashed!</h2>",
  "<h2>A Component Crashed!</h2>"
);
fs.writeFileSync('client/src/components/DebugErrorBoundary.jsx', content);
