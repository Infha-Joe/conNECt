const fs = require('fs');
let code = fs.readFileSync('server/controllers/authController.js', 'utf8');

code = code.replace(
  /try \{\s+await sendEmail\(\{ to: user\.email, subject: "Verify your conNECt Account", html: message \}\);\s+\} catch \(error\) \{\s+console\.error\("Email could not be sent", error\);\s+await User\.findByIdAndDelete\(user\._id\);\s+res\.status\(500\); throw new Error\("Could not send verification email\. Please check configuration\."\);\s+\}\s+res\.status\(201\)\.json\(\{ success: true, message: "Registration successful\. Please check your email to verify your account\." \}\);/,
  `try {
    await sendEmail({ to: user.email, subject: "Verify your conNECt Account", html: message });
    res.status(201).json({ success: true, message: "Registration successful. Please check your email to verify your account." });
  } catch (error) {
    console.error("Email could not be sent", error);
    if (process.env.NODE_ENV === "development") {
      console.log(\`[DEV MODE] Auto-verifying user \${user.email} because email failed.\`);
      user.emailVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(201).json({ 
        success: true, 
        message: "Registration successful! (DEV MODE: Email bypassed due to network error. Your account was auto-verified so you can log in immediately.)" 
      });
    }
    await User.findByIdAndDelete(user._id);
    res.status(500); throw new Error("Could not send verification email. Please check configuration.");
  }`
);

fs.writeFileSync('server/controllers/authController.js', code);
console.log("Updated authController.js with development fallback");
