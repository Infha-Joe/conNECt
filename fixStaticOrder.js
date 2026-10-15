import fs from 'fs';
let content = fs.readFileSync('server/server.js', 'utf8');

content = content.replace(
  /\/\/ 404 \+ error handling\s*app\.use\(notFound\);\s*app\.use\('\/uploads', express\.static\(path\.join\(__dirname, 'uploads'\)\)\);/,
  `app.use('/uploads', express.static(path.join(__dirname, 'uploads')));\n\n// 404 + error handling\napp.use(notFound);`
);

fs.writeFileSync('server/server.js', content);
console.log("Patched server.js static file order");
