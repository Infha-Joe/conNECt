const fs = require('fs');

let code = fs.readFileSync('server/server.js', 'utf8');

const importStatement = `import { setIO } from "./services/socket.service.js";`;
code = code.replace('import { Server } from "socket.io";', 'import { Server } from "socket.io";\n' + importStatement);

const setIoCall = `setIO(io);`;
code = code.replace('export const io = new Server(httpServer, {', 'export const io = new Server(httpServer, {\n');
code = code.replace('  cors: { origin: process.env.CLIENT_URL || "*", credentials: true },\n});', '  cors: { origin: process.env.CLIENT_URL || "*", credentials: true },\n});\n' + setIoCall);

fs.writeFileSync('server/server.js', code);
console.log("Updated server.js to setIO");
