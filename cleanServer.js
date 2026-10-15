const fs = require('fs');
let code = fs.readFileSync('server/server.js', 'utf8');
code = code.replace(/import mentorRoutes from ".\/routes\/mentorRoutes\.js";\n/, '');
code = code.replace(/app\.use\("\/api\/mentor-requests", mentorRoutes\);\n/, '');
fs.writeFileSync('server/server.js', code);
console.log("Cleaned server.js");
