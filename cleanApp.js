const fs = require('fs');
let code = fs.readFileSync('client/src/App.jsx', 'utf8');

// Remove import Explore from "./pages/Explore";
code = code.replace(/import Explore from "\.\/pages\/Explore";\n/, '');

// Remove Route
code = code.replace(/\s*<Route\s*path="\/explore"\s*element=\{\s*<ProtectedRoute>\s*<Explore \/>\s*<\/ProtectedRoute>\s*\}\s*\/>/, '');

fs.writeFileSync('client/src/App.jsx', code);
console.log("Removed Explore from App.jsx");
