const fs = require('fs');
let code = fs.readFileSync('server/controllers/postController.js', 'utf8');

if (!code.includes('getUserPosts')) {
    code += `
export const getUserPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
    .sort({ createdAt: -1 })
    .populate("author", "name profilePhoto department year role")
    .lean();

  const postsWithCommentCounts = await Promise.all(
    posts.map(async (post) => {
      const commentCount = await Comment.countDocuments({ post: post._id });
      return { ...post, commentCount };
    })
  );

  res.status(200).json({ success: true, posts: postsWithCommentCounts });
});
`;
    fs.writeFileSync('server/controllers/postController.js', code);
    
    let routes = fs.readFileSync('server/routes/postRoutes.js', 'utf8');
    routes = routes.replace(
        'import {',
        'import {\n  getUserPosts,'
    );
    routes = routes.replace(
        'router.get("/feed", protect, getFeedPosts);',
        'router.get("/feed", protect, getFeedPosts);\nrouter.get("/user", protect, getUserPosts);'
    );
    fs.writeFileSync('server/routes/postRoutes.js', routes);
    console.log("Added getUserPosts");
}
