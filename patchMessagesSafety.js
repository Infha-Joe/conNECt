const fs = require('fs');

let code = fs.readFileSync('client/src/pages/Messages.jsx', 'utf8');

// Fix potential undefined maps/lengths
code = code.replace(/conversations\.length === 0/g, '(!conversations || conversations.length === 0)');
code = code.replace(/conversations\.map/g, '(conversations || []).map');
code = code.replace(/messages\.length === 0/g, '(!messages || messages.length === 0)');
code = code.replace(/messages\.map/g, '(messages || []).map');

// Fix potential undefined name access
code = code.replace(/c\.partner\.name\[0\]/g, '(c.partner?.name?.[0] || "?")');
code = code.replace(/activePartner\.name\[0\]/g, '(activePartner?.name?.[0] || "?")');

// Fix currentUser in useSocket
code = code.replace(/currentUser\._id/g, 'currentUser?._id');

fs.writeFileSync('client/src/pages/Messages.jsx', code);
console.log("Patched Messages.jsx for safety");
