import fs from 'fs';
let content = fs.readFileSync('server/controllers/authController.js', 'utf8');

content = content.replace(
  'const { email, password } = req.body;\n  if (!email || !password) { res.status(400); throw new Error("Email and password are required"); }\n\n  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password").populate("department", "name code themeColor");',
  `const { email, password } = req.body;
  if (!email || !password) { res.status(400); throw new Error("Email and password are required"); }

  const identifier = email.trim();
  const isEmail = identifier.includes('@');
  
  const query = isEmail 
    ? { email: identifier.toLowerCase() } 
    : { $or: [{ collegeId: identifier.toUpperCase() }, { facultyId: identifier.toUpperCase() }] };

  const user = await User.findOne(query).select("+password").populate("department", "name code themeColor");`
);

fs.writeFileSync('server/controllers/authController.js', content);
console.log("Patched loginManual to support College ID / Faculty ID");
