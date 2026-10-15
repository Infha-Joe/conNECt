import fs from 'fs';
let content = fs.readFileSync('server/routes/postRoutes.js', 'utf8');

if (!content.includes('deletePost')) {
  content = content.replace(
    'getPostComments,\n} from "../controllers/postController.js";',
    'getPostComments,\n  deletePost,\n} from "../controllers/postController.js";'
  );
  
  content = content.replace(
    'router.post("/:id/like", protect, likePost);',
    'router.delete("/:id", protect, deletePost);\nrouter.post("/:id/like", protect, likePost);'
  );
  
  fs.writeFileSync('server/routes/postRoutes.js', content);
  console.log('Added delete route to postRoutes.js');
} else {
  console.log('delete route already exists');
}
