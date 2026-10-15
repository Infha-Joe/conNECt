import fs from 'fs';

let content = fs.readFileSync('server/controllers/authController.js', 'utf8');

// Patch register block
content = content.replace(
  /\} catch \(error\) \{\s*console\.error\("Email could not be sent", error\);\s*if \(process\.env\.NODE_ENV === "development"\) \{\s*console\.log\(`\[DEV MODE\].*?\);\s*user\.emailVerified = true;\s*user\.verificationToken = undefined;\s*user\.verificationTokenExpires = undefined;\s*await user\.save\(\{ validateBeforeSave: false \}\);\s*return res\.status\(201\)\.json\(\{\s*success: true,\s*message: "Registration successful! \(DEV MODE: Email bypassed due to network error\. Your account was auto-verified so you can log in immediately\.\)"\s*\}\);\s*\}\s*await User\.findByIdAndDelete\(user\._id\);\s*res\.status\(500\); throw new Error\("Could not send verification email\. Please check configuration\."\);\s*\}/s,
  `} catch (error) {
    console.error("Email could not be sent", error);
    await User.findByIdAndDelete(user._id);
    res.status(500); 
    throw new Error("Could not send verification email. Please check configuration.");
  }`
);

// Patch resendVerification block
content = content.replace(
  /\} catch \(error\) \{\s*console\.error\("Email could not be sent", error\);\s*\}\s*res\.status\(200\)\.json\(\{ success: true, message: "A new verification email has been sent\." \}\);/s,
  `} catch (error) {
    console.error("Email could not be sent", error);
    res.status(500);
    throw new Error("Could not send verification email. Please check configuration.");
  }
  res.status(200).json({ success: true, message: "A new verification email has been sent." });`
);

fs.writeFileSync('server/controllers/authController.js', content);
console.log("Patched catch blocks");
