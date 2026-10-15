import fs from 'fs';

let content = fs.readFileSync('client/src/components/PostCard.jsx', 'utf8');

const oldFilter = `  const filteredConnections = connections.filter(conn => {
    const friend = conn.requester._id === user?._id ? conn.recipient : conn.requester;
    return friend?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });`;

const newFilter = `  const filteredConnections = connections.filter(friend => {
    return friend?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });`;

content = content.replace(oldFilter, newFilter);

// Just to be safe, if regex matching failed:
content = content.replace(/const filteredConnections = connections\.filter\(conn => \{[\s\S]*?return friend\?\.name\?\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\);\s+\}\);/m, newFilter);

fs.writeFileSync('client/src/components/PostCard.jsx', content);
console.log("Patched PostCard filteredConnections");
