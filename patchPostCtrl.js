import fs from 'fs';
let content = fs.readFileSync('server/controllers/postController.js', 'utf8');

content = content.replace(
  'const { content } = req.body;\n\n  if (!content) {\n    res.status(400);\n    throw new Error("Post content is required");\n  }',
  `const { content, mediaUrl, mediaType } = req.body;\n\n  if (!content && !mediaUrl) {\n    res.status(400);\n    throw new Error("Post content or media is required");\n  }`
);

content = content.replace(
  'const post = await Post.create({\n    author: req.user._id,\n    content,\n  });',
  `const post = await Post.create({\n    author: req.user._id,\n    content,\n    mediaUrl,\n    mediaType\n  });`
);

// We also need to add search logic to getFeedPosts
content = content.replace(
  'export const getFeedPosts = asyncHandler(async (req, res) => {',
  `export const getFeedPosts = asyncHandler(async (req, res) => {\n  const { search } = req.query;\n  let query = {};\n  if (search) {\n    query = {\n      $or: [\n        { content: { $regex: search, $options: "i" } }\n      ]\n    };\n  }`
);

content = content.replace(
  'const posts = await Post.find()\n    .sort({ createdAt: -1 })',
  'const posts = await Post.find(query)\n    .sort({ createdAt: -1 })'
);

fs.writeFileSync('server/controllers/postController.js', content);
console.log("Updated postController.js");
