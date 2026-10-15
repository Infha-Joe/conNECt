import fs from 'fs';

let content = fs.readFileSync('server/server.js', 'utf8');

// Add uploadRoutes import
content = content.replace(
  "import userRoutes from './routes/userRoutes.js';",
  "import userRoutes from './routes/userRoutes.js';\nimport uploadRoutes from './routes/uploadRoutes.js';"
);

// Mount uploadRoutes
content = content.replace(
  "app.use('/api/users', userRoutes);",
  "app.use('/api/users', userRoutes);\napp.use('/api/upload', uploadRoutes);"
);

// Serve uploads folder statically
content = content.replace(
  "app.use(errorHandler);",
  "import path from 'path';\nimport { fileURLToPath } from 'url';\nconst __filename2 = fileURLToPath(import.meta.url);\nconst __dirname2 = path.dirname(__filename2);\napp.use('/uploads', express.static(path.join(__dirname2, 'uploads')));\n\napp.use(errorHandler);"
);

fs.writeFileSync('server/server.js', content);
console.log("Updated server.js");
