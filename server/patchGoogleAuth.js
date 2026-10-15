import fs from "fs";

let code = fs.readFileSync("controllers/authController.js", "utf8");

const oldGoogleAuth = `export const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) { res.status(400); throw new Error("Google credential required"); }
  const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
  const { email, name, sub: googleId, picture } = ticket.getPayload();
  const existingUser = await User.findOne({ $or: [{ email }, { collegeGoogleId: googleId }, { personalGoogleId: googleId }] }).populate("department", "name code themeColor");

  if (existingUser) {
    if (existingUser.collegeEmail === email && !existingUser.collegeGoogleId) {
      existingUser.collegeGoogleId = googleId;
      await existingUser.save();
    }
    if (!existingUser.connectId) {
      return res.status(202).json({ success: true, isNewUser: true, manualUserId: existingUser._id, googleData: { email, name, googleId, picture } });
    }
    return res.status(200).json({ success: true, token: generateToken(existingUser._id), user: existingUser });
  }

  return res.status(202).json({ success: true, isNewUser: true, googleData: { email, name, googleId, picture } });
});`;

const newGoogleAuth = `export const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) { res.status(400); throw new Error("Google credential required"); }
  const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
  const { email, name, sub: googleId, picture } = ticket.getPayload();
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ $or: [{ email: normalizedEmail }, { collegeGoogleId: googleId }, { personalGoogleId: googleId }] }).populate("department", "name code themeColor");

  if (existingUser) {
    let changed = false;
    if (existingUser.collegeEmail === normalizedEmail && !existingUser.collegeGoogleId) {
      existingUser.collegeGoogleId = googleId;
      existingUser.emailVerified = true;
      existingUser.verificationToken = undefined;
      existingUser.verificationTokenExpires = undefined;
      changed = true;
    } else if (existingUser.personalEmail === normalizedEmail && !existingUser.personalGoogleId) {
      existingUser.personalGoogleId = googleId;
      existingUser.emailVerified = true;
      existingUser.verificationToken = undefined;
      existingUser.verificationTokenExpires = undefined;
      changed = true;
    }
    if (changed) await existingUser.save({ validateBeforeSave: false });

    if (existingUser.status === "rejected") {
      res.status(403); throw new Error("Your account has been rejected.");
    }
    if (existingUser.status === "pending_approval") {
      res.status(403); throw new Error("Your account is pending admin approval.");
    }

    if (!existingUser.connectId) {
      return res.status(202).json({ success: true, isNewUser: true, manualUserId: existingUser._id, googleData: { email: normalizedEmail, name, googleId, picture } });
    }
    return res.status(200).json({ success: true, token: generateToken(existingUser._id), user: existingUser });
  }

  return res.status(202).json({ success: true, isNewUser: true, googleData: { email: normalizedEmail, name, googleId, picture } });
});`;

code = code.replace(oldGoogleAuth, newGoogleAuth);
fs.writeFileSync("controllers/authController.js", code);
console.log("Updated googleAuth with status checks.");
