const fs = require('fs');

let code = fs.readFileSync('server/controllers/messageController.js', 'utf8');

const getMessagesLogic = `export const getMessages = asyncHandler(async (req, res) => {
  const targetId = req.params.userId;
  const myId = req.user._id;

  // Verify connection status
  const connection = await Connection.findOne({
    status: "accepted",
    $or: [
      { requester: myId, recipient: targetId },
      { requester: targetId, recipient: myId },
    ],
  });

  if (!connection) {
    res.status(403);
    throw new Error("You can only access messages with connected users");
  }

  const messages = await Message.find({
    $or: [
      { sender: myId, recipient: targetId },
      { sender: targetId, recipient: myId },
    ],
  }).sort({ createdAt: 1 });

  res.status(200).json({ success: true, count: messages.length, messages });
});`;

code = code.replace(/export const getMessages = asyncHandler\(async \(req, res\) => \{[\s\S]*?res\.status\(200\)\.json\(\{ success: true, count: messages\.length, messages \}\);\n\}\);/, getMessagesLogic);

fs.writeFileSync('server/controllers/messageController.js', code);
console.log("Secured getMessages in messageController.js");
