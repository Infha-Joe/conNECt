const fs = require('fs');

let code = fs.readFileSync('server/controllers/authController.js', 'utf8');

const regex = /if \(manualUserId\) \{[\s\S]*?return res\.status\(200\)\.json\(\{ success: true, token: generateToken\(user\._id\), user: populatedUser \}\);\n\s*\}/;

const fixedBlock = `if (manualUserId) {
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
      if (googleId) { user.collegeGoogleId = googleId; user.profilePhoto = picture; }
      await user.save();
      
      const populatedUser = await User.findById(user._id).populate("department", "name code themeColor");
      return res.status(200).json({ success: true, token: generateToken(user._id), user: populatedUser });
    }`;

code = code.replace(regex, fixedBlock);
fs.writeFileSync('server/controllers/authController.js', code);
console.log("Patched manualUserId logic in completeRegistration");
