import fs from 'fs';

let content = fs.readFileSync('client/src/pages/Notifications.jsx', 'utf8');

// Replace unsafe access with safe optional chaining and fallback
content = content.replace(/r\.requester\._id/g, 'r.requester?._id || "unknown"');
content = content.replace(/r\.requester\.profilePhoto/g, 'r.requester?.profilePhoto');
content = content.replace(/r\.requester\.name/g, 'r.requester?.name || "Unknown User"');
content = content.replace(/r\.requester\.role/g, 'r.requester?.role || "user"');
content = content.replace(/r\.requester\.department\?\.name/g, 'r.requester?.department?.name');
content = content.replace(/\{r\.requester\.name\?\.\[0\]\?\.toUpperCase\(\)\}/g, '{(r.requester?.name?.[0] || "?").toUpperCase()}');

fs.writeFileSync('client/src/pages/Notifications.jsx', content);
console.log("Patched Notifications.jsx for null safety");
