import fs from 'fs';
let content = fs.readFileSync('server/routes/uploadRoutes.js', 'utf8');
content = content.replace(
  "res.send(`/${req.file.path.replace(/\\\\/g, '/')}`);",
  "res.json({ url: `/${req.file.path.replace(/\\\\/g, '/')}` });"
);
fs.writeFileSync('server/routes/uploadRoutes.js', content);

let clientContent = fs.readFileSync('client/src/components/CreatePost.jsx', 'utf8');
clientContent = clientContent.replace(
  "mediaUrl = uploadRes.data;",
  "mediaUrl = uploadRes.data.url;"
);
fs.writeFileSync('client/src/components/CreatePost.jsx', clientContent);
console.log("Fixed upload API response format");
