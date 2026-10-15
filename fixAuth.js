import fs from 'fs';
let content = fs.readFileSync('server/routes/uploadRoutes.js', 'utf8');
content = content.replace(
  "import { protect } from '../middleware/authMiddleware.js';",
  "import { protect } from '../middleware/auth.js';"
);
fs.writeFileSync('server/routes/uploadRoutes.js', content);
