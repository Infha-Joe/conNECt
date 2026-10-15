const fs = require('fs');

let code = fs.readFileSync('server/controllers/authController.js', 'utf8');

const faultyCode = `user.collegeId = collegeId;
      user.department = deptCode || undefined;
      user.year = Number(year);`;

const fixedCode = `user.collegeId = collegeId;
      if (deptCode) {
        const dept = await Department.findOne({ code: deptCode });
        if (dept) user.department = dept._id;
      }
      user.year = Number(year);`;

code = code.replace(faultyCode, fixedCode);

fs.writeFileSync('server/controllers/authController.js', code);
console.log("Fixed department CastError bug in completeRegistration");
