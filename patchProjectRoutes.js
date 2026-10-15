const fs = require('fs');
let code = fs.readFileSync('server/routes/projectRoutes.js', 'utf8');

code = code.replace(
    'import { protect } from "../middleware/auth.js";',
    'import { protect } from "../middleware/auth.js";\nimport { initializeRoadmap, updateTaskStatus, addMentorFeedback } from "../controllers/roadmapController.js";'
);

code = code.replace(
    'export default router;',
    'router.post("/:id/roadmap/init", protect, initializeRoadmap);\nrouter.put("/:id/roadmap/task", protect, updateTaskStatus);\nrouter.put("/:id/roadmap/feedback", protect, addMentorFeedback);\n\nexport default router;'
);

fs.writeFileSync('server/routes/projectRoutes.js', code);
console.log('Added roadmap routes');
