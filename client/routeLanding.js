import fs from 'fs';

let content = fs.readFileSync('src/App.jsx', 'utf8');

// Import Landing
content = content.replace(
  'import Login from "./pages/Login";',
  'import Landing from "./pages/Landing";\nimport Login from "./pages/Login";'
);

// Route / to Landing
content = content.replace(
  '<Route path="/" element={<Navigate to="/login" replace />} />',
  '<Route path="/" element={<Landing />} />'
);

fs.writeFileSync('src/App.jsx', content);
