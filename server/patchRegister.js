import fs from "fs";

let code = fs.readFileSync("controllers/authController.js", "utf8");

// Extract everything BEFORE registerManual
const beforeRegister = code.substring(0, code.indexOf("export const registerManual"));

// Extract verifyEmail, resendVerification, loginManual
const verifyStart = code.indexOf("export const verifyEmail");
const completeStart = code.indexOf("export const completeRegistration");
const middleFunctions = code.substring(verifyStart, completeStart);

// Extract everything AFTER completeRegistration
const verifyPersonalStart = code.indexOf("export const verifyPersonalEmail");
const afterComplete = code.substring(verifyPersonalStart);

const newRegisterManual = `
export const registerManual = asyncHandler(async (req, res) => {
  const { accountType, name, email, password, collegeId, facultyId, department: deptCode, year, graduationYear } = req.body;
  
  if (!accountType || !name || !email || !password) { 
    res.status(400); throw new Error("Please fill in all required fields"); 
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (accountType === "student") {
    if (!collegeId || !year) { res.status(400); throw new Error("College ID and Year are required for Students"); }
    if (!normalizedEmail.endsWith("@nec.edu.in")) { res.status(403); throw new Error("Must use an NEC domain email"); }
  } else if (accountType === "teacher") {
    if (!facultyId) { res.status(400); throw new Error("Faculty ID is required for Faculty"); }
    if (!normalizedEmail.endsWith("@nec.edu.in")) { res.status(403); throw new Error("Must use an NEC domain email"); }
  } else if (accountType === "alumni_new") {
    if (!graduationYear) { res.status(400); throw new Error("Graduation Year is required for Alumni"); }
  } else {
    res.status(400); throw new Error("Invalid account type");
  }

  const orConditions = [{ email: normalizedEmail }];
  if (collegeId) orConditions.push({ collegeId: collegeId.trim().toUpperCase() });
  if (facultyId) orConditions.push({ facultyId: facultyId.trim().toUpperCase() });

  const existing = await User.findOne({ $or: orConditions });
  if (existing) {
    res.status(400); throw new Error("User with this email or ID already exists");
  }

  let departmentId = undefined;
  if (deptCode) {
    const dept = await Department.findOne({ code: deptCode });
    if (dept) departmentId = dept._id;
  }

  const connectId = await generateConnectId();
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const userPayload = {
    name,
    email: normalizedEmail,
    password,
    role: accountType === "teacher" ? "teacher" : accountType === "alumni_new" ? "alumni" : "student",
    department: departmentId,
    connectId,
    emailVerified: false,
    verificationToken,
    verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000
  };

  if (accountType === "student") {
    userPayload.collegeId = collegeId.trim().toUpperCase();
    userPayload.year = Number(year);
    userPayload.collegeEmail = normalizedEmail;
  } else if (accountType === "teacher") {
    userPayload.facultyId = facultyId.trim().toUpperCase();
    userPayload.collegeEmail = normalizedEmail;
  } else if (accountType === "alumni_new") {
    userPayload.personalEmail = normalizedEmail;
    userPayload.graduationYear = Number(graduationYear);
    userPayload.status = "pending_approval";
    userPayload.alumniType = "new_alumni";
  }

  const user = await User.create(userPayload);

  const verificationUrl = \`\$\{process.env.CLIENT_URL\}/verify-email/\$\{verificationToken\}\`;
  console.log("\\n=== VERIFICATION LINK ===\\n" + verificationUrl + "\\n=========================\\n");
  const message = \`
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Welcome to conNECt!</h2>
        <p>Hi \$\{name\},</p>
        <p>Here is your account activation link:</p>
        <p><a href="\$\{verificationUrl\}" style="background: #0f172a; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Activate Account</a></p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser: <br/> \$\{verificationUrl\}</p>
      </div>
  \`;

  try {
    await sendEmail({ to: user.email, subject: "Verify your conNECt Account", html: message });
  } catch (error) {
    console.error("Email could not be sent", error);
    await User.findByIdAndDelete(user._id);
    res.status(500); throw new Error("Could not send verification email. Please check configuration.");
  }

  res.status(201).json({ success: true, message: "Registration successful. Please check your email to verify your account." });
});
`;

