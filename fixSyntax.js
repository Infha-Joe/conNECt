import fs from 'fs';

let content = fs.readFileSync('server/controllers/authController.js', 'utf8');

// The problematic block is from "export const verifyEmail =" down to the duplicate "});" before "export const resendVerification ="
const fixedVerifyEmail = `export const verifyEmail = asyncHandler(async (req, res) => {
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
  // We deliberately DO NOT clear user.verificationToken string here so we can find the user if they click the link again and tell them "Your account is already verified." We invalidate it by clearing the expiration instead.
  user.verificationTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: "Email verified successfully. You can now login to complete your registration." });
});`;

const matchRegex = /export const verifyEmail = asyncHandler\(async \(req, res\) => \{[\s\S]*?registration\." \}\);\s*\n\s*\n\s*\}\);/m;

content = content.replace(matchRegex, fixedVerifyEmail);

// If the regex failed to match because of slight newline variations, fallback to a more robust replacement:
if(content.includes('if (!user) { res.status(400); throw new Error("Invalid or expired verification token"); }')) {
    content = content.replace(/\n\s*if \(\!user\) \{ res\.status\(400\); throw new Error\("Invalid or expired verification token"\); \}[\s\S]*?registration\." \}\);\s*\n\s*\}\);/, '');
}

fs.writeFileSync('server/controllers/authController.js', content);
console.log("Fixed syntax error");
