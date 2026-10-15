const fs = require('fs');

let code = fs.readFileSync('server/controllers/connectionController.js', 'utf8');

const importFollow = `import Follow from "../models/Follow.js";\n`;
code = code.replace('import Notification from "../models/Notification.js";', importFollow + 'import Notification from "../models/Notification.js";');

const logic = `  connection.status = action === "accept" ? "accepted" : "rejected";
  connection.respondedAt = new Date();
  await connection.save();

  if (action === "accept") {
    // Create mutual follow when connection is accepted
    await Follow.updateOne(
      { follower: connection.requester, following: connection.recipient },
      { $setOnInsert: { follower: connection.requester, following: connection.recipient } },
      { upsert: true }
    );
    await Follow.updateOne(
      { follower: connection.recipient, following: connection.requester },
      { $setOnInsert: { follower: connection.recipient, following: connection.requester } },
      { upsert: true }
    );
  }`;

code = code.replace(/connection\.status = action === "accept" \? "accepted" : "rejected";\n\s*connection\.respondedAt = new Date\(\);\n\s*await connection\.save\(\);/m, logic);

fs.writeFileSync('server/controllers/connectionController.js', code);
console.log("Updated connectionController with Follow logic");
