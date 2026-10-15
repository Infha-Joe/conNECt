/* =========================================================================
 * ❄️ AUTHENTICATION IS FROZEN ❄️
 * Do not modify authentication files or password/JWT/email-verification logic 
 * while implementing unrelated features.
 * Reuse the existing auth system.
 * ========================================================================= */

import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Department from "../models/Department.js";
import { OAuth2Client } from "google-auth-library";
import { generateConnectId } from "../utils/generateConnectId.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const googleAuth = asyncHandler(async (req, res) => {
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
});


export const registerManual = asyncHandler(async (req, res) => {
  const { accountType, name, email, password, collegeId, facultyId, designation, department: deptCode, year, graduationYear, batch, degree, currentCompany, currentRole } = req.body;
  
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
    if (designation) userPayload.designation = designation;
    userPayload.collegeEmail = normalizedEmail;
  } else if (accountType === "alumni_new") {
    userPayload.personalEmail = normalizedEmail;
    userPayload.graduationYear = Number(graduationYear);
    if (batch) userPayload.batch = batch;
    if (degree) userPayload.degree = degree;
    if (currentCompany) userPayload.currentCompany = currentCompany;
    if (currentRole) userPayload.currentRole = currentRole;
    userPayload.status = "pending_approval";
    userPayload.alumniType = "new_alumni";
  }

  const user = await User.create(userPayload);

  const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const verificationUrl = `${frontendUrl}/verify-email/${verificationToken}`;
  console.log("\n=== VERIFICATION LINK ===\n" + verificationUrl + "\n=========================\n");
  const message = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Welcome to conNECt!</h2>
        <p>Hi ${name},</p>
        <p>Here is your account activation link:</p>
        <p><a href="${verificationUrl}" style="background: #0f172a; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Activate Account</a></p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser: <br/> ${verificationUrl}</p>
      </div>
  `;

  try {
    await sendEmail({ to: user.email, subject: "Verify your conNECt Account", html: message });
    res.status(201).json({ success: true, message: "Registration successful. Please check your email to verify your account." });
  } catch (error) {
    console.error("Email could not be sent", error);
    await User.findByIdAndDelete(user._id);
    res.status(500); 
    throw new Error("Could not send verification email. Please check configuration.");
  }
});
export const verifyEmail = asyncHandler(async (req, res) => {
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
  });

export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) { res.status(400); throw new Error("Email is required"); }
  
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) { res.status(404); throw new Error("User not found"); }
  if (user.emailVerified) { res.status(400); throw new Error("Email is already verified"); }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  user.verificationToken = verificationToken;
  user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const verificationUrl = `${frontendUrl}/verify-email/${verificationToken}`;
    console.log("\n=== VERIFICATION LINK ===\n" + verificationUrl + "\n=========================\n");
  const message = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Welcome to conNECt!</h2>
        <p>Hi ${user.name},</p>
        <p>Here is your account activation link:</p>
        <p><a href="${verificationUrl}" style="background: #0f172a; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Activate Account</a></p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser: <br/> ${verificationUrl}</p>
      </div>
    `;

  try {
    await sendEmail({ to: user.email, subject: "Verify your conNECt Account", html: message });
  } catch (error) {
    console.error("Email could not be sent", error);
    res.status(500);
    throw new Error("Could not send verification email. Please check configuration.");
  }
  res.status(200).json({ success: true, message: "A new verification email has been sent." });
});

export const loginManual = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400); throw new Error("Email and password are required"); }

  const identifier = email.trim();
  const isEmail = identifier.includes('@');
  
  const query = isEmail 
    ? { email: identifier.toLowerCase() } 
    : { $or: [{ collegeId: identifier.toUpperCase() }, { facultyId: identifier.toUpperCase() }] };

  const user = await User.findOne(query).select("+password").populate("department", "name code themeColor");
  if (!user || !(await user.comparePassword(password))) { res.status(401); throw new Error("Invalid credentials"); }
  if (!user.emailVerified) { res.status(401); throw new Error("Please verify your email before logging in."); }
  if (user.status === "pending_approval") { res.status(403); throw new Error("Your account is pending admin approval."); }
  if (user.status === "rejected") { res.status(403); throw new Error("Your account has been rejected."); }

  if (!user.connectId) {
    return res.status(202).json({
       success: true, isNewUser: true, manualUserId: user._id,
       googleData: { email: user.email, name: user.name, googleId: null, picture: user.profilePhoto }
    });
  }

  res.status(200).json({ success: true, token: generateToken(user._id), user });
});


export const completeRegistration = asyncHandler(async (req, res) => {
  const { manualUserId, email, name, googleId, picture, accountType, collegeId, facultyId, department: deptCode, year, graduationYear } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  // If this is a manualUserId flow from an older incomplete registration
  if (manualUserId) {
      const user = await User.findById(manualUserId);
      if (!user) { res.status(404); throw new Error("User not found"); }
      
      const orConditions = [];
      if (collegeId) orConditions.push({ collegeId: collegeId.trim().toUpperCase() });
      if (facultyId) orConditions.push({ facultyId: facultyId.trim().toUpperCase() });
      
      if (orConditions.length > 0) {
        const idExists = await User.findOne({ $or: orConditions, _id: { $ne: manualUserId } });
        if (idExists) { res.status(400); throw new Error("ID already in use"); }
      }
      
      if (accountType === "student") {
        user.collegeId = collegeId;
        user.year = Number(year);
        user.role = "student";
      } else if (accountType === "teacher") {
        user.facultyId = facultyId;
        user.role = "teacher";
      } else if (accountType === "alumni_new") {
        user.graduationYear = graduationYear;
        user.role = "alumni";
      }
      
      if (deptCode) {
        const dept = await Department.findOne({ code: deptCode });
        if (dept) user.department = dept._id;
      }
      
      if (!user.connectId) {
        user.connectId = await generateConnectId();
      }
      if (googleId) {
        if (accountType === "alumni_new") {
          user.personalGoogleId = googleId;
        } else {
          user.collegeGoogleId = googleId;
        }
        user.profilePhoto = picture;
      }
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
export const verifyPersonalEmail = asyncHandler(async (req, res) => {
  const { personalEmail } = req.body;
  if (!personalEmail) { res.status(400); throw new Error("Personal email required"); }
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error("User not found"); }

  user.personalEmail = personalEmail;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, message: "Personal email linked successfully.", user });
});

export const linkGoogleAccount = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) { res.status(400); throw new Error("Google credential required"); }
  const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
  const { email, sub: googleId } = ticket.getPayload();
  const user = await User.findById(req.user._id);
  
  if (user.collegeEmail && user.collegeEmail === email) { user.collegeGoogleId = googleId; }
  else if (user.personalEmail && user.personalEmail === email) { user.personalGoogleId = googleId; }
  else { res.status(400); throw new Error("Google email does not match any verified email on this account."); }

  await user.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, message: "Google account linked successfully.", user });
});

export const graduateToAlumni = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  if (user.role === "alumni") { res.status(400); throw new Error("Already an alumni"); }
  if (!user.personalEmail) { res.status(400); throw new Error("Must add a personal email before graduating"); }

  user.email = user.personalEmail;
  user.role = "alumni";
  user.graduationYear = new Date().getFullYear();
  user.alumniSince = new Date();
  await user.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, message: "Congratulations on graduating! You are now an Alumni.", user });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("department", "name code themeColor");
  res.status(200).json({ success: true, user });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
});
