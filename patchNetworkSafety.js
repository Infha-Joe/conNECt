const fs = require('fs');

let code = fs.readFileSync('client/src/pages/Network.jsx', 'utf8');

code = code.replace(/discoverResults\.length === 0/g, '(!discoverResults || discoverResults.length === 0)');
code = code.replace(/discoverResults\.map/g, '(discoverResults || []).map');
code = code.replace(/pendingRequests\.length === 0/g, '(!pendingRequests || pendingRequests.length === 0)');
code = code.replace(/pendingRequests\.map/g, '(pendingRequests || []).map');
code = code.replace(/myConnections\.length === 0/g, '(!myConnections || myConnections.length === 0)');
code = code.replace(/myConnections\.map/g, '(myConnections || []).map');
code = code.replace(/u\.name\?\.\[0\]\?\.toUpperCase\(\)/g, '(u?.name?.[0]?.toUpperCase() || "?")');

fs.writeFileSync('client/src/pages/Network.jsx', code);
console.log("Patched Network.jsx for safety");
