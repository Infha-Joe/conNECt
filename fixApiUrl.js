import fs from 'fs';
let content = fs.readFileSync('client/.env', 'utf8');
if (!content.includes('VITE_API_URL')) {
  content += '\nVITE_API_URL=http://localhost:5005/api\n';
  fs.writeFileSync('client/.env', content);
}

let apiContent = fs.readFileSync('client/src/services/api.js', 'utf8');
apiContent = apiContent.replace('"http://localhost:5000/api"', '"http://localhost:5005/api"');
fs.writeFileSync('client/src/services/api.js', apiContent);
console.log("Fixed API URLs to point to 5005");
