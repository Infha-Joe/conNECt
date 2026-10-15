import fs from 'fs';
let content = fs.readFileSync('server/controllers/postController.js', 'utf8');

const getPostCode = `
// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name profilePhoto department year role");

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  res.status(200).json({ success: true, post });
});
`;

if (!content.includes('export const getPost =')) {
  content += '\n' + getPostCode;
  fs.writeFileSync('server/controllers/postController.js', content);
  
  let routes = fs.readFileSync('server/routes/postRoutes.js', 'utf8');
  routes = routes.replace(
    'deletePost,\n} from "../controllers/postController.js";',
    'deletePost,\n  getPost,\n} from "../controllers/postController.js";'
  );
  routes = routes.replace(
    'router.delete("/:id", protect, deletePost);',
    'router.delete("/:id", protect, deletePost);\nrouter.get("/:id", protect, getPost);'
  );
  fs.writeFileSync('server/routes/postRoutes.js', routes);
  console.log('Added getPost endpoint');
} else {
  console.log('getPost already exists');
}