const newCompleteRegistration = `
export const completeRegistration = asyncHandler(async (req, res) => {
  const { manualUserId, email, name, googleId, picture, accountType, collegeId, facultyId, department: deptCode, year, graduationYear } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  // If this is a manualUserId flow from an older incomplete registration
  if (manualUserId) {
    const user = await User.findById(manualUserId);
    if (!user) { res.status(404); throw new Error("User not found"); }
    const idExists = await User.findOne({ collegeId, _id: { $ne: manualUserId } });
    if (idExists) { res.status(400); throw new Error("College ID already in use"); }

    user.collegeId = collegeId;
    user.department = deptCode || undefined;
    user.year = Number(year);
    user.role = "student";
    user.connectId = await generateConnectId();
    if (googleId) { user.collegeGoogleId = googleId; user.profilePhoto = picture; }
    await user.save();
    
    const populatedUser = await User.findById(user._id).populate("department", "name code themeColor");
    return res.status(200).json({ success: true, token: generateToken(user._id), user: populatedUser });
  }

  if (accountType === "student") {
    if (!collegeId || !year) { res.status(400); throw new Error("College ID and Year are required"); }
    if (!normalizedEmail.endsWith("@nec.edu.in")) { res.status(403); throw new Error("Must use an NEC domain email"); }
  } else if (accountType === "teacher") {
    if (!facultyId) { res.status(400); throw new Error("Faculty ID is required"); }
    if (!normalizedEmail.endsWith("@nec.edu.in")) { res.status(403); throw new Error("Must use an NEC domain email"); }
  } else if (accountType === "alumni_new") {
    if (!graduationYear) { res.status(400); throw new Error("Graduation Year is required"); }
  } else {
    res.status(400); throw new Error("Invalid account type");
  }

  const orConditions = [{ email: normalizedEmail }];
  if (collegeId) orConditions.push({ collegeId: collegeId.trim().toUpperCase() });
  if (facultyId) orConditions.push({ facultyId: facultyId.trim().toUpperCase() });

  const existing = await User.findOne({ $or: orConditions });
  if (existing) { res.status(400); throw new Error("User with this email or ID already exists"); }

  let departmentId = undefined;
  if (deptCode) {
    const dept = await Department.findOne({ code: deptCode });
    if (dept) departmentId = dept._id;
  }

  const connectId = await generateConnectId();

  const userPayload = {
    name,
    email: normalizedEmail,
    role: accountType === "teacher" ? "teacher" : accountType === "alumni_new" ? "alumni" : "student",
    department: departmentId,
    connectId,
    profilePhoto: picture,
    emailVerified: true, 
  };

  if (accountType === "student") {
    userPayload.collegeId = collegeId.trim().toUpperCase();
    userPayload.year = Number(year);
    userPayload.collegeEmail = normalizedEmail;
    userPayload.collegeGoogleId = googleId;
  } else if (accountType === "teacher") {
    userPayload.facultyId = facultyId.trim().toUpperCase();
    userPayload.collegeEmail = normalizedEmail;
    userPayload.collegeGoogleId = googleId;
  } else if (accountType === "alumni_new") {
    userPayload.personalEmail = normalizedEmail;
    userPayload.graduationYear = Number(graduationYear);
    userPayload.personalGoogleId = googleId;
    userPayload.status = "pending_approval";
    userPayload.alumniType = "new_alumni";
  }

  const user = await User.create(userPayload);
  const populatedUser = await User.findById(user._id).populate("department", "name code themeColor");

  if (userPayload.status === "pending_approval") {
     return res.status(202).json({ success: true, message: "Your Alumni registration has been submitted and is pending admin approval. You cannot login until approved." });
  }

  res.status(201).json({ success: true, token: generateToken(user._id), user: populatedUser });
});
`;

fs.writeFileSync("controllers/authController.js", beforeRegister + newRegisterManual + middleFunctions + newCompleteRegistration + afterComplete);
console.log("Successfully injected new registerManual and completeRegistration.");
