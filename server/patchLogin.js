import fs from "fs";

let code = fs.readFileSync("controllers/authController.js", "utf8");

// We need to inject status checks into loginManual
if (!code.includes('user.status === "pending_approval"')) {
  code = code.replace(
    /if \(!user.emailVerified\) \{ res\.status\(401\); throw new Error\("Please verify your email before logging in\."\); \}/,
    `if (!user.emailVerified) { res.status(401); throw new Error("Please verify your email before logging in."); }
  if (user.status === "pending_approval") { res.status(403); throw new Error("Your account is pending admin approval."); }
  if (user.status === "rejected") { res.status(403); throw new Error("Your account has been rejected."); }`
  );
  fs.writeFileSync("controllers/authController.js", code);
  console.log("Updated loginManual with status checks.");
}
