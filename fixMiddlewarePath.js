import fs from 'fs';
let content = fs.readFileSync('server/routes/uploadRoutes.js', 'utf8');
content = content.replace(
  "import { protect } from '../middlewares/authMiddleware.js';",
  "import { protect } from '../middleware/authMiddleware.js';"
);
fs.writeFileSync('server/routes/uploadRoutes.js', content);
