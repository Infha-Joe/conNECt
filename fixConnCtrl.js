import fs from 'fs';

let content = fs.readFileSync('server/controllers/connectionController.js', 'utf8');

const oldCheck = `  if (existing) {
    if (existing.status === "accepted") {
      res.status(400);
      throw new Error("You are already connected with this user");
    }
    if (existing.status === "pending") {
      res.status(400);
      throw new Error("A connection request is already pending with this user");
    }
    // Previously rejected — allow a fresh request by resetting it
    existing.requester = req.user._id;
    existing.recipient = targetId;
    existing.status = "pending";
    existing.respondedAt = undefined;
    await existing.save();
  } else {
    await Connection.create({ requester: req.user._id, recipient: targetId });
  }`;

const newCheck = `  if (existing) {
    if (existing.status === "accepted") {
      return res.status(200).json({ success: true, status: "accepted", message: "Already connected" });
    }
    if (existing.status === "pending") {
      const isIncoming = existing.recipient.toString() === req.user._id.toString();
      return res.status(200).json({ 
        success: true, 
        status: isIncoming ? "pending-incoming" : "pending-outgoing", 
        message: isIncoming ? "Incoming request exists" : "Request already sent" 
      });
    }
    // Previously rejected — allow a fresh request by resetting it
    existing.requester = req.user._id;
    existing.recipient = targetId;
    existing.status = "pending";
    existing.respondedAt = undefined;
    await existing.save();
  } else {
    // Add safety against race condition duplicates via upsert-style findOneAndUpdate
    const connection = await Connection.findOneAndUpdate(
      {
        $or: [
          { requester: req.user._id, recipient: targetId },
          { requester: targetId, recipient: req.user._id },
        ],
      },
      {
        $setOnInsert: { requester: req.user._id, recipient: targetId, status: "pending" }
      },
      { upsert: true, new: true, rawResult: true }
    );
    
    // If it wasn't an insert, someone beat us to it in a race condition
    if (!connection.lastErrorObject?.updatedExisting) {
       // Proceed to notification
    } else {
       // Race condition caught
       const isIncoming = connection.value.recipient.toString() === req.user._id.toString();
       return res.status(200).json({ 
         success: true, 
         status: isIncoming ? "pending-incoming" : "pending-outgoing", 
         message: "Request handled concurrently" 
       });
    }
  }`;

content = content.replace(oldCheck, newCheck);
fs.writeFileSync('server/controllers/connectionController.js', content);
console.log("Updated connectionController check logic");
