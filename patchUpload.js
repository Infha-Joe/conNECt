import fs from 'fs';
let content = fs.readFileSync('server/server.js', 'utf8');

if (!content.includes('uploadRoutes')) {
  content = content.replace(
    'import userRoutes from "./routes/userRoutes.js";',
    'import userRoutes from "./routes/userRoutes.js";\nimport uploadRoutes from "./routes/uploadRoutes.js";'
  );
  content = content.replace(
    'app.use("/api/users", userRoutes);',
    'app.use("/api/users", userRoutes);\napp.use("/api/upload", uploadRoutes);'
  );
  fs.writeFileSync('server/server.js', content);
  console.log("Added uploadRoutes to server.js");
} else {
  console.log("uploadRoutes already exists in server.js");
}
