import fs from 'fs';

let content = fs.readFileSync('server/controllers/messageController.js', 'utf8');

// Add populate to getMessages
content = content.replace(
  /const messages = await Message\.find\(\{\s+\$or: \[\s+\{ sender: myId, recipient: targetId \},\s+\{ sender: targetId, recipient: myId \},\s+\],\s+\}\)\.sort\(\{ createdAt: 1 \}\);/m,
  `const messages = await Message.find({
      $or: [
        { sender: myId, recipient: targetId },
        { sender: targetId, recipient: myId },
      ],
    })
      .populate({ path: 'sharedPost', populate: { path: 'author', select: 'name profilePhoto' } })
      .sort({ createdAt: 1 });`
);

fs.writeFileSync('server/controllers/messageController.js', content);
console.log("Patched getMessages to populate sharedPost");
