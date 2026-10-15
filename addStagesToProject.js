const fs = require('fs');
let code = fs.readFileSync('server/models/Project.js', 'utf8');

if(!code.includes('stages:')) {
    code = code.replace(
        'actualEndDate: { type: Date },',
        `actualEndDate: { type: Date },
    stages: [{
      title: { type: String, required: true },
      status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
      tasks: [{
        title: { type: String, required: true },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        isCompleted: { type: Boolean, default: false },
        completedAt: Date
      }],
      mentorFeedback: { type: String, default: "" },
      completedAt: Date
    }],`
    );
    fs.writeFileSync('server/models/Project.js', code);
    console.log("Added Roadmap Stages to Project model");
}
