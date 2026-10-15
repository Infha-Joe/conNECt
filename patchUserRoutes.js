const fs = require('fs');
let code = fs.readFileSync('server/routes/userRoutes.js', 'utf8');

code = code.replace(
    'import { protect } from "../middleware/auth.js";',
    'import { protect } from "../middleware/auth.js";\nimport { getSpotlightUsers } from "../controllers/spotlightController.js";'
);

code = code.replace(
    'router.get("/search", protect, searchUsers);',
    'router.get("/spotlight", protect, getSpotlightUsers);\nrouter.get("/search", protect, searchUsers);'
);

fs.writeFileSync('server/routes/userRoutes.js', code);
console.log('Added /spotlight route');
