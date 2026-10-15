const fs = require("fs");
let code = fs.readFileSync("models/User.js", "utf8");

if (!code.includes("facultyId")) {
  code = code.replace(
    /collegeId: \{[\s\S]*?\},/,
    'collegeId: {\n      type: String,\n      trim: true,\n      unique: true,\n      sparse: true,\n    },\n    facultyId: {\n      type: String,\n      trim: true,\n      unique: true,\n      sparse: true,\n    },\n    status: {\n      type: String,\n      enum: ["active", "pending_approval", "rejected"],\n      default: "active",\n    },\n    alumniType: {\n      type: String,\n      enum: ["existing_student", "new_alumni"],\n    },'
  );
  fs.writeFileSync("models/User.js", code);
  console.log("Updated User.js schema.");
}
