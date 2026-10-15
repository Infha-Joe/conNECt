import fs from 'fs';

let content = fs.readFileSync('src/pages/Network.jsx', 'utf8');

// The discover list is likely mapping over discoverResults
content = content.replace(/<div className="mt-4 space-y-3">/g, '<div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">');

// For pending requests and connections
content = content.replace(/<div className="mt-6 space-y-3">/g, '<div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">');

fs.writeFileSync('src/pages/Network.jsx', content);

// Events
let evContent = fs.readFileSync('src/pages/Events.jsx', 'utf8');
evContent = evContent.replace(/<div className="mt-6 space-y-3">/g, '<div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">');
fs.writeFileSync('src/pages/Events.jsx', evContent);

