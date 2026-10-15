const fs = require('fs');
let code = fs.readFileSync('server/server.js', 'utf8');

code = code.replace(
  'cors: { origin: process.env.CLIENT_URL || "*", credentials: true }',
  'cors: { origin: [process.env.CLIENT_URL, "http://127.0.0.1:5173", "http://localhost:5173"], credentials: true }'
);

code = code.replace(
  'app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));',
  'app.use(cors({ origin: [process.env.CLIENT_URL, "http://127.0.0.1:5173", "http://localhost:5173"], credentials: true }));'
);

fs.writeFileSync('server/server.js', code);
console.log("Updated CORS to allow 127.0.0.1 as well as localhost");
