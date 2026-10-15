import fs from 'fs';
let content = fs.readFileSync('server.js', 'utf8');
content = content.replace('app.use(/api/test, envCheck);', 'app.use("/api/test", envCheck);');
fs.writeFileSync('server.js', content);
