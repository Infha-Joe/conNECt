import fs from 'fs';
let content = fs.readFileSync('server/controllers/postController.js', 'utf8');

content = content.replace(
  '    const post = await Post.create({\n      author: req.user._id,\n      content,\n      mediaUrl,\n      mediaType\n    });',
  '    const postData = { author: req.user._id };\n    if (content) postData.content = content;\n    if (mediaUrl) {\n      postData.mediaUrl = mediaUrl;\n      postData.mediaType = mediaType;\n    }\n\n    const post = await Post.create(postData);'
);

fs.writeFileSync('server/controllers/postController.js', content);
console.log("Patched postController.js validation logic");
