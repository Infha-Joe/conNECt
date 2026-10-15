const fs = require('fs');
let code = fs.readFileSync('server/server.js', 'utf8');

const importToAdd = `import messageRoutes from "./routes/messageRoutes.js";`;
code = code.replace('import roadmapRoutes from "./routes/roadmapRoutes.js";', 'import roadmapRoutes from "./routes/roadmapRoutes.js";\n' + importToAdd);

const routeToAdd = `app.use("/api/messages", messageRoutes);`;
code = code.replace('app.use("/api/roadmaps", roadmapRoutes);', 'app.use("/api/roadmaps", roadmapRoutes);\n' + routeToAdd);

fs.writeFileSync('server/server.js', code);
console.log("Updated server.js");
