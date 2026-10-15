import fs from 'fs';
let content = fs.readFileSync('server/server.js', 'utf8');
content = content.replace(
  "import path from 'path';\nimport { fileURLToPath } from 'url';\nconst __filename2 = fileURLToPath(import.meta.url);\nconst __dirname2 = path.dirname(__filename2);\napp.use('/uploads', express.static(path.join(__dirname2, 'uploads')));\n\napp.use(errorHandler);",
  "import { fileURLToPath } from 'url';\nconst __filename2 = fileURLToPath(import.meta.url);\nconst __dirname2 = path.dirname(__filename2);\napp.use('/uploads', express.static(path.join(__dirname2, 'uploads')));\n\napp.use(errorHandler);"
);
fs.writeFileSync('server/server.js', content);
