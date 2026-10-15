import fs from 'fs';

let content = fs.readFileSync('server/controllers/authController.js', 'utf8');

// Replace the verifyEmail endpoint completely
content = content.replace(
  /export const verifyEmail = asyncHandler\(async \(req, res\) => \{[\s\S]*?\}\);/g,
  `export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      res.status(400);
      throw new Error("Invalid verification link");
    }
    
    if (user.emailVerified) {
      res.status(400);
      throw new Error("Your account is already verified.");
    }
    
    if (!user.verificationTokenExpires || user.verificationTokenExpires < Date.now()) {
      res.status(400);
      throw new Error("Verification link has expired");
    }
    
    user.emailVerified = true;
    user.verificationToken = undefined; // Clears the token
    user.verificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
  
    res.status(200).json({ success: true, message: "Email verified successfully. You can now login to complete your registration." });
  });`
);

fs.writeFileSync('server/controllers/authController.js', content);
console.log("Updated verifyEmail endpoint.");
