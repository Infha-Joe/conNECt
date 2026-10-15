const fs = require('fs');
let code = fs.readFileSync('server/controllers/mentorshipController.js', 'utf8');

// Ensure Project model is imported
if (!code.includes('import Project from "../models/Project.js"')) {
    code = code.replace(
        'import User from "../models/User.js";',
        'import User from "../models/User.js";\nimport Project from "../models/Project.js";'
    );
}

code = code.replace(
    /export const createMentorRequest = asyncHandler\(async \(req, res\) => {[\s\S]*?res\.status\(201\)\.json\(mentorRequest\);\n}\);/m,
    `export const createMentorRequest = asyncHandler(async (req, res) => {
  const { mentorId, projectId, goals, message, requestedDuration } = req.body;

  if (req.user.role !== "student") {
    res.status(403);
    throw new Error("Only students can request mentorship");
  }

  if (!projectId) {
    res.status(400);
    throw new Error("A project must be selected to request a mentor");
  }

  // Verify Project
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (project.leader.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the project leader can request a mentor");
  }

  if (project.mentor) {
    res.status(400);
    throw new Error("This project already has an active mentor");
  }

  // Verify Mentor
  const mentor = await User.findById(mentorId);
  if (!mentor || (mentor.role !== "teacher" && mentor.role !== "alumni")) {
    res.status(400);
    throw new Error("Selected user is not eligible to be a mentor");
  }

  // Prevent duplicate pending requests for this specific project and mentor
  const existingRequest = await MentorRequest.findOne({
    project: projectId,
    mentor: mentorId,
    status: "pending"
  });

  if (existingRequest) {
    res.status(400);
    throw new Error("You already have a pending request with this mentor for this project");
  }

  const mentorRequest = await MentorRequest.create({
    requester: req.user._id,
    mentor: mentorId,
    project: projectId,
    requestType: "individual", // Can be individual by default, group logic handled by project members
    goals,
    message,
    requestedDuration,
    status: "pending"
  });

  res.status(201).json(mentorRequest);
});`
);

fs.writeFileSync('server/controllers/mentorshipController.js', code);
console.log("Updated createMentorRequest");
