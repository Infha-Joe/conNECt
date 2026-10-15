import fs from 'fs';
let content = fs.readFileSync('server/controllers/messageController.js', 'utf8');

content = content.replace(
  'const { text } = req.body;',
  'const { text, sharedPost } = req.body;'
);

content = content.replace(
  /if \(\!text \|\| \!text\.trim\(\)\) \{\s*res\.status\(400\);\s*throw new Error\("Message text is required"\);\s*\}/,
  `if ((!text || !text.trim()) && !sharedPost) {
    res.status(400);
    throw new Error("Message text or a shared post is required");
  }`
);

content = content.replace(
  'const message = await Message.create({\n    sender: myId,\n    recipient: targetId,\n    text: text.trim(),\n  });',
  `const message = await Message.create({
    sender: myId,
    recipient: targetId,
    text: text ? text.trim() : "Shared a post",
    sharedPost,
  });`
);

// Also we need to populate sharedPost when returning it.
content = content.replace(
  'const populatedMessage = await Message.findById(message._id).populate("sender recipient", "name profilePhoto role");',
  `const populatedMessage = await Message.findById(message._id).populate("sender recipient", "name profilePhoto role").populate({
    path: "sharedPost",
    populate: { path: "author", select: "name" }
  });`
);

// And when getting messages, we should populate it too!
content = content.replace(
  '.populate("sender recipient", "name profilePhoto role");',
  '.populate("sender recipient", "name profilePhoto role").populate({ path: "sharedPost", populate: { path: "author", select: "name" } });'
);

fs.writeFileSync('server/controllers/messageController.js', content);
console.log("Patched messageController.js to support sharedPost");
